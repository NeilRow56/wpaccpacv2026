import { getUnseenEmailsForConnection } from "@/actions/workflow/get-unseen-emails-for-connection";
import {
  topologicallySorted,
  WorkflowEdge,
  WorkflowNode,
} from "./topo-logicaaly-sorted";
import { db } from "@/db";
import { connections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "../encrypt";
import { executeNode } from "./execute-node";

export function detectProvider(
  label?: string,
  configProvider?: string
): string | null {
  const p = (configProvider || "").toLowerCase();
  if (p) return p;

  const lower = (label || "").toLowerCase();
  if (lower.includes("gmail")) return "gmail";
  if (lower.includes("slack")) return "slack";
  if (lower.includes("discord")) return "discord";
  if (lower.includes("notion")) return "notion";
  if (lower.includes("sheets")) return "sheets";
  if (lower.includes("openai")) return "openai";
  if (lower.includes("gemini")) return "gemini";
  if (lower.includes("claude")) return "claude";
  if (lower.includes("ai generate") || lower.includes("ai-generate"))
    return "ai-generate";
  if (lower.includes("http")) return "http-request";
  if (lower.includes("webhook")) return "webhook-trigger";
  if (lower.includes("schedule")) return "schedule-trigger";

  return null;
}

function renderPrompt(template: string, emails: Array<any>): string {
  const lines = emails?.length
    ? emails
        .map(
          (e, i) =>
            `- [${i + 1}] ${e.subject || "No subject"} - ${e.snippet || ""}`
        )
        .join("\n")
    : "- No unread emails";

  const base = template || "Summarize the following emails:\n\n{{emails}} ";

  let prompt = base
    ?.replace("{{ emails }}", lines)
    .replace("{{counr}}", String(emails?.length ?? 0));

  if (!base.includes("{{emails}}")) {
    prompt = `${prompt}\n\nEmails:\n${lines}`;
  }

  return prompt;
}

async function callOpenAI(
  apiKey: string,
  endpoint: string | undefined,
  prompt: string,
  model?: string
) {
  const url = endpoint || "Https://api.openai.com/v1/chat/completions";
  const chosenModel = model || "gpt-3.5-turbo";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Beareer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: chosenModel,
      messages: [
        { role: "system", content: "You are an email sunnarizer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    }),
  });
  if (!res.ok)
    throw new Error(
      `OpenAI error: ${res.status} ${await res.text().catch(() => "")}`
    );
  const json = await res.json();
  return json?.choices?.[0]?.message?.content || "";
}

async function callGemini(
  apiKey: string,
  endpoint: string | undefined,
  prompt: string,
  model?: string
) {
  const baseModel = model || "gemini-1.5-flash-latest";
  const url =
    endpoint ||
    `https://generativelanguage.googleapis.com/v1beta/models/${baseModel}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  if (!res.ok)
    throw new Error(
      `Gemini error: ${res.status} ${await res.text().catch(() => "")}`
    );
  const json = await res.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callClaude(
  apiKey: string,
  endpoint: string | undefined,
  prompt: string,
  model?: string
) {
  const url = endpoint || "https://api.anthropic.com/v1/messages";
  const chosenModel = model || "claude-3-5-sonnet-20240620";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: chosenModel,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok)
    throw new Error(
      `Claude error: ${res.status} ${await res.text().catch(() => "")}`
    );
  const json = await res.json();
  return json?.content?.[0]?.text || "";
}

async function sendDiscordMessage(webhookUrl: string, content: string) {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok)
    throw new Error(
      `Discord webhook error: ${res.status} ${await res.text().catch(() => "")}`
    );
  return true;
}

async function sendHttpRequest(
  method: string,
  url: string,
  payload: any,
  headers?: Record<string, string>
) {
  const res = await fetch(url, {
    method: method || "POST",
    headers: { " Content-Type": "application/json", ...(headers || {}) },
    body: JSON.stringify(payload),
  });
  if (!res.ok)
    throw new Error(
      `HTTP sink error: ${res.status} ${await res.text().catch(() => "")}`
    );
  return await res.json().catch(() => ({ ok: true }));
}

type ExecutionCtx = {
  triggerProvider?: string | null;
  triggerData?: any[];
  prompt?: string;
  aiProvider?: string;
  aiOutput?: string;
  sinkResult?: any;
  //Include payload in delta logs for sinks
  sinkPayload?: any;
  // Include prompt used for AI steps for diagnostics
  promptUsed?: string;
};

type NodeExecutor = (
  node: WorkflowNode,
  ctx: ExecutionCtx
) => Promise<Partial<ExecutionCtx>>;

const executors: Record<string, NodeExecutor> = {
  gmail: async (node, ctx) => {
    const connectionId = node?.data?.config?.connectionId;
    if (!connectionId) throw new Error("Missing Gmail connectionId");
    const emails = await getUnseenEmailsForConnection(connectionId);
    return { triggerProvider: "gmail", triggerData: emails };
  },

  "ai-generate": async (node, ctx) => {
    const tpl = node?.data?.config?.prompt || "Sumarize:\n\n{{emails}}";
    const prompt = renderPrompt(tpl, ctx.triggerData || []);
    return { prompt };
  },

  openai: async (node, ctx) => {
    let apiKey = node?.data?.config?.apiKey;
    let endpoint = node?.data?.config?.apiEndpoint;
    const model = node?.data?.config?.model;
    const connectionId = node?.data?.config?.connectionId;

    if (!apiKey && connectionId) {
      const rows = await db
        .select()
        .from(connections)
        .where(eq(connections.id, connectionId))
        .limit(1);

      const row = rows[0];
      if (!row?.access_token_enc) throw new Error("Missing OpenAi API key");
      const enc = row.access_token_enc.toString("utf8");
      apiKey = decrypt(enc);
      const meta = (row.metadata as any) || {};
      endpoint = endpoint || meta.endpoint || undefined;
    }

    if (!apiKey) throw new Error("Missing OpenAI API key");
    const output = await callOpenAI(apiKey, endpoint, ctx.prompt || "", model);
    return {
      aiProvider: "openai",
      aiOutput: output,
      promptUsed: ctx.prompt || "",
    };
  },

  gemini: async (node, ctx) => {
    let apiKey = node?.data?.config?.apiKey;
    let endpoint = node?.data?.config?.apiEndpoint;
    const model = node?.data?.config?.model;
    const connectionId = node?.data?.config?.connectionId;

    if (!apiKey && connectionId) {
      const rows = await db
        .select()
        .from(connections)
        .where(eq(connections.id, connectionId))
        .limit(1);

      const row = rows[0];
      if (!row?.access_token_enc) throw new Error("Missing Gemini API key");
      const enc = row.access_token_enc.toString("utf8");
      apiKey = decrypt(enc);
      const meta = (row.metadata as any) || {};
      endpoint = endpoint || meta.endpoint || undefined;
    }

    if (!apiKey) throw new Error("Missing Gemini API key");
    const output = await callGemini(apiKey, endpoint, ctx.prompt || "", model);
    return {
      aiProvider: "gemini",
      aiOutput: output,
    };
  },
  claude: async (node, ctx) => {
    let apiKey = node?.data?.config?.apiKey;
    let endpoint = node?.data?.config?.apiEndpoint;
    const model = node?.data?.config?.model;
    const connectionId = node?.data?.config?.connectionId;

    if (!apiKey && connectionId) {
      const rows = await db
        .select()
        .from(connections)
        .where(eq(connections.id, connectionId))
        .limit(1);

      const row = rows[0];
      if (!row?.access_token_enc) throw new Error("Missing Claude API key");
      const enc = row.access_token_enc.toString("utf8");
      apiKey = decrypt(enc);
      const meta = (row.metadata as any) || {};
      endpoint = endpoint || meta.endpoint || undefined;
    }

    if (!apiKey) throw new Error("Missing Claude API key");
    const output = await callGemini(apiKey, endpoint, ctx.prompt || "", model);
    return {
      aiProvider: "claude",
      aiOutput: output,
    };
  },

  discord: async (node, ctx) => {
    let webhookUrl: string | null = node?.data?.config?.connectionId;
    if (!webhookUrl) {
      const id = node?.data?.config?.connectionId;
      if (id) {
        const rows = await db
          .select()
          .from(connections)
          .where(eq(connections.id, id))
          .limit(1);
        const row = rows[0];
        const meta = (row?.metadata as any) || null;
        webhookUrl = meta.webhook_url || meta.wekhookUrl || null;
      }
    }

    if (!webhookUrl) {
      console.log("error");
      return {
        sinkResult: { ok: false, error: "Discord webhook URL missing." },
      };
    }

    await sendDiscordMessage(webhookUrl, ctx.aiOutput || "(no content)");
    return { sinkResult: { ok: true, provider: "discord" } };
  },

  "http-request": async (node, ctx) => {
    const url = node?.data?.config?.url;
    const method = node?.data?.config?.method || "POST";
    const headers = node?.data?.config?.headers || {};
    if (!url) {
      console.log("error");
      return { sinkResult: { ok: false, error: "HTTP Request URL missing." } };
    }
    const payload = { summary: ctx.aiOutput, emails: ctx.triggerData };
    const res = sendHttpRequest(method, url, payload, headers);
    return { sinkResult: res, sinkPayload: payload };
  },
};

export async function executeWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  options: { stopIfEmptyTriggerProviders?: string[] }
) {
  const ordered = topologicallySorted(nodes || [], edges || []);
  const ctx: ExecutionCtx = {};
  const steps: Array<{
    nodeId: string;
    label?: string;
    result: any;
    status?: "ok" | "error" | "stopped";
    error?: string;
    reason?: string;
    stepNumber?: number;
  }> = [];
  const stopProviders = (options?.stopIfEmptyTriggerProviders || []).map((p) =>
    p.toLowerCase()
  );

  for (let i = 0; i < ordered.length; i++) {
    const node = ordered[i];
    const stepNumber = Number(node?.data?.stepNumber ?? i + 1);
    const provider =
      detectProvider(node?.data?.label, node?.data?.config?.provider) ||
      "unknown";

    try {
      const exec = executors[provider];
      if (exec) {
        const delta = await exec(node, ctx);
        Object.assign(ctx, delta);

        // TODO - add logs
      }
    } catch (error: any) {
      console.log("error");

      const result = await executeNode(node).catch(() => null);
      // TODO - add logs

      steps.push({
        nodeId: node.id,
        label: node?.data?.label,
        result,
        status: "error",
        error: error?.message || String(error),
        stepNumber,
      });

      break;
    }

    if (
      stepNumber === 1 &&
      stopProviders.includes(provider) &&
      Array.isArray(ctx.triggerData) &&
      ctx.triggerData.length === 0
    ) {
      const result = await executeNode(node);
      // TODO - add logs

      console.log("node-response", {
        nodeId: node.id,
        provider,
        stepNumber,
        status: "stopped",
        reason: "empty-trigger",
        result,
      });

      steps.push({
        nodeId: node.id,
        label: node?.data?.label,
        result,
        status: "stopped",
        reason: "empty-trigger",
        stepNumber,
      });

      break;
    }

    const result = await executeNode(node);

    console.log("node-response", {
      nodeId: node.id,
      provider,
      stepNumber,
      status: "ok",
      result,
    });

    steps.push({
      nodeId: node.id,
      label: node?.data?.label,
      result,
      status: "ok",
      stepNumber,
    });
  }

  return {
    ok: true,
    triggerProvider: ctx.triggerProvider || null,
    triggerCount: Array.isArray(ctx.triggerData) ? ctx.triggerData.length : 0,
    triggerData: ctx.triggerData || [],
    aiProvider: ctx.aiProvider || null,
    aiOutput: ctx.aiOutput || "",
    sinkResult: ctx.sinkResult || null,
    steps,
  };
}

import { getUnseenEmailsForConnection } from "@/actions/workflow/get-unseen-emails-for-connection";
import { WorkflowEdge, WorkflowNode } from "./topo-logicaaly-sorted";

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
};

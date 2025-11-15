"use client";

import { useState } from "react";
import { ICON_MAP } from "./flow-utils";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NodeData {
  label: string;
  description: string;
  icon: string;
  isStartNode: boolean;
  stepNumber: number;
}
interface Connection {
  id: string;
  platform: string;
  account_name: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface NodeConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: NodeData | null;
  onConfigured: (stepNumber: number, config?: any) => void;
}

const OAUTH_PROVIDERS = [
  "stripe",
  "gmail",
  "slack",
  "discord",
  "notion",
  "sheets",
];

const API_KEY_PROVIDERS = ["openai", "gemini", "claude"];

const CORE_PROVIDERS = [
  "webhook-trigger",
  "schedule-trigger",
  "http-request",
  "send-notification",
  "ai-generate",
  "delay",
];

const getPlatformName = (label: string): string => {
  const lower = label.toLowerCase();
  if (lower.includes("gmail")) return "gmail";
  if (lower.includes("slack")) return "slack";
  if (lower.includes("discord")) return "discord";
  if (lower.includes("notion")) return "notion";
  if (lower.includes("sheets")) return "sheets";
  if (lower.includes("stripe")) return "stripe";
  if (lower.includes("openai")) return "openai";
  if (lower.includes("claude")) return "claude";
  if (lower.includes("gemini")) return "gemini";
  if (lower.includes("webhook trigger")) return "webhook-trigger";
  if (lower.includes("schedule")) return "schedule-trigger";
  if (lower.includes("http")) return "http-request";
  if (lower.includes("notification")) return "send-notification";
  if (lower.includes("ai generate")) return "ai-generate";
  if (lower.includes("condition")) return "condition";
  if (lower.includes("loop")) return "loop";
  if (lower.includes("delay")) return "delay";

  return label.toLowerCase().replace(/\s+/g, "-");
};

const inputCls =
  "w-full px-3 py-2 bg-[#0B0F14] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-green-400 focus:outline-none";
const selectCls =
  "w-full px-3 py-2 bg-[#0B0F14] border border-gray-600 rounded-md text-white focus:border-green-400 focus:outline-none";

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const isOAuthProvider = (p: string) =>
  OAUTH_PROVIDERS.includes(p.toLowerCase());
const isCoreProvider = (p: string) => CORE_PROVIDERS.includes(p.toLowerCase());
const isApiKeyProvider = (p: string) =>
  API_KEY_PROVIDERS.includes(p.toLowerCase());

export function NodeConfigurationModal({
  isOpen,
  onClose,
  nodeData,
  onConfigured,
}: NodeConfigurationModalProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(
    null
  );
  const [apiKey, setApiKey] = useState("");
  const [apiEndpoint, setApiEndPoint] = useState("");
  const [coreConfig, setCoreConfig] = useState<Record<string, any>>({});
  const getDisplayName = (platform: string): string => {
    const names: Record<string, string> = {
      stripe: "Stripe",
      gmail: "Gmail",
      slack: "Slack",
      discord: "Discord",
      notion: "Notion",
      sheets: "Google Sheets",
      openai: "OpenAI",
      gemini: "Gemini",
      claude: "Claude",
      "webhook-trigger": "Webhook Trigger",
      "schedule-trigger": "Schedule Trigger",
      "http-request": "HTTP Request",
      "send-notification": "Send Notification",
      "ai-generate": "AI Generate",
      condition: "Condition",
      loop: "Loop",
      delay: "Delay",
    };
    return names[platform.toLowerCase()] || platform;
  };

  const IconComponent =
    (nodeData && ICON_MAP[nodeData.icon]) || ICON_MAP.ArrowRight || ArrowRight;

  const platformName = nodeData ? getPlatformName(nodeData.label) : "";
  const isOAuth = isOAuthProvider(platformName);
  const isApiKey = isApiKeyProvider(platformName);
  const isCore = isCoreProvider(platformName);
  const displayName = getDisplayName(platformName);

  if (!isOpen || !nodeData) return null;

  const handleSave = async () => {};

  const handleOAuthConnect = (platform: string) => {};

  const renderCoreConfiguration = () => {
    switch (platformName) {
      case "webhook-trigger":
        return (
          <div className="space-y-3">
            <Field label="webhook URL">
              <div className="p-3 bg-[#0B0F14] border border-gray-600 rounded-md">
                <code className="text-sm text-green-400">
                  https://api.flow.com/webhooks/your-webhook-id
                </code>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                This URL will be generated after saving
              </p>
            </Field>
          </div>
        );

      case "schedule-trigger":
        return (
          <div className="space-y-3">
            <Field label="Schedule Type">
              <select
                className="{selectCls}"
                value={coreConfig.scheduleType || "interval"}
                onChange={(e) =>
                  setCoreConfig({ ...coreConfig, scheduleType: e.target.value })
                }
              >
                <option value="interval">Interval</option>
                <option value="cron">Cron Expression</option>
              </select>
            </Field>
            {coreConfig.scheduleType === "cron" ? (
              <Field label="Cron Expression">
                <input
                  type="text"
                  value={coreConfig.cronExpression || ""}
                  onChange={(e) =>
                    setCoreConfig({
                      ...coreConfig,
                      cronExpression: e.target.value,
                    })
                  }
                  className={inputCls}
                  placeholder="0 */5 * * * *"
                />
              </Field>
            ) : (
              <Field label="Interval (minutes)">
                <input
                  type="number"
                  min={1}
                  value={coreConfig.interval || ""}
                  onChange={(e) =>
                    setCoreConfig({
                      ...coreConfig,
                      interval: e.target.value,
                    })
                  }
                  className={inputCls}
                  placeholder="5"
                />
              </Field>
            )}
          </div>
        );

      case "http:request":
        return (
          <div className="space-y-3">
            <Field label="HTTP Method">
              <select
                className="{selectCls}"
                value={coreConfig.method || "GET"}
                onChange={(e) =>
                  setCoreConfig({ ...coreConfig, method: e.target.value })
                }
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </Field>
            <Field label="URL">
              <input
                type="url"
                value={coreConfig.url || ""}
                onChange={(e) =>
                  setCoreConfig({
                    ...coreConfig,
                    url: e.target.value,
                  })
                }
                className={inputCls}
                placeholder="https://api.example.com/endpoint"
              />
            </Field>
          </div>
        );

      case "send-notification":
        return (
          <div className="space-y-3">
            <Field label="Notification Channel">
              <select
                className="{selectCls}"
                value={coreConfig.channel || "email"}
                onChange={(e) =>
                  setCoreConfig({ ...coreConfig, channel: e.target.value })
                }
              >
                <option value="email">Email</option>
                <option value="slack">Slack</option>
                <option value="discord">Discord</option>
              </select>
            </Field>
            <Field label="Message Template">
              <textarea
                value={coreConfig.message || ""}
                onChange={(e) =>
                  setCoreConfig({
                    ...coreConfig,
                    message: e.target.value,
                  })
                }
                className={`${inputCls} h-20`}
                placeholder="Your notification message..."
              />
            </Field>
          </div>
        );

      case "ai-generate":
        return (
          <div className="space-y-3">
            <Field label="AI Provider">
              <select
                className="{selectCls}"
                value={coreConfig.provider || "openai"}
                onChange={(e) =>
                  setCoreConfig({ ...coreConfig, provider: e.target.value })
                }
              >
                <option value="openai">OpenAI</option>
                <option value="claude">Claude</option>
                <option value="gemini">Gemini</option>
              </select>
            </Field>
            <Field label="Prompt Template">
              <textarea
                value={coreConfig.prompt || ""}
                onChange={(e) =>
                  setCoreConfig({
                    ...coreConfig,
                    prompt: e.target.value,
                  })
                }
                className={`${inputCls} h-20`}
                placeholder="Your AI prompt template..."
              />
            </Field>
          </div>
        );

      case "delay":
        return (
          <div className="space-y-3">
            <Field label="Delay Duration">
              <input
                type="number"
                min={1}
                value={coreConfig.duration || ""}
                onChange={(e) =>
                  setCoreConfig({
                    ...coreConfig,
                    duration: e.target.value,
                  })
                }
                className={inputCls}
                placeholder="5"
              />
            </Field>

            <select
              className="{selectCls}"
              value={coreConfig.unit || "seconds"}
              onChange={(e) =>
                setCoreConfig({ ...coreConfig, unit: e.target.value })
              }
            >
              <option value="millisecons">ms</option>
              <option value="seconds">seconds</option>
              <option value="minutes">minutes</option>
            </select>
          </div>
        );

      default:
        return (
          <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-md">
            <p className="text-sm text-blue-400">
              This {displayName} node is ready to use. No additional
              configuration required.
            </p>
          </div>
        );
    }
  };

  const saveDisabled =
    (isApiKey && !selectedConnection && !apiKey.trim()) ||
    (platformName === "http-request" && !coreConfig.url);

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#1E293B] rounded-lg p-6 w-full max-w-lg mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-[#0B0F14] flex items-center justify-center mr-3">
              <IconComponent className="w-4 h-4 text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              {nodeData.label}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            </div>
          ) : (
            <>
              {isOAuth && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-300 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Connected {displayName} Accounts
                  </h3>
                  <div className="space-y-2">
                    {connections?.length > 0 ? (
                      connections.map((connection) => (
                        <div
                          key={connection.id}
                          className={`p-3 rounded-md bordder cursor-pointer transition-colors ${
                            selectedConnection === connection.id
                              ? "border-green-400 bg-green-900/20"
                              : "border-gray-700 bg-[#0B0F14]"
                          }`}
                          onClick={() => setSelectedConnection(connection.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-white">
                                {connection.account_name}
                              </p>
                              <p className="text-xs text-gray-400">
                                Connecte on{" "}
                                {new Date(
                                  connection.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            {selectedConnection === connection.id && (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-md border border-yellow-600 bg-yellow-900/20">
                        <p className="text-sm text-yellow-300 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          No connected accounts found for {displayName}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between mt-2">
                      <Button
                        variant="outline"
                        className="border-[#334155] text-gray-300 hover;bg-[#1E293B] hover:text-white"
                        onClick={() => handleOAuthConnect(platformName)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Connect {displayName}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

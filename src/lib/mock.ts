export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  steps: string[];
}

export const mockTemplates: Template[] = [
  {
    id: "tpl_stripe_notion",
    name: "Stripe → Notion CRM",
    description:
      "Automatically create customer records in Notion when Stripe payments are received",
    icon: "CreditCard",
    category: "Integrations",
    steps: ["Stripe", "Notion", "Send Notification"],
  },

  {
    id: "tpl_form_sheets",
    name: "Webhook → Sheets → Slack",
    description: "Process form submissions and notify your team instantly",
    icon: "Webhook",
    category: "Integrations",
    steps: ["Webhook Trigger", "Google Sheets", "Slack"],
  },

  {
    id: "tpl_email_ai",
    name: "Gmail → AI Summarize → Discord",
    description: "AI-powered email summaries sent to your Discord server",
    icon: "Mail",
    category: "AI Workflow",
    steps: ["Gmail", "AI Generate", "Discord"],
  },

  {
    id: "tpl_webhook_validate",
    name: "Webhook → Validate → HTTP → Email",
    description: "Process incoming webhooks with validation and notifications",
    icon: "Webhook",
    category: "Core Workflow",
    steps: [
      "Webhook Trigger",
      "Condition",
      "HTTP Request",
      "Send Notification",
    ],
  },

  {
    id: "tpl_schedule_report",
    name: "Daily Report → AI → Slack",
    description: "Generate automated daily reports with AI insights",
    icon: "Clock",
    category: "Automation",
    steps: ["Schedule Trigger", "HTTP Request", "AI Generate", "Slack"],
  },
];

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Bot,
  CreditCard,
  Database,
  FileText,
  Mail,
  Webhook,
} from "lucide-react";

const templates = [
  {
    icon: CreditCard,
    title: "Stripe -> Notion CRM",
    description:
      "Automatically create customer records in Notion when Stripe payments are received",
    tags: ["E-commerce", "CRM", "Popular"],
    color: "border-neon-green/30 hover:border-neon-green/50",
  },
  {
    icon: FileText,
    title: "Google Form -> Sheets -> Slack",
    description:
      "Process form submissions and notify your team with formatted messages",
    tags: ["Forms", "Team", "Notifications"],
    color: "border-neon-blue/30 hover:border-neon-blue/50",
  },
  {
    icon: Mail,
    title: "Gmail -> AI Summarize -> Discord",
    description:
      "Summarize important emails with AI and send alerts to Discord channels",
    tags: ["AI", "Email", "Communication"],
    color: "border-neon-purple/30 hover:border-neon-purple/50",
  },
  {
    icon: Webhook,
    title: "Webhook -> HTTP -> Email",
    description:
      "Transform webhook data and send customized email notifications",
    tags: ["Webhooks", "API", "Email"],
    color: "border-electric-cyan/30 hover:border-electric-cyan/50",
  },
  {
    icon: Database,
    title: "CSV Import -> validation -> CRM",
    description:
      "Import and validate CSV data before syncing to your CRM system",
    tags: ["Data", "Validation", "CRM"],
    color: "border-neon-green/30 hover:border-neon-green/50",
  },
  {
    icon: Bot,
    title: "Social Media Monitor",
    description:
      "Track brand mentions across platforms and get AI-powered sentiment analysis",
    tags: ["Social", "AI", "Monitoring"],
    color: "border-neon-blue/30 hover:border-neon-blue/50",
  },
];

export function TemplatesSection() {
  return (
    <section id="templates" className="py-24 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-secondary bg-clip-text text-transparent leading-tight">
            Start from templates
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Launch your automation journey with battle-tested templates.
            One-click setup, instant results.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {templates.map((template, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card
                className={`p-6 h-full bg-gradient-card border-2 backdrop-blur-sm hover:shadow-glass transition-all duration-300 group cursor-pointer  ${template.color}`}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center mb-4 ">
                    <template.icon className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {template.title}
                  </h3>
                  <h3 className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {template.description}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Ready to use
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </div>
          ))}
        </div>
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-card p-8 rounded-2xl border border-primary/20 backdrop-blur-sm max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">20+ More Templates</h3>
            <p className="text-muted-foreground mb-6">
              Explore our complete library of workflow templates for every use
              case imaginable.
            </p>
            <Button size="lg" className="text-lg px-8">
              Browse All Templates
              <ArrowRight className="w-5 h-6 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

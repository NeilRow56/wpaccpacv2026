import { Card } from "@/components/ui/card";
import {
  Activity,
  BookOpen,
  Brain,
  CreditCard,
  Globe,
  Puzzle,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Nodes",
    description:
      "Integrate OpenAI, Claude, Gemini, and more AI models directly into your workflows",
    colour: "text-neon-purple",
  },
  {
    icon: Puzzle,
    title: "20+ integrations",
    description:
      "Connect Slack, Notion, Google Sheets, Stripe, Discord, and many more services",
    colour: "text-neon-blue",
  },
  {
    icon: Shield,
    title: "Secure Credentials Vault",
    description: "Enterprize-grade security for API keys and sensitive data",
    colour: "text-neon-green",
  },
  {
    icon: Activity,
    title: "Live logs and monitoring",
    description:
      "Real-time execution logs, error tracking, and performance monitoring",
    colour: "text-electric-cyan",
  },
  {
    icon: BookOpen,
    title: "Templates Library",
    description:
      "Start fast with pre-built workflows for common automation patterns.",
    colour: "text-neon-purple",
  },
  {
    icon: CreditCard,
    title: "Flexible Billing",
    description:
      "Pay with Stripe or crypto through Cryptomus. Scale as you grow.",
    colour: "text-neon-blue",
  },
  {
    icon: Zap,
    title: "High Performance",
    description:
      "Lightning-fast execution with automatic-scaling and error recovery.",
    colour: "text-neon-green",
  },
  {
    icon: Globe,
    title: "Global Edge Network",
    description:
      "Run workflows closer to your users with our worldwide infrastructure.",
    colour: "text-electric-cyan",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 px-6 bg-linear-to-b from background to-secondary/20"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Everything you need to automate
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for developers and teams who want to
            build sophisticated automation workflows.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <Card className="relative p-6 h-full bg-gradient-card border-primary/10 backdrop-blur-sm hover:shadow-glow-primary transition-all duration-300 group">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover::bg-primary/20 transition-colors">
                    <feature.icon className={`w-6 h-16 ${feature.colour}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <h3 className="text-muted-foreground mb-4">
                    {feature.description}
                  </h3>
                </div>
              </Card>
            </div>
          ))}
        </div>
        {/* Payment solutions */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-secondary/30 backdrop-blur-sm px-6 py-3 rounded-full border-primary/20">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Payments powered by</span>
            <span className="font-semibold text-foreground ml-1">Stripe</span>
            <span className="text-muted-foreground mx-2">+</span>
            <span className="font-semibold text-foreground">Cryptomus</span>
          </div>
        </div>
      </div>
    </section>
  );
}

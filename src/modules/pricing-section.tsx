import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "£0 ",
    period: "forever",
    description: "Perfect for getting started with workflow automation",
    icon: Zap,
    popular: false,
    features: [
      "100 workflow runs/month",
      "5 active workflows",
      "Basic integrations",
      "Community support",
      "Workflow templates",
      "Basic monitoring",
    ],
    buttonText: "Start Free",
    buttonVariant: "secondary" as const,
  },
  {
    name: "Pro",
    price: "£29 ",
    period: "per month",
    description: "For teams ready to scale their automation workflows",
    icon: Crown,
    popular: true,
    features: [
      "Unlimited active workflows",
      "All integrations + AI nodes",
      "Priority support",
      "Advanced templates",
      "Real-time monitoring",
      "Team collaboration",
      "Custom webhooks",
      "Error retry logic",
    ],
    buttonText: "Start Pro Trial",
    buttonVariant: "hero" as const,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 px-6 bg-linear-to-b from background to secondary/20">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start Free, scale as you grow. No hidden fees, no surprises. Cancel
            anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `{index * 0.1}s` }}
            >
              <Card
                className={`relative p-8 h-full ${
                  plan.popular
                    ? "bg-gradient-card border-2  border-primary/50 shadow-glow-primary"
                    : "bg-gradient-card border border-primary/20"
                } backdrop-blur-sm hover:shadow-glass transition-all duration-300`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most popular
                  </Badge>
                )}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center">
                    <plan.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  variant={plan.buttonVariant}
                >
                  {plan.buttonText}
                </Button>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

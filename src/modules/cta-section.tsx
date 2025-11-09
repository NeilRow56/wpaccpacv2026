import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section
      id="community"
      className="py-24 px-6 bg-linear-to-r from-secondary/20 via-background to-secondary/20"
    >
      <div className="container max-w-4xl mx-auto text-center">
        <div className="animate-fade-in">
          {/* Floating Elements */}
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-4 w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
            <div className="absolute -top-2 -right-8 w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 left-8 w-2.5 h-2.5 bg-accent rounded-full animate-pulse"></div>
            <div className="bg-gradient-card p-12 rounded-3xl border border-primary/50 backdrop-blur-sm shadow-elevated">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Ready to Automate?</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
                Build your first workflow today.
              </h2>
              <br />
              <span className="text-accent">Free forever</span>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of developers and teams who trust FlowX for their
                automation needs. Start building powerful workflows in minutes,
                not hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button size="lg" variant="hero" className="text-lg px-10 py-6">
                  Sign Up Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 hover:text-white"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

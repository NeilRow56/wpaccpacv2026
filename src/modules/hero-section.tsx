import bgwp from "@/assets/bgwp.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/*  Animated background */}
      <div
        className="absolute inset-0 bg-gradient-hero opacity-35"
        style={{
          backgroundImage: `url(${bgwp.src})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      />
      {/* Dark overlay to improve text overlay */}
      <div className="absolute inset-0 bg-background/20" />
      {/* Animated Nodes Overlay */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-neon-green rounded-full animate-glow-pulse"></div>
        <div
          className="absolute top-1/3 right-1/3 w-3 h-3 bg-neon-blue rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/6 w-5 h-5 bg-electric-cyan rounded-full animate-node-glow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-2 h-2 bg-neon-green rounded-full animate-glow-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>
      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-secondary/50 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              Next-Gen Workflow Automation
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Automate Everything.
            <br />
            <span className="text-accent">Smarter.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed ">
            FlowX is the next-gen open SaaS to build and run workflows with AI
            superpowers. Connect any service, automate and process.{" "}
          </p>
          <div className=" flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="hero" className="text-lg px-8 py-6">
              Get Started for Free <ArrowRight className="mr w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 bg-accent/40"
            >
              View templates <Play className="mr w-5 h-5" />
            </Button>
          </div>
          <div className="mt-16 flex items-center justify-center gap-8 text-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-glow-pulse"></div>
              <span> Free Forever Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-neon-blue rounded-full animate-glow-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <span> No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 bg-accent rounded-full animate-glow-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <span> Setup in 2 Minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-bradient-to-t from-background to-transparent"></div>
    </section>
  );
}

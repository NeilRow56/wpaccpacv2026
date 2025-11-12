import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  trend?: "up" | "down" | "neutral";
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  progress,
  trend = "neutral",
  action,
  className,
}: KpiCardProps) {
  return (
    <Card
      className={cn(
        "bg-[#121826] border-[#1E293B] hover:border-green-500/30 transition-all duration-200",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          {action && (
            <Button
              onClick={action.onClick}
              variant="ghost"
              size="sm"
              className="text-xs text-green-400 hover:text"
            >
              {action.label}
            </Button>
          )}
        </div>
        <div className="mb-2 ">
          <div className="text-2xl text-white font-bold">{value}</div>
          {subtitle && <div className="text-sm text-gray-400">{subtitle}</div>}
        </div>
        {progress !== undefined && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2 bg-[#1E293B]" />
            <div className="text-xs text-gray-500 text-right">
              {progress.toFixed(1)}%
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: number;
  total?: number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export function StatCard({ title, value, total, icon: Icon, colorClass, bgClass }: StatCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 800; // ms
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setAnimatedValue(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setAnimatedValue(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);

  const percentage = total && total > 0 ? (value / total) * 100 : 0;

  return (
    <Card className="glass-card overflow-hidden animate-fade-in-up">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium text-text-muted font-sans tracking-wide uppercase">{title}</p>
            <div className="text-4xl font-bold font-syne tracking-tight tabular-nums">
              {animatedValue}
            </div>
          </div>
          <div className={cn("p-3.5 rounded-2xl shadow-inner", bgClass)}>
            <Icon className={cn("w-6 h-6", colorClass)} />
          </div>
        </div>
        {total !== undefined && (
          <div className="mt-4 space-y-2">
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-text-muted">
              {percentage.toFixed(1)}% of total
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

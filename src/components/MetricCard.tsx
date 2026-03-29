import { Card, CardContent } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  accent?: string;
}

export function MetricCard({ title, value, icon, accent }: MetricCardProps) {
  return (
    <Card className={`border-border/50 bg-card/80 backdrop-blur ${accent || ''}`}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-1 truncate text-xl font-semibold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

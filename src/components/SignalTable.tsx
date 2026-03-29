import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Signal } from '@/types/signal';

interface Props {
  signals: Signal[];
  onSelect: (signal: Signal) => void;
}

export function SignalTable({ signals, onSelect }: Props) {
  if (signals.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        No hay señales disponibles
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Timestamp</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Symbol</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Action</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Price</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Confidence</TableHead>
            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signals.map((s) => (
            <TableRow
              key={s.id}
              onClick={() => onSelect(s)}
              className="cursor-pointer border-border/30 transition-colors hover:bg-secondary/60"
            >
              <TableCell className="font-mono text-xs text-muted-foreground">
                {new Date(s.timestamp).toLocaleString()}
              </TableCell>
              <TableCell className="font-semibold">{s.symbol}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    s.action.toUpperCase() === 'BUY'
                      ? 'border-buy/40 text-buy'
                      : s.action.toUpperCase() === 'SELL'
                      ? 'border-sell/40 text-sell'
                      : 'border-border text-muted-foreground'
                  }
                >
                  {s.action.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">${s.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
              <TableCell className="text-right font-mono">{(s.confidence * 100).toFixed(0)}%</TableCell>
              <TableCell className="text-muted-foreground">{s.source}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

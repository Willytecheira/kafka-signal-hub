import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import type { Signal } from '@/types/signal';

interface Props {
  signal: Signal | null;
  open: boolean;
  onClose: () => void;
}

export function SignalDetail({ signal, open, onClose }: Props) {
  if (!signal) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="border-border/50 bg-card sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-foreground">
            <span className="font-semibold">{signal.symbol}</span>
            <Badge
              variant="outline"
              className={
                signal.action.toUpperCase() === 'BUY'
                  ? 'border-buy/40 text-buy'
                  : 'border-sell/40 text-sell'
              }
            >
              {signal.action.toUpperCase()}
            </Badge>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <InfoRow label="Timestamp" value={new Date(signal.timestamp).toLocaleString()} />
          <InfoRow label="Price" value={`$${signal.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
          <InfoRow label="Confidence" value={`${(signal.confidence * 100).toFixed(1)}%`} />
          <InfoRow label="Source" value={signal.source} />
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Payload JSON</p>
            <pre className="max-h-80 overflow-auto rounded-lg bg-secondary p-4 font-mono text-xs text-secondary-foreground">
              {JSON.stringify(signal.payload, null, 2)}
            </pre>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/30 pb-3">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="font-mono text-sm text-foreground">{value}</span>
    </div>
  );
}

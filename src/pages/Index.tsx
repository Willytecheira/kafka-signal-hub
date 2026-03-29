import { useState, useMemo } from 'react';
import { Activity, TrendingUp, TrendingDown, Radio } from 'lucide-react';
import { useSignals } from '@/hooks/useSignals';
import { ConnectionBadge } from '@/components/ConnectionBadge';
import { MetricCard } from '@/components/MetricCard';
import { SignalTable } from '@/components/SignalTable';
import { SignalDetail } from '@/components/SignalDetail';
import { Filters } from '@/components/Filters';
import type { Signal } from '@/types/signal';

export default function Index() {
  const { signals, status, lastUpdated } = useSignals();
  const [selected, setSelected] = useState<Signal | null>(null);
  const [symbolFilter, setSymbolFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = [...signals].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    if (symbolFilter) {
      const q = symbolFilter.toUpperCase();
      list = list.filter((s) => s.symbol.toUpperCase().includes(q));
    }
    if (actionFilter !== 'all') {
      list = list.filter((s) => s.action.toUpperCase() === actionFilter);
    }
    return list;
  }, [signals, symbolFilter, actionFilter]);

  const buyCount = signals.filter((s) => s.action.toUpperCase() === 'BUY').length;
  const sellCount = signals.filter((s) => s.action.toUpperCase() === 'SELL').length;
  const lastSignal = signals.length > 0
    ? [...signals].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Radio className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Kafka Signals</h1>
              <p className="text-xs text-muted-foreground">Monitor de señales en tiempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Actualizado: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <ConnectionBadge status={status} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total señales"
            value={signals.length}
            icon={<Activity className="h-5 w-5" />}
          />
          <MetricCard
            title="Última señal"
            value={lastSignal ? `${lastSignal.symbol} · ${lastSignal.action.toUpperCase()}` : '—'}
            icon={<Radio className="h-5 w-5" />}
          />
          <MetricCard
            title="BUY"
            value={buyCount}
            icon={<TrendingUp className="h-5 w-5 text-buy" />}
          />
          <MetricCard
            title="SELL"
            value={sellCount}
            icon={<TrendingDown className="h-5 w-5 text-sell" />}
          />
        </div>

        {/* Filters + Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Señales ({filtered.length})
            </h2>
            <Filters
              symbolFilter={symbolFilter}
              actionFilter={actionFilter}
              onSymbolChange={setSymbolFilter}
              onActionChange={setActionFilter}
            />
          </div>
          <SignalTable signals={filtered} onSelect={setSelected} />
        </div>
      </main>

      {/* Detail Panel */}
      <SignalDetail signal={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}

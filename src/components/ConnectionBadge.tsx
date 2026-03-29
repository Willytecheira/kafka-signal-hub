import type { ConnectionStatus } from '@/types/signal';

const config: Record<ConnectionStatus, { label: string; className: string }> = {
  connected: { label: 'Conectado', className: 'bg-success/20 text-success' },
  'no-data': { label: 'Sin datos', className: 'bg-warning/20 text-warning' },
  error: { label: 'Error', className: 'bg-destructive/20 text-destructive' },
};

export function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${className}`}>
      <span className={`h-2 w-2 rounded-full animate-pulse-glow ${
        status === 'connected' ? 'bg-success' : status === 'no-data' ? 'bg-warning' : 'bg-destructive'
      }`} />
      {label}
    </span>
  );
}

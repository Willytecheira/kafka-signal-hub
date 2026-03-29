export interface Signal {
  id: string;
  timestamp: string;
  symbol: string;
  action: string;
  price: number;
  confidence: number;
  source: string;
  payload: Record<string, unknown>;
}

export type ConnectionStatus = 'connected' | 'no-data' | 'error';

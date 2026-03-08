export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  direction: 'long' | 'short';
  entry_price: number;
  exit_price: number | null;
  quantity: number;
  entry_date: string;
  exit_date: string | null;
  stop_loss: number | null;
  risk_amount: number | null;
  status: 'open' | 'closed';
  notes: string | null;
  created_at: string;
}

export interface TradeForm {
  symbol: string;
  direction: 'long' | 'short';
  entry_price: string;
  exit_price: string;
  quantity: string;
  entry_date: string;
  exit_date: string;
  stop_loss: string;
  risk_amount: string;
  status: 'open' | 'closed';
  notes: string;
}

export interface Metrics {
  totalTrades: number;
  closedTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPnl: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  avgR: number;
  maxDrawdown: number;
  bestTrade: number;
  worstTrade: number;
}

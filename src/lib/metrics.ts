import type { Trade, Metrics } from '@/types';

export function calcPnl(trade: Trade): number {
  if (!trade.exit_price || trade.status === 'open') return 0;
  return trade.direction === 'long'
    ? (trade.exit_price - trade.entry_price) * trade.quantity
    : (trade.entry_price - trade.exit_price) * trade.quantity;
}

export function calcR(trade: Trade): number | null {
  if (!trade.risk_amount || trade.risk_amount === 0) return null;
  return calcPnl(trade) / trade.risk_amount;
}

export function computeMetrics(trades: Trade[]): Metrics {
  const closed = trades.filter(t => t.status === 'closed' && t.exit_price != null);
  const pnls = closed.map(calcPnl);
  const wins = pnls.filter(p => p > 0);
  const losses = pnls.filter(p => p <= 0);

  const grossProfit = wins.reduce((s, p) => s + p, 0);
  const grossLoss = Math.abs(losses.reduce((s, p) => s + p, 0));
  const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? Infinity : 0) : grossProfit / grossLoss;

  // Max drawdown sur l'equity curve
  let peak = 0;
  let equity = 0;
  let maxDrawdown = 0;
  const sortedClosed = [...closed].sort(
    (a, b) => new Date(a.exit_date!).getTime() - new Date(b.exit_date!).getTime()
  );
  for (const t of sortedClosed) {
    equity += calcPnl(t);
    if (equity > peak) peak = equity;
    const dd = peak > 0 ? ((peak - equity) / peak) * 100 : 0;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }

  // Average R
  const Rs = closed.map(calcR).filter((r): r is number => r !== null);
  const avgR = Rs.length > 0 ? Rs.reduce((s, r) => s + r, 0) / Rs.length : 0;

  return {
    totalTrades: trades.length,
    closedTrades: closed.length,
    wins: wins.length,
    losses: losses.length,
    winRate: closed.length > 0 ? (wins.length / closed.length) * 100 : 0,
    totalPnl: pnls.reduce((s, p) => s + p, 0),
    grossProfit,
    grossLoss,
    profitFactor,
    avgWin: wins.length > 0 ? grossProfit / wins.length : 0,
    avgLoss: losses.length > 0 ? grossLoss / losses.length : 0,
    avgR,
    maxDrawdown,
    bestTrade: pnls.length > 0 ? Math.max(...pnls) : 0,
    worstTrade: pnls.length > 0 ? Math.min(...pnls) : 0,
  };
}

export function buildEquityCurve(trades: Trade[]) {
  const closed = trades
    .filter(t => t.status === 'closed' && t.exit_price != null && t.exit_date)
    .sort((a, b) => new Date(a.exit_date!).getTime() - new Date(b.exit_date!).getTime());

  let equity = 0;
  return closed.map(t => {
    equity += calcPnl(t);
    return { date: t.exit_date!, value: equity };
  });
}

import type { Metrics } from '@/types';

const eur = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v);
const pct = (v: number) => `${v.toFixed(1)}%`;

export default function MetricsGrid({ metrics: m }: { metrics: Metrics }) {
  const cards = [
    { label: 'P&L Total',      value: eur(m.totalPnl),    color: m.totalPnl >= 0 ? 'text-green-400' : 'text-red-400' },
    { label: 'Win Rate',       value: pct(m.winRate),     color: m.winRate >= 50 ? 'text-green-400' : 'text-red-400'  },
    { label: 'Profit Factor',  value: isFinite(m.profitFactor) ? m.profitFactor.toFixed(2) : '∞', color: m.profitFactor >= 1 ? 'text-green-400' : 'text-red-400' },
    { label: 'Avg R',          value: `${m.avgR >= 0 ? '+' : ''}${m.avgR.toFixed(2)}R`, color: m.avgR >= 0 ? 'text-green-400' : 'text-red-400' },
    { label: 'Max Drawdown',   value: pct(m.maxDrawdown), color: m.maxDrawdown > 20 ? 'text-red-400' : 'text-yellow-400' },
    { label: 'Trades fermés',  value: `${m.wins}W / ${m.losses}L`, color: 'text-white' },
    { label: 'Meilleur trade', value: eur(m.bestTrade),   color: 'text-green-400' },
    { label: 'Pire trade',     value: eur(m.worstTrade),  color: 'text-red-400'   },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{c.label}</p>
          <p className={`text-lg font-semibold ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

'use client';

import type { Metrics } from '@/types';

const eur = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(v);

function StatCard({ label, value, sub, up }: { label: string; value: string; sub?: string; up?: boolean | null }) {
  const color = up === null || up === undefined ? '#eaecef' : up ? '#0ecb81' : '#f6465d';
  return (
    <div className="rounded-xl p-4 border transition-all hover:border-gray-600"
      style={{ background: '#161a1e', borderColor: '#2b3139' }}>
      <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#848e9c' }}>{label}</p>
      <p className="text-xl font-bold num" style={{ color }}>{value}</p>
      {sub && <p className="text-xs mt-1 num" style={{ color: '#848e9c' }}>{sub}</p>}
    </div>
  );
}

export default function MetricsGrid({ metrics: m }: { metrics: Metrics }) {
  const pnlUp = m.totalPnl >= 0;

  return (
    <div className="space-y-3">
      {/* Big P&L banner */}
      <div className="rounded-xl p-5 border flex items-center justify-between flex-wrap gap-4"
        style={{ background: '#161a1e', borderColor: '#2b3139' }}>
        <div>
          <p className="text-xs uppercase tracking-widest mb-1 font-medium" style={{ color: '#848e9c' }}>P&L Total</p>
          <p className="text-4xl font-black num" style={{ color: pnlUp ? '#0ecb81' : '#f6465d' }}>
            {pnlUp ? '+' : ''}{eur(m.totalPnl)}
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-xs mb-0.5" style={{ color: '#848e9c' }}>Profit brut</p>
            <p className="font-semibold num up">+{eur(m.grossProfit)}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: '#848e9c' }}>Perte brute</p>
            <p className="font-semibold num dn">-{eur(m.grossLoss)}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: '#848e9c' }}>Trades fermés</p>
            <p className="font-semibold text-white num">{m.closedTrades}</p>
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: '#848e9c' }}>Win / Loss</p>
            <p className="font-semibold num">
              <span className="up">{m.wins}W</span>
              <span style={{ color: '#474d57' }}> / </span>
              <span className="dn">{m.losses}L</span>
            </p>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          label="Win Rate"
          value={`${m.winRate.toFixed(1)}%`}
          sub={`${m.wins} gagnants`}
          up={m.winRate >= 50}
        />
        <StatCard
          label="Profit Factor"
          value={isFinite(m.profitFactor) ? m.profitFactor.toFixed(2) : '∞'}
          sub="Ratio G/P"
          up={m.profitFactor >= 1}
        />
        <StatCard
          label="Avg R"
          value={`${m.avgR >= 0 ? '+' : ''}${m.avgR.toFixed(2)}R`}
          sub="Espérance"
          up={m.avgR >= 0}
        />
        <StatCard
          label="Max Drawdown"
          value={`${m.maxDrawdown.toFixed(1)}%`}
          sub="Du pic"
          up={m.maxDrawdown <= 20 ? true : false}
        />
        <StatCard
          label="Best / Worst"
          value={`+${eur(m.bestTrade)}`}
          sub={`${eur(m.worstTrade)}`}
          up={null}
        />
      </div>
    </div>
  );
}

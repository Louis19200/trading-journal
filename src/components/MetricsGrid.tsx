'use client';

import type { Metrics } from '@/types';
import { MagicCard } from '@/components/magicui/magic-card';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { AnimatedCircularProgressBar } from '@/components/magicui/animated-circular-progress-bar';

export default function MetricsGrid({ metrics: m }: { metrics: Metrics }) {
  const pnlPositive = m.totalPnl >= 0;
  const pfGood = m.profitFactor >= 1;
  const rGood = m.avgR >= 0;

  return (
    <div className="space-y-3">
      {/* Ligne principale — P&L + Win Rate mis en avant */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* P&L Total — card large */}
        <MagicCard
          className="col-span-1 md:col-span-2 bg-gray-900/80 border-gray-800 rounded-2xl p-6 cursor-default"
          gradientColor={pnlPositive ? '#064e3b' : '#450a0a'}
          gradientOpacity={0.4}
        >
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">P&L Total</p>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold tabular-nums ${pnlPositive ? 'text-green-400' : 'text-red-400'}`}>
              {pnlPositive ? '+' : '-'}
              <NumberTicker
                value={Math.abs(m.totalPnl)}
                decimalPlaces={2}
                className={pnlPositive ? 'text-green-400' : 'text-red-400'}
              />
              €
            </span>
          </div>
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-gray-500 text-xs">Profit brut</p>
              <p className="text-green-400 font-medium text-sm">+{m.grossProfit.toFixed(2)}€</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Perte brute</p>
              <p className="text-red-400 font-medium text-sm">-{m.grossLoss.toFixed(2)}€</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Trades fermés</p>
              <p className="text-white font-medium text-sm">{m.closedTrades}</p>
            </div>
          </div>
        </MagicCard>

        {/* Win Rate — circular */}
        <MagicCard
          className="bg-gray-900/80 border-gray-800 rounded-2xl p-6 cursor-default flex flex-col items-center justify-center"
          gradientColor="#1e1b4b"
          gradientOpacity={0.5}
        >
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Win Rate</p>
          <AnimatedCircularProgressBar
            value={m.winRate}
            max={100}
            min={0}
            gaugePrimaryColor={m.winRate >= 50 ? '#10b981' : '#ef4444'}
            gaugeSecondaryColor="#1f2937"
            className="w-24 h-24"
          />
          <p className="text-gray-400 text-xs mt-3">{m.wins}W / {m.losses}L</p>
        </MagicCard>
      </div>

      {/* Ligne secondaire — métriques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            label: 'Profit Factor',
            value: isFinite(m.profitFactor) ? m.profitFactor.toFixed(2) : '∞',
            ticker: isFinite(m.profitFactor) ? m.profitFactor : null,
            decimals: 2,
            color: pfGood ? 'text-green-400' : 'text-red-400',
            gradient: pfGood ? '#064e3b' : '#450a0a',
          },
          {
            label: 'Avg R',
            value: `${rGood ? '+' : ''}${m.avgR.toFixed(2)}R`,
            ticker: Math.abs(m.avgR),
            decimals: 2,
            color: rGood ? 'text-green-400' : 'text-red-400',
            gradient: rGood ? '#064e3b' : '#450a0a',
          },
          {
            label: 'Max Drawdown',
            value: `${m.maxDrawdown.toFixed(1)}%`,
            ticker: m.maxDrawdown,
            decimals: 1,
            color: m.maxDrawdown > 20 ? 'text-red-400' : 'text-yellow-400',
            gradient: '#422006',
          },
          {
            label: 'Meilleur trade',
            value: `+${m.bestTrade.toFixed(2)}€`,
            ticker: m.bestTrade,
            decimals: 2,
            color: 'text-green-400',
            gradient: '#064e3b',
          },
          {
            label: 'Pire trade',
            value: `${m.worstTrade.toFixed(2)}€`,
            ticker: Math.abs(m.worstTrade),
            decimals: 2,
            color: 'text-red-400',
            gradient: '#450a0a',
          },
        ].map(card => (
          <MagicCard
            key={card.label}
            className="bg-gray-900/80 border-gray-800 rounded-2xl p-4 cursor-default"
            gradientColor={card.gradient}
            gradientOpacity={0.35}
          >
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{card.label}</p>
            <p className={`text-xl font-bold tabular-nums ${card.color}`}>
              {card.ticker !== null && card.ticker !== undefined ? (
                <>
                  {card.label === 'Avg R' && (m.avgR >= 0 ? '+' : '-')}
                  {card.label === 'Pire trade' && '-'}
                  <NumberTicker
                    value={card.ticker}
                    decimalPlaces={card.decimals}
                    className={card.color}
                  />
                  {card.label === 'Max Drawdown' ? '%' : card.label.includes('trade') ? '€' : card.label === 'Avg R' ? 'R' : ''}
                </>
              ) : (
                card.value
              )}
            </p>
          </MagicCard>
        ))}
      </div>
    </div>
  );
}

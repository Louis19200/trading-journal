'use client';

import type { Trade } from '@/types';
import { calcPnl, calcR } from '@/lib/metrics';
import { useState } from 'react';

const eur = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v);

export default function TradesList({
  trades, onEdit, onDelete,
}: {
  trades: Trade[];
  onEdit: (t: Trade) => void;
  onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

  const filtered = trades.filter(t =>
    filter === 'all' ? true : t.status === filter
  );

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: '#161a1e', borderColor: '#2b3139' }}>
      {/* Header */}
      <div className="px-5 py-3 border-b flex items-center justify-between gap-3 flex-wrap"
        style={{ borderColor: '#2b3139' }}>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white text-sm">Historique des trades</p>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#2b3139', color: '#848e9c' }}>
            {trades.length}
          </span>
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ background: '#0b0e11' }}>
          {(['all', 'open', 'closed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all capitalize"
              style={{
                background: filter === f ? '#2b3139' : 'transparent',
                color: filter === f ? '#eaecef' : '#848e9c',
              }}
            >
              {f === 'all' ? 'Tous' : f === 'open' ? 'Ouverts' : 'Fermés'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #2b3139' }}>
              {['#', 'Symbole', 'Direction', 'Entrée', 'Sortie', 'Qté', 'P&L', 'R', 'Statut', ''].map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider"
                  style={{ color: '#848e9c', textAlign: i <= 1 ? 'left' : 'right' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, idx) => {
              const pnl = calcPnl(t);
              const r = calcR(t);
              const isOpen = t.status === 'open';
              const pnlColor = isOpen ? '#848e9c' : pnl >= 0 ? '#0ecb81' : '#f6465d';

              return (
                <tr
                  key={t.id}
                  className="group transition-colors"
                  style={{ borderBottom: '1px solid #1e2329' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1e2329')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-4 py-3.5 text-xs" style={{ color: '#474d57' }}>{idx + 1}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                        style={{ background: '#2b3139', color: '#eaecef' }}>
                        {t.symbol.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-xs">{t.symbol.toUpperCase()}</p>
                        <p className="text-xs" style={{ color: '#474d57' }}>{t.entry_date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{
                        background: t.direction === 'long' ? '#0ecb8115' : '#f6465d15',
                        color: t.direction === 'long' ? '#0ecb81' : '#f6465d',
                      }}>
                      {t.direction === 'long' ? '▲' : '▼'} {t.direction.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs num" style={{ color: '#eaecef' }}>
                    {eur(t.entry_price)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs num" style={{ color: '#eaecef' }}>
                    {t.exit_price ? eur(t.exit_price) : <span style={{ color: '#474d57' }}>—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs num" style={{ color: '#848e9c' }}>
                    {t.quantity}
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs font-bold num" style={{ color: pnlColor }}>
                    {isOpen ? <span style={{ color: '#474d57' }}>—</span> : (
                      <>{pnl >= 0 ? '+' : ''}{eur(pnl)}</>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs font-medium num"
                    style={{ color: r !== null ? (r >= 0 ? '#0ecb81' : '#f6465d') : '#474d57' }}>
                    {r !== null ? `${r >= 0 ? '+' : ''}${r.toFixed(2)}R` : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{
                        background: isOpen ? '#00b4d815' : '#2b3139',
                        color: isOpen ? '#00b4d8' : '#848e9c',
                      }}>
                      {isOpen ? '● Live' : '✓ Closed'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(t)}
                        className="w-6 h-6 rounded flex items-center justify-center text-xs transition-colors"
                        style={{ color: '#848e9c' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#2b3139'; e.currentTarget.style.color = '#0ecb81'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#848e9c'; }}
                      >✎</button>
                      <button
                        onClick={() => onDelete(t.id)}
                        className="w-6 h-6 rounded flex items-center justify-center text-xs transition-colors"
                        style={{ color: '#848e9c' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f6465d15'; e.currentTarget.style.color = '#f6465d'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#848e9c'; }}
                      >✕</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

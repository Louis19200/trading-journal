'use client';

import type { Trade } from '@/types';
import { calcPnl, calcR } from '@/lib/metrics';
import { BorderBeam } from '@/components/magicui/border-beam';

const eur = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v);

export default function TradesList({
  trades, onEdit, onDelete,
}: {
  trades: Trade[];
  onEdit: (t: Trade) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="relative bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden">
      <BorderBeam size={200} duration={15} colorFrom="#6366f1" colorTo="#8b5cf6" borderWidth={1} />

      <div className="px-5 py-4 border-b border-gray-800/50 flex items-center justify-between">
        <h2 className="font-semibold text-white">Historique</h2>
        <span className="text-gray-500 text-sm bg-gray-800 px-2.5 py-0.5 rounded-full">{trades.length} trades</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b border-gray-800/50">
              {['Symbole', 'Direction', 'Entrée', 'Sortie', 'Qté', 'P&L', 'R', 'Statut', ''].map((h, i) => (
                <th key={i} className={`px-4 py-3 font-medium tracking-wider ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map(t => {
              const pnl = calcPnl(t);
              const r = calcR(t);
              const pnlColor = t.status === 'open' ? 'text-gray-400' : pnl >= 0 ? 'text-green-400' : 'text-red-400';

              return (
                <tr
                  key={t.id}
                  className="border-t border-gray-800/40 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{t.symbol.toUpperCase()}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{t.entry_date}</p>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      t.direction === 'long'
                        ? 'bg-green-950 text-green-400 ring-1 ring-green-800'
                        : 'bg-red-950 text-red-400 ring-1 ring-red-800'
                    }`}>
                      {t.direction === 'long' ? '▲ LONG' : '▼ SHORT'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-300">{eur(t.entry_price)}</td>
                  <td className="px-4 py-3.5 text-right text-gray-300">
                    {t.exit_price ? eur(t.exit_price) : <span className="text-gray-700">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-right text-gray-400">{t.quantity}</td>
                  <td className={`px-4 py-3.5 text-right font-semibold ${pnlColor}`}>
                    {t.status === 'open' ? <span className="text-gray-700">—</span> : (
                      <span>{pnl >= 0 ? '+' : ''}{eur(pnl)}</span>
                    )}
                  </td>
                  <td className={`px-4 py-3.5 text-right text-xs font-medium ${
                    r !== null ? (r >= 0 ? 'text-green-400' : 'text-red-400') : 'text-gray-700'
                  }`}>
                    {r !== null ? `${r >= 0 ? '+' : ''}${r.toFixed(2)}R` : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      t.status === 'open'
                        ? 'bg-blue-950 text-blue-400 ring-1 ring-blue-800'
                        : 'bg-gray-800 text-gray-500'
                    }`}>
                      {t.status === 'open' ? '● Ouvert' : '✓ Fermé'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(t)} className="text-gray-600 hover:text-indigo-400 transition-colors p-1 rounded hover:bg-indigo-950">✎</button>
                      <button onClick={() => onDelete(t.id)} className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-950">✕</button>
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

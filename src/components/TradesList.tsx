'use client';

import type { Trade } from '@/types';
import { calcPnl, calcR } from '@/lib/metrics';

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
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-semibold">Historique</h2>
        <span className="text-gray-400 text-sm">{trades.length} trades</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs uppercase border-b border-gray-800">
              {['Symbole', 'Direction', 'Entrée', 'Sortie', 'Qté', 'P&L', 'R', 'Statut', ''].map((h, i) => (
                <th key={i} className={`px-4 py-3 ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map(t => {
              const pnl = calcPnl(t);
              const r = calcR(t);
              const pnlColor = t.status === 'open' ? 'text-gray-400' : pnl >= 0 ? 'text-green-400' : 'text-red-400';

              return (
                <tr key={t.id} className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{t.symbol.toUpperCase()}</p>
                    <p className="text-gray-500 text-xs">{t.entry_date}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${t.direction === 'long' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                      {t.direction.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{eur(t.entry_price)}</td>
                  <td className="px-4 py-3 text-right">{t.exit_price ? eur(t.exit_price) : <span className="text-gray-600">—</span>}</td>
                  <td className="px-4 py-3 text-right text-gray-300">{t.quantity}</td>
                  <td className={`px-4 py-3 text-right font-medium ${pnlColor}`}>
                    {t.status === 'open' ? '—' : eur(pnl)}
                  </td>
                  <td className={`px-4 py-3 text-right text-xs ${r !== null ? (r >= 0 ? 'text-green-400' : 'text-red-400') : 'text-gray-600'}`}>
                    {r !== null ? `${r >= 0 ? '+' : ''}${r.toFixed(2)}R` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded ${t.status === 'open' ? 'bg-blue-900/50 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                      {t.status === 'open' ? 'Ouvert' : 'Fermé'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEdit(t)} className="text-gray-500 hover:text-indigo-400 transition-colors text-xs">✎</button>
                      <button onClick={() => onDelete(t.id)} className="text-gray-500 hover:text-red-400 transition-colors text-xs">✕</button>
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

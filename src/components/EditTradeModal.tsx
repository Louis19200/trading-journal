'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { Trade, TradeForm } from '@/types';

export default function EditTradeModal({
  trade, onClose, onSaved,
}: {
  trade: Trade;
  onClose: () => void;
  onSaved: (trade: Trade) => void;
}) {
  const [form, setForm] = useState<TradeForm>({
    symbol: trade.symbol,
    direction: trade.direction,
    entry_price: String(trade.entry_price),
    exit_price: trade.exit_price ? String(trade.exit_price) : '',
    quantity: String(trade.quantity),
    entry_date: trade.entry_date,
    exit_date: trade.exit_date ?? '',
    stop_loss: trade.stop_loss ? String(trade.stop_loss) : '',
    risk_amount: trade.risk_amount ? String(trade.risk_amount) : '',
    status: trade.status,
    notes: trade.notes ?? '',
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const set = (k: keyof TradeForm, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      symbol: form.symbol.toUpperCase(),
      direction: form.direction,
      entry_price: parseFloat(form.entry_price),
      exit_price: form.exit_price ? parseFloat(form.exit_price) : null,
      quantity: parseFloat(form.quantity),
      entry_date: form.entry_date,
      exit_date: form.exit_date || null,
      stop_loss: form.stop_loss ? parseFloat(form.stop_loss) : null,
      risk_amount: form.risk_amount ? parseFloat(form.risk_amount) : null,
      status: form.status,
      notes: form.notes || null,
    };

    const { data, error } = await supabase
      .from('trades').update(payload).eq('id', trade.id).select().single();

    if (!error) onSaved(data as Trade);
    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Modifier — {trade.symbol}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Prix entrée (€)', key: 'entry_price' },
              { label: 'Prix sortie (€)', key: 'exit_price' },
              { label: 'Quantité',         key: 'quantity'    },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
                <input type="number" step="any" min="0"
                  value={form[key as keyof TradeForm]}
                  onChange={e => set(key as keyof TradeForm, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Date entrée', key: 'entry_date', type: 'date' },
              { label: 'Date sortie', key: 'exit_date',  type: 'date' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
                <input type={type}
                  value={form[key as keyof TradeForm]}
                  onChange={e => set(key as keyof TradeForm, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Statut</label>
            <div className="flex gap-2">
              {(['open', 'closed'] as const).map(s => (
                <button type="button" key={s} onClick={() => set('status', s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.status === s ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {s === 'open' ? '🔵 Ouvert' : '✅ Fermé'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-medium py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </form>
      </div>
    </div>
  );
}

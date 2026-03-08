'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { Trade, TradeForm } from '@/types';

const defaultForm: TradeForm = {
  symbol: '', direction: 'long', entry_price: '', exit_price: '',
  quantity: '', entry_date: new Date().toISOString().split('T')[0],
  exit_date: '', stop_loss: '', risk_amount: '', status: 'open', notes: '',
};

export default function AddTradeModal({
  onClose, onSaved,
}: {
  onClose: () => void;
  onSaved: (trade: Trade) => void;
}) {
  const [form, setForm] = useState<TradeForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const set = (k: keyof TradeForm, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Non authentifié'); setLoading(false); return; }

    const payload = {
      user_id: user.id,
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

    const { data, error: err } = await supabase.from('trades').insert(payload).select().single();
    if (err) { setError(err.message); setLoading(false); return; }
    onSaved(data as Trade);
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Nouveau trade</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Symbole + Direction */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Symbole</label>
              <input value={form.symbol} onChange={e => set('symbol', e.target.value)}
                placeholder="AAPL, BTC..." required
                className="input-field w-full" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Direction</label>
              <div className="flex gap-2">
                {(['long', 'short'] as const).map(d => (
                  <button type="button" key={d}
                    onClick={() => set('direction', d)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      form.direction === d
                        ? d === 'long' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {d === 'long' ? '▲ Long' : '▼ Short'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prix + Qté */}
          <div className="grid grid-cols-3 gap-3">
            <Field label="Prix entrée (€)" value={form.entry_price} onChange={v => set('entry_price', v)} placeholder="100" required />
            <Field label="Prix sortie (€)" value={form.exit_price} onChange={v => set('exit_price', v)} placeholder="—" />
            <Field label="Quantité" value={form.quantity} onChange={v => set('quantity', v)} placeholder="10" required />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date entrée" value={form.entry_date} onChange={v => set('entry_date', v)} type="date" required />
            <Field label="Date sortie" value={form.exit_date} onChange={v => set('exit_date', v)} type="date" />
          </div>

          {/* Risk */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stop loss (€)" value={form.stop_loss} onChange={v => set('stop_loss', v)} placeholder="95" />
            <Field label="Risque (€)" value={form.risk_amount} onChange={v => set('risk_amount', v)} placeholder="50" />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Statut</label>
            <div className="flex gap-2">
              {(['open', 'closed'] as const).map(s => (
                <button type="button" key={s}
                  onClick={() => set('status', s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.status === s ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {s === 'open' ? '🔵 Ouvert' : '✅ Fermé'}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Setup, raison du trade..."
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none text-white"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-medium py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Enregistrement…' : 'Enregistrer le trade'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required, type = 'number' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required} step="any" min="0"
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
}

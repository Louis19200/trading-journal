'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { Trade, TradeForm } from '@/types';
import { ShineBorder } from '@/components/magicui/shine-border';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

const defaultForm: TradeForm = {
  symbol: '',
  direction: 'long',
  entry_price: '',
  exit_price: '',
  quantity: '',
  entry_date: new Date().toISOString().split('T')[0],
  exit_date: '',
  stop_loss: '',
  risk_amount: '',
  status: 'open',
  notes: '',
};

export default function AddTradeModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (trade: Trade) => void;
}) {
  const [form, setForm] = useState<TradeForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const set = (k: keyof TradeForm, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Non authentifié');
      setLoading(false);
      return;
    }

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

    const { data, error: err } = await supabase
      .from('trades')
      .insert(payload)
      .select()
      .single();

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    onSaved(data as Trade);
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <ShineBorder
        className="bg-gray-900 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        shineColor={['#6366f1', '#8b5cf6', '#ec4899']}
        borderWidth={1.5}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Nouveau trade</h2>
            <p className="text-gray-500 text-xs mt-0.5">Enregistre ta position</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Symbole + Direction */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Symbole</label>
              <input
                value={form.symbol}
                onChange={e => set('symbol', e.target.value)}
                placeholder="AAPL, BTC..."
                required
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Direction</label>
              <div className="flex gap-2 h-[46px]">
                {(['long', 'short'] as const).map(d => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => set('direction', d)}
                    className={`flex-1 rounded-xl text-sm font-semibold transition-all ${
                      form.direction === d
                        ? d === 'long'
                          ? 'bg-green-900/60 text-green-400 ring-1 ring-green-700'
                          : 'bg-red-900/60 text-red-400 ring-1 ring-red-700'
                        : 'bg-gray-800/60 text-gray-500 hover:text-white hover:bg-gray-700/60'
                    }`}
                  >
                    {d === 'long' ? '▲ Long' : '▼ Short'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prix entrée / sortie / quantité */}
          <div className="grid grid-cols-3 gap-3">
            <Field
              label="Prix entrée (€)"
              value={form.entry_price}
              onChange={v => set('entry_price', v)}
              placeholder="100"
              required
            />
            <Field
              label="Prix sortie (€)"
              value={form.exit_price}
              onChange={v => set('exit_price', v)}
              placeholder="—"
            />
            <Field
              label="Quantité"
              value={form.quantity}
              onChange={v => set('quantity', v)}
              placeholder="10"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Date entrée"
              value={form.entry_date}
              onChange={v => set('entry_date', v)}
              type="date"
              required
            />
            <Field
              label="Date sortie"
              value={form.exit_date}
              onChange={v => set('exit_date', v)}
              type="date"
            />
          </div>

          {/* Stop loss + Risque */}
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Stop loss (€)"
              value={form.stop_loss}
              onChange={v => set('stop_loss', v)}
              placeholder="95"
            />
            <Field
              label="Risque (€)"
              value={form.risk_amount}
              onChange={v => set('risk_amount', v)}
              placeholder="50"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Statut</label>
            <div className="flex gap-2">
              {(['open', 'closed'] as const).map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => set('status', s)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    form.status === s
                      ? 'bg-indigo-900/60 text-indigo-300 ring-1 ring-indigo-700'
                      : 'bg-gray-800/60 text-gray-500 hover:text-white hover:bg-gray-700/60'
                  }`}
                >
                  {s === 'open' ? '● Ouvert' : '✓ Fermé'}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Setup, raison du trade, émotions..."
              rows={2}
              className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-2.5">
              <p className="text-red-400 text-sm">⚠ {error}</p>
            </div>
          )}

          {/* Submit */}
          <ShimmerButton
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-medium rounded-xl disabled:opacity-40"
            shimmerColor="#a78bfa"
            background="linear-gradient(135deg, #4f46e5, #7c3aed)"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enregistrement…
              </span>
            ) : (
              '✦ Enregistrer le trade'
            )}
          </ShimmerButton>
        </form>
      </ShineBorder>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, required, type = 'number',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        step="any"
        min="0"
        className="input-field w-full"
      />
    </div>
  );
}

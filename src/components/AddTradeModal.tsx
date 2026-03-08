'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { Trade, TradeForm } from '@/types';

const defaultForm: TradeForm = {
  symbol: '', direction: 'long', entry_price: '', exit_price: '',
  quantity: '', entry_date: new Date().toISOString().split('T')[0],
  exit_date: '', stop_loss: '', risk_amount: '', status: 'open', notes: '',
};

const inputStyle = {
  background: '#0b0e11',
  border: '1px solid #2b3139',
  color: '#eaecef',
  borderRadius: 10,
  padding: '10px 14px',
  fontSize: 13,
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.15s',
};

function Field({ label, value, onChange, placeholder, required, type = 'number' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: '#848e9c', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required} step="any" min="0"
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = '#0ecb81')}
        onBlur={e => (e.target.style.borderColor = '#2b3139')}
      />
    </div>
  );
}

export default function AddTradeModal({ onClose, onSaved }: {
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
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#161a1e', border: '1px solid #2b3139', borderRadius: 16, width: '100%', maxWidth: 480, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ color: '#eaecef', fontWeight: 700, fontSize: 16, margin: 0 }}>Nouveau trade</h2>
            <p style={{ color: '#848e9c', fontSize: 12, margin: '3px 0 0' }}>Enregistre ta position</p>
          </div>
          <button onClick={onClose}
            style={{ color: '#848e9c', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#eaecef')}
            onMouseLeave={e => (e.currentTarget.style.color = '#848e9c')}
          >✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Symbole + Direction */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Symbole" value={form.symbol} onChange={v => set('symbol', v)} placeholder="BTC, AAPL..." required />
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#848e9c', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direction</label>
              <div style={{ display: 'flex', gap: 8, height: 40 }}>
                {(['long', 'short'] as const).map(d => (
                  <button type="button" key={d}
                    onClick={() => set('direction', d)}
                    style={{
                      flex: 1, borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                      background: form.direction === d ? (d === 'long' ? '#0ecb8120' : '#f6465d20') : '#0b0e11',
                      color: form.direction === d ? (d === 'long' ? '#0ecb81' : '#f6465d') : '#848e9c',
                      outline: form.direction === d ? `1px solid ${d === 'long' ? '#0ecb8150' : '#f6465d50'}` : '1px solid #2b3139',
                    }}
                  >
                    {d === 'long' ? '▲ Long' : '▼ Short'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label="Prix entrée (€)" value={form.entry_price} onChange={v => set('entry_price', v)} placeholder="100" required />
            <Field label="Prix sortie (€)" value={form.exit_price} onChange={v => set('exit_price', v)} placeholder="—" />
            <Field label="Quantité" value={form.quantity} onChange={v => set('quantity', v)} placeholder="10" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Date entrée" value={form.entry_date} onChange={v => set('entry_date', v)} type="date" required />
            <Field label="Date sortie" value={form.exit_date} onChange={v => set('exit_date', v)} type="date" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Stop loss (€)" value={form.stop_loss} onChange={v => set('stop_loss', v)} placeholder="95" />
            <Field label="Risque (€)" value={form.risk_amount} onChange={v => set('risk_amount', v)} placeholder="50" />
          </div>

          {/* Statut */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#848e9c', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['open', 'closed'] as const).map(s => (
                <button type="button" key={s}
                  onClick={() => set('status', s)}
                  style={{
                    padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                    background: form.status === s ? '#0ecb8120' : '#0b0e11',
                    color: form.status === s ? '#0ecb81' : '#848e9c',
                    outline: form.status === s ? '1px solid #0ecb8150' : '1px solid #2b3139',
                  }}
                >
                  {s === 'open' ? '● Ouvert' : '✓ Fermé'}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#848e9c', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Setup, raison du trade..."
              rows={2}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={e => (e.target.style.borderColor = '#0ecb81')}
              onBlur={e => (e.target.style.borderColor = '#2b3139')}
            />
          </div>

          {error && (
            <div style={{ background: '#f6465d10', border: '1px solid #f6465d40', borderRadius: 10, padding: '10px 14px', color: '#f6465d', fontSize: 12 }}>
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 0', borderRadius: 12, fontWeight: 700, fontSize: 14, border: 'none', cursor: loading ? 'wait' : 'pointer',
              background: loading ? '#0ecb8180' : '#0ecb81',
              color: '#0b0e11', transition: 'opacity 0.15s',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, border: '2px solid #0b0e1150', borderTopColor: '#0b0e11', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Enregistrement…
              </span>
            ) : '+ Enregistrer le trade'}
          </button>
        </form>
      </div>
    </div>
  );
}

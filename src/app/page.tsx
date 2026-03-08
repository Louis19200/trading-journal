'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase-client';
import { computeMetrics, buildEquityCurve } from '@/lib/metrics';
import type { Trade } from '@/types';
import MetricsGrid from '@/components/MetricsGrid';
import TradesList from '@/components/TradesList';
import EquityCurve from '@/components/EquityCurve';
import AddTradeModal from '@/components/AddTradeModal';
import EditTradeModal from '@/components/EditTradeModal';

export default function HomePage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTrade, setEditTrade] = useState<Trade | null>(null);
  const supabase = createClient();

  const fetchTrades = useCallback(async () => {
    const { data } = await supabase
      .from('trades')
      .select('*')
      .order('entry_date', { ascending: false });
    setTrades(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTrades(); }, [fetchTrades]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  }

  async function handleDelete(id: string) {
    await supabase.from('trades').delete().eq('id', id);
    setTrades(prev => prev.filter(t => t.id !== id));
  }

  const metrics = computeMetrics(trades);
  const equityCurve = buildEquityCurve(trades);

  return (
    <div className="min-h-screen" style={{ background: '#0b0e11' }}>
      {/* Top navbar */}
      <nav className="sticky top-0 z-40 border-b px-6 py-0 flex items-center justify-between h-14"
        style={{ background: '#0b0e11', borderColor: '#2b3139' }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #0ecb81, #00b4d8)' }}>T</div>
            <span className="font-bold text-white text-sm">TradeJournal</span>
          </div>
          {/* Nav tabs */}
          <div className="hidden md:flex items-center gap-1">
            {['Dashboard', 'Historique', 'Statistiques'].map((t, i) => (
              <button key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{ color: i === 0 ? '#0ecb81' : '#848e9c', background: i === 0 ? '#0ecb8115' : 'transparent' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#0ecb81', color: '#0b0e11' }}
          >
            <span className="text-base leading-none">+</span> Nouveau trade
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-xs transition-colors"
            style={{ color: '#848e9c' }}
          >
            Déco
          </button>
        </div>
      </nav>

      <main className="max-w-screen-xl mx-auto px-4 py-5 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#0ecb81', borderTopColor: 'transparent' }} />
          </div>
        ) : trades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: '#161a1e', border: '1px solid #2b3139' }}>📋</div>
            <p className="text-white font-semibold">Aucun trade enregistré</p>
            <p className="text-sm" style={{ color: '#848e9c' }}>Lance-toi avec ton premier trade</p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold"
              style={{ background: '#0ecb81', color: '#0b0e11' }}
            >
              + Ajouter un trade
            </button>
          </div>
        ) : (
          <>
            <MetricsGrid metrics={metrics} />
            <EquityCurve data={equityCurve} />
            <TradesList trades={trades} onEdit={setEditTrade} onDelete={handleDelete} />
          </>
        )}
      </main>

      {showAdd && (
        <AddTradeModal
          onClose={() => setShowAdd(false)}
          onSaved={trade => { setTrades(prev => [trade, ...prev]); setShowAdd(false); }}
        />
      )}
      {editTrade && (
        <EditTradeModal
          trade={editTrade}
          onClose={() => setEditTrade(null)}
          onSaved={updated => {
            setTrades(prev => prev.map(t => t.id === updated.id ? updated : t));
            setEditTrade(null);
          }}
        />
      )}
    </div>
  );
}

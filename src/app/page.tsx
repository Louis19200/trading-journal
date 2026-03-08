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
import { ShimmerButton } from '@/components/magicui/shimmer-button';


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
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800/50 px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-gray-950/80 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/25">
            T
          </div>
          <span className="font-semibold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Trading Journal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ShimmerButton
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg"
            shimmerColor="#a78bfa"
            background="linear-gradient(135deg, #4f46e5, #7c3aed)"
          >
            + Nouveau trade
          </ShimmerButton>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>


      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : trades.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-300 font-medium">Aucun trade enregistré</p>
            <p className="text-gray-500 text-sm mt-1">Clique sur "+ Nouveau trade" pour commencer</p>
          </div>
        ) : (
          <>
            <MetricsGrid metrics={metrics} />
            <EquityCurve data={equityCurve} />
            <TradesList
              trades={trades}
              onEdit={setEditTrade}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>

      {showAdd && (
        <AddTradeModal
          onClose={() => setShowAdd(false)}
          onSaved={(trade) => { setTrades(prev => [trade, ...prev]); setShowAdd(false); }}
        />
      )}
      {editTrade && (
        <EditTradeModal
          trade={editTrade}
          onClose={() => setEditTrade(null)}
          onSaved={(updated) => {
            setTrades(prev => prev.map(t => t.id === updated.id ? updated : t));
            setEditTrade(null);
          }}
        />
      )}
    </main>
  );
}

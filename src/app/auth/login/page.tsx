'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0b0e11' }}>
      {/* Glow */}
      <div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0ecb81, transparent)', top: '20%', left: '40%' }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg"
            style={{ background: 'linear-gradient(135deg, #0ecb81, #00b4d8)' }}>
            T
          </div>
          <span className="text-xl font-bold text-white">TradeJournal</span>
        </div>

        <div className="rounded-2xl p-6 border" style={{ background: '#161a1e', borderColor: '#2b3139' }}>
          <h2 className="text-lg font-semibold text-white mb-1">Connexion</h2>
          <p className="text-sm mb-6" style={{ color: '#848e9c' }}>Entre ton email pour recevoir un magic link</p>

          {sent ? (
            <div className="rounded-xl p-4 text-center" style={{ background: '#0d2218', border: '1px solid #0ecb8140' }}>
              <div className="text-3xl mb-2">📬</div>
              <p className="text-white font-medium text-sm">Vérifie ton email</p>
              <p className="text-xs mt-1" style={{ color: '#848e9c' }}>
                Lien envoyé à <span style={{ color: '#0ecb81' }}>{email}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nom@email.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                style={{ background: '#0b0e11', border: '1px solid #2b3139' }}
                onFocus={e => e.target.style.borderColor = '#0ecb81'}
                onBlur={e => e.target.style.borderColor = '#2b3139'}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #0ecb81, #00b4d8)' }}
              >
                {loading ? 'Envoi…' : 'Recevoir le lien →'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#474d57' }}>
          Sécurisé via Supabase Auth
        </p>
      </div>
    </div>
  );
}

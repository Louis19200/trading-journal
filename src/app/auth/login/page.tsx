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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-3">T</div>
          <h1 className="text-xl font-bold text-white">Trading Journal</h1>
          <p className="text-gray-400 text-sm mt-1">Connecte-toi pour accéder à ton journal</p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-2xl mb-3">📬</p>
            <p className="text-white font-medium">Vérifie ton email</p>
            <p className="text-gray-400 text-sm mt-1">Un lien de connexion a été envoyé à <span className="text-indigo-400">{email}</span></p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="louis@voxmediae.com"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Envoi…' : 'Recevoir le lien magic 🔗'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

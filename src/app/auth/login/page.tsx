'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { ShineBorder } from '@/components/magicui/shine-border';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { BlurIn } from '@/components/magicui/blur-in';
import { Meteors } from '@/components/magicui/meteors';

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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 overflow-hidden relative">
      <Meteors number={20} />

      <div className="relative z-10 w-full max-w-sm">
        <ShineBorder
          className="rounded-2xl bg-gray-900 p-8 w-full"
          shineColor={['#6366f1', '#8b5cf6', '#ec4899']}
          borderWidth={1.5}
        >
          <div className="mb-8 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-indigo-500/25">
              T
            </div>
            <BlurIn
              word="Trading Journal"
              className="text-xl font-bold text-white"
            />
            <p className="text-gray-400 text-sm mt-1">Connecte-toi pour accéder à ton journal</p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <p className="text-4xl mb-3">📬</p>
              <p className="text-white font-medium">Vérifie ton email</p>
              <p className="text-gray-400 text-sm mt-1">
                Lien envoyé à <span className="text-indigo-400">{email}</span>
              </p>
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
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <ShimmerButton
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-medium rounded-xl"
                shimmerColor="#a78bfa"
                background="linear-gradient(135deg, #4f46e5, #7c3aed)"
              >
                {loading ? 'Envoi…' : '✨ Recevoir le magic link'}
              </ShimmerButton>
            </form>
          )}
        </ShineBorder>
      </div>
    </div>
  );
}

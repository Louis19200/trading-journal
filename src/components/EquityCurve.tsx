'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BorderBeam } from '@/components/magicui/border-beam';

const eur = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v);

export default function EquityCurve({ data }: { data: { date: string; value: number }[] }) {
  if (data.length < 2) return null;

  const last = data[data.length - 1].value;
  const isPositive = last >= 0;
  const color = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className="relative bg-gray-900/80 border border-gray-800 rounded-2xl p-5 overflow-hidden">
      <BorderBeam
        size={300}
        duration={10}
        colorFrom={isPositive ? '#10b981' : '#ef4444'}
        colorTo={isPositive ? '#6366f1' : '#f59e0b'}
        borderWidth={1.5}
      />
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-white">Equity Curve</h2>
          <p className="text-gray-500 text-xs mt-0.5">{data.length} trades fermés</p>
        </div>
        <div className={`text-sm font-semibold px-3 py-1 rounded-full ${isPositive ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
          {isPositive ? '▲' : '▼'} {eur(last)}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={isPositive ? '#6366f1' : '#f59e0b'} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#4b5563', fontSize: 10 }}
            tickFormatter={d => new Date(d).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
          />
          <YAxis
            tick={{ fill: '#4b5563', fontSize: 10 }}
            tickFormatter={v => `${v >= 0 ? '+' : ''}${v.toFixed(0)}€`}
            width={60}
          />
          <Tooltip
            formatter={(value) => [eur(Number(value ?? 0)), 'Equity']}
            labelFormatter={d => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12 }}
            itemStyle={{ color: '#fff' }}
          />
          <ReferenceLine y={0} stroke="#374151" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

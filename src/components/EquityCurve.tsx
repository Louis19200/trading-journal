'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const eur = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v);

export default function EquityCurve({ data }: { data: { date: string; value: number }[] }) {
  if (data.length < 2) return null;

  const isPositive = data[data.length - 1].value >= 0;
  const color = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h2 className="font-semibold mb-4">Equity Curve</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickFormatter={d => new Date(d).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickFormatter={v => `${v >= 0 ? '+' : ''}${v.toFixed(0)}€`}
            width={60}
          />
          <Tooltip
            formatter={(value) => [eur(Number(value ?? 0)), 'Equity']}
            labelFormatter={d => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
            itemStyle={{ color: '#fff' }}
          />
          <ReferenceLine y={0} stroke="#374151" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

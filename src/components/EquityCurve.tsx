'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts';

const eur = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v);

export default function EquityCurve({ data }: { data: { date: string; value: number }[] }) {
  if (data.length < 2) return null;

  const last = data[data.length - 1].value;
  const isUp = last >= 0;
  const color = isUp ? '#0ecb81' : '#f6465d';
  const colorFade = isUp ? '#0ecb8120' : '#f6465d20';

  return (
    <div className="rounded-xl border p-5" style={{ background: '#161a1e', borderColor: '#2b3139' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-medium" style={{ color: '#848e9c' }}>Equity Curve</p>
          <p className="text-lg font-bold num mt-0.5" style={{ color }}>
            {isUp ? '+' : ''}{eur(last)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium num"
            style={{ background: isUp ? '#0ecb8115' : '#f6465d15', color }}>
            {isUp ? '▲' : '▼'} {data.length} trades
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2b3139" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#474d57', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={d => new Date(d).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
          />
          <YAxis
            tick={{ fill: '#474d57', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v >= 0 ? '+' : ''}${v.toFixed(0)}€`}
            width={55}
          />
          <Tooltip
            formatter={(value) => [eur(Number(value ?? 0)), 'Equity']}
            labelFormatter={d => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            contentStyle={{ background: '#1e2329', border: '1px solid #2b3139', borderRadius: 10, fontSize: 12 }}
            itemStyle={{ color: '#eaecef' }}
            labelStyle={{ color: '#848e9c' }}
          />
          <ReferenceLine y={0} stroke="#2b3139" strokeDasharray="4 4" />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#grad)"
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

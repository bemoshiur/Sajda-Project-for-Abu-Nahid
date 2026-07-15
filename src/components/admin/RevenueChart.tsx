'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Point = { month: string; bookings: number; revenue: number }

export function RevenueChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0188ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0188ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#84829a' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#84829a' }} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value) => [`৳${new Intl.NumberFormat('en-IN').format(Number(value))}`, 'Revenue']}
          contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 12 }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#0188ff" strokeWidth={2.5} fill="url(#rev)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

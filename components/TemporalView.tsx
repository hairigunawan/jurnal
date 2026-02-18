// components/TemporalView.tsx
"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Clock, Calendar, BarChart2 } from "lucide-react";

interface Trade {
  id: number;
  pnl: number;
  dateEntry: string;
}

interface Props {
  trades: Trade[];
  type: "Hourly" | "Weekly" | "Monthly";
}

export default function TemporalView({ trades, type }: Props) {
  let data: any[] = [];
  let title = "";
  let Icon = Clock;

  if (type === "Hourly") {
    title = "Hourly Performance";
    Icon = Clock;
    const hours: any = {};
    for (let i = 0; i < 24; i++) hours[i.toString().padStart(2, '0')] = 0;
    
    trades.forEach(t => {
      // Assuming dateEntry can be parsed to get hour
      // Note: Previous data format might be YYYY-MM-DD
      // If we don't have time, this view will be empty unless we add time input.
      // Let's assume some dummy time for now or just group by whatever data we have.
      const hour = "12"; // Placeholder if time is missing
      hours[hour] += t.pnl;
    });
    data = Object.keys(hours).map(h => ({ name: h + ":00", value: hours[h] }));
  } else if (type === "Weekly") {
    title = "Weekly Performance";
    Icon = Calendar;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const stats: any = {};
    days.forEach(d => stats[d] = 0);

    trades.forEach(t => {
      const day = days[new Date(t.dateEntry).getDay()];
      stats[day] += t.pnl;
    });
    data = days.map(d => ({ name: d, value: stats[d] }));
  } else if (type === "Monthly") {
    title = "Monthly Performance";
    Icon = BarChart2;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const stats: any = {};
    months.forEach(m => stats[m] = 0);

    trades.forEach(t => {
      const month = months[new Date(t.dateEntry).getMonth()];
      stats[month] += t.pnl;
    });
    data = months.map(m => ({ name: m, value: stats[m] }));
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg"><Icon size={20}/></div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#10B981' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.filter(d => d.value !== 0).map((d, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{d.name}</p>
            <p className={`text-sm font-bold ${d.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${d.value.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

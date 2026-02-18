// components/ReportsView.tsx
"use client";
import { FileText, Download, TrendingUp, TrendingDown } from "lucide-react";

interface Trade {
  id: number;
  pnl: number;
  dateEntry: string;
  result: string;
}

interface Props {
  trades: Trade[];
}

export default function ReportsView({ trades }: Props) {
  // Logic grouping by month
  const monthlyStats: any = {};
  trades.forEach(t => {
    const month = t.dateEntry.substring(0, 7); // YYYY-MM
    if (!monthlyStats[month]) {
      monthlyStats[month] = { pnl: 0, wins: 0, losses: 0, total: 0 };
    }
    monthlyStats[month].pnl += t.pnl;
    monthlyStats[month].total += 1;
    if (t.result === 'Win') monthlyStats[month].wins += 1;
    else monthlyStats[month].losses += 1;
  });

  const months = Object.keys(monthlyStats).sort().reverse();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FileText className="text-blue-600" size={20} /> Monthly Reports
        </h2>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors">
          <Download size={14} /> Export All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {months.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 text-sm">
            Belum ada data untuk laporan.
          </div>
        ) : (
          months.map(month => {
            const stat = monthlyStats[month];
            const winRate = ((stat.wins / stat.total) * 100).toFixed(1);
            return (
              <div key={month} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                    {new Date(month).toLocaleString('default', { month: 'short' })}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    <p className="text-[10px] text-gray-400">{stat.total} Trades Executed</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Win Rate</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{winRate}%</p>
                  </div>
                  <div className="text-right w-24">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Net P/L</p>
                    <p className={`text-sm font-bold ${stat.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.pnl >= 0 ? '+' : ''}${stat.pnl.toFixed(2)}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

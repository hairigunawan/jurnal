// components/TradesView.tsx
"use client";
import { useMemo } from "react";
import { ArrowUpDown, TrendingUp, TrendingDown, Trash, Pencil } from "lucide-react";

interface Trade {
  id: number;
  dateEntry: string;
  dateExit: string;
  instrument: string;
  position: string;
  entry: number;
  exit: number;
  lot: number;
  fees: number;
  pnl: number;
  rate: number;
  result: string;
  akumulasi?: number; // Optional karena dihitung di parent
  notes?: string;
}

interface Props {
  trades: Trade[];
  onDelete: (id: number) => void;
  onEdit: (trade: Trade) => void;
}

export default function TradesView({ trades, onDelete, onEdit }: Props) {
  // Formatters
  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  const formatPrice = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 });
  };

  // Hitung akumulasi berdasarkan urutan tanggal entry menggunakan useMemo
  const tradesWithAccumulation = useMemo(() => {
    const sorted = [...trades].sort((a, b) => {
        const dateA = new Date(a.dateEntry).getTime();
        const dateB = new Date(b.dateEntry).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return a.id - b.id;
    });

    const result: any[] = [];
    let running = 0;
    sorted.forEach(t => {
        running += t.pnl;
        result.push({ ...t, akumulasi: running });
    });
    
    return result.reverse();
  }, [trades]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[calc(100vh-130px)]">
      
      {/* Table Header Info */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 sticky top-0 z-10">
        <div>
          <h2 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
            Riwayat Trading 
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{trades.length}</span>
          </h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Data jurnal lengkap dengan kalkulasi performa</p>
        </div>
        <div className="flex gap-2">
           <button className="px-2.5 py-1 text-[10px] font-medium bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300">Export CSV</button>
        </div>
      </div>

      {/* Scrollable Table Area */}
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 text-[9px] uppercase font-bold tracking-wider sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-3 py-2 border-b dark:border-gray-700">ID</th>
              <th className="px-3 py-2 border-b dark:border-gray-700">Tgl Entry</th>
              <th className="px-3 py-2 border-b dark:border-gray-700">Tgl Exit</th>
              <th className="px-3 py-2 border-b dark:border-gray-700">Instrumen</th>
              <th className="px-3 py-2 border-b dark:border-gray-700">Posisi</th>
              <th className="px-3 py-2 border-b dark:border-gray-700 text-right">Entry</th>
              <th className="px-3 py-2 border-b dark:border-gray-700 text-right">Exit</th>
              <th className="px-3 py-2 border-b dark:border-gray-700 text-right">Lot</th>
              <th className="px-3 py-2 border-b dark:border-gray-700 text-right text-red-400">Fees</th>
              <th className="px-3 py-2 border-b dark:border-gray-700 text-right">P/L ($)</th>
              <th className="px-3 py-2 border-b dark:border-gray-700 text-right">Rate (%)</th>
              <th className="px-3 py-2 border-b dark:border-gray-700 text-center">Hasil</th>
              <th className="px-3 py-2 border-b dark:border-gray-700 text-right bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">Akumulasi</th>
              <th className="px-3 py-2 border-b dark:border-gray-700 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-[11px]">
            {tradesWithAccumulation.map((trade) => (
              <tr key={trade.id} className="hover:bg-blue-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                <td className="px-3 py-2 font-mono text-gray-400">#{trade.id.toString().slice(-4)}</td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatDate(trade.dateEntry)}</td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatDate(trade.dateExit)}</td>
                <td className="px-3 py-2 font-bold text-gray-800 dark:text-white uppercase">{trade.instrument}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    trade.position === 'Long'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {trade.position}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-mono text-gray-600 dark:text-gray-400">{formatPrice(trade.entry)}</td>
                <td className="px-3 py-2 text-right font-mono text-gray-600 dark:text-gray-400">{formatPrice(trade.exit)}</td>
                <td className="px-3 py-2 text-right font-mono text-gray-600 dark:text-gray-400">{trade.lot}</td>
                <td className="px-3 py-2 text-right font-mono text-red-500">-{trade.fees.toFixed(2)}</td>
                
                {/* P/L Column */}
                <td className={`px-3 py-2 text-right font-bold font-mono ${trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                </td>
                
                {/* Rate Column */}
                <td className={`px-3 py-2 text-right font-mono ${trade.rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.rate > 0 ? '+' : ''}{trade.rate}%
                </td>

                {/* Result Badge */}
                <td className="px-3 py-2 text-center">
                  {trade.result === 'Win' ? 
                    <TrendingUp size={12} className="text-green-500 mx-auto" /> : 
                    <TrendingDown size={12} className="text-red-500 mx-auto" />
                  }
                </td>

                {/* Akumulasi Column (Highlight) */}
                <td className="px-3 py-2 text-right font-bold font-mono bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 border-l border-blue-100 dark:border-blue-900/30">
                  {trade.akumulasi?.toFixed(2)}
                </td>

                {/* Action Column */}
                <td className="px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button 
                      onClick={() => onEdit(trade)}
                      className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-500 rounded transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => onDelete(trade.id)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded transition-colors"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

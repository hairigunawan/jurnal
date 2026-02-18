// components/AddTradeModal.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { X, Calculator, Loader2, Info, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (trade: any) => Promise<void>;
  trade?: any; // Prop untuk mode edit
}

export default function AddTradeModal({ isOpen, onClose, onAdd, trade }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assetType, setAssetType] = useState(trade?.assetType || "Forex");
  const [quoteCurrency, setQuoteCurrency] = useState("USD");
  
  // States for live calculation
  const [entry, setEntry] = useState(trade?.entry?.toString() || "");
  const [exit, setExit] = useState(trade?.exit?.toString() || "");
  const [lotSize, setLotSize] = useState(trade?.lot?.toString() || "");
  const [fees, setFees] = useState(trade?.fees?.toString() || "0");
  const [convRate, setConvRate] = useState("1");
  const [position, setPosition] = useState(trade?.position || "Long");

  // Reset states when trade changes (for edit mode)
  useEffect(() => {
    if (trade) {
      setEntry(trade.entry.toString());
      setExit(trade.exit.toString());
      setLotSize(trade.lot.toString());
      setFees(trade.fees.toString());
      setPosition(trade.position);
    }
  }, [trade]);

  const preview = useMemo(() => {
    const entryPrice = parseFloat(entry);
    const exitPrice = parseFloat(exit);
    const lot = parseFloat(lotSize);
    const feeVal = parseFloat(fees) || 0;
    const cRate = parseFloat(convRate) || 1;

    if (isNaN(entryPrice) || isNaN(exitPrice) || isNaN(lot)) return null;

    let contractSize = 100000;
    if (assetType === 'Forex') contractSize = 100000;
    else if (assetType === 'Metal') contractSize = 100;
    else if (assetType === 'Crypto') contractSize = 1;
    else if (assetType === 'Index') contractSize = 1;

    let rawPnL = (exitPrice - entryPrice) * lot * contractSize; 
    if (position === "Short") {
        rawPnL = (entryPrice - exitPrice) * lot * contractSize;
    }

    let pnlInUsd = rawPnL;
    if (["JPY", "CAD", "CHF"].includes(quoteCurrency)) {
        pnlInUsd = rawPnL / cRate;
    } 
    else if (["AUD", "GBP", "NZD", "Other"].includes(quoteCurrency)) {
        pnlInUsd = rawPnL * cRate;
    }

    const finalPnL = pnlInUsd - feeVal;
    const rate = ((finalPnL / (entryPrice * lot * contractSize)) * 100).toFixed(2);

    return {
      pnl: finalPnL,
      rate: parseFloat(rate),
      isWin: finalPnL >= 0
    };
  }, [entry, exit, lotSize, fees, convRate, position, assetType, quoteCurrency]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) return;
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const data = {
      id: trade?.id,
      dateEntry: formData.get("dateEntry"),
      dateExit: formData.get("dateExit"),
      instrument: (formData.get("instrument") as string).toUpperCase(),
      position: position,
      entry: parseFloat(entry),
      exit: parseFloat(exit),
      lot: parseFloat(lotSize),
      fees: parseFloat(fees) || 0,
      pnl: parseFloat(preview.pnl.toFixed(2)),
      rate: preview.rate,
      result: preview.isWin ? "Win" : "Loss",
      notes: formData.get("notes"),
    };

    try {
      await onAdd(data);
      onClose();
    } catch (error) {
      // Handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              {trade ? "Edit Jurnal Trading" : "Input Jurnal Trading"}
            </h2>
            <p className="text-[10px] text-gray-500">Lengkapi data transaksi untuk analisis</p>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 overflow-y-auto">
          <form id="trade-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Kolom 1: Waktu & Aset */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">1. Waktu & Aset</h3>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Tipe Aset</label>
                <select 
                  value={assetType} 
                  onChange={(e) => setAssetType(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs outline-none"
                >
                  <option value="Forex">Forex (100k)</option>
                  <option value="Metal">Gold/Metal (100)</option>
                  <option value="Crypto">Crypto (1)</option>
                  <option value="Index">Indeks (1)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Quote Currency</label>
                <select 
                  value={quoteCurrency} 
                  onChange={(e) => setQuoteCurrency(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="JPY">JPY</option>
                  <option value="AUD">AUD</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Instrumen</label>
                <input name="instrument" required defaultValue={trade?.instrument} placeholder="e.g. XAUUSD" className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs font-bold uppercase outline-none" />
              </div>
            </div>

            {/* Kolom 2: Eksekusi */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">2. Eksekusi</h3>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Posisi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setPosition("Long")}
                    className={`text-center py-1.5 rounded-lg border text-xs font-medium transition-all ${position === "Long" ? "bg-green-500 text-white border-green-600" : "border-gray-200 dark:border-gray-600 dark:text-gray-400"}`}
                  >
                    Long
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPosition("Short")}
                    className={`text-center py-1.5 rounded-lg border text-xs font-medium transition-all ${position === "Short" ? "bg-red-500 text-white border-red-600" : "border-gray-200 dark:border-gray-600 dark:text-gray-400"}`}
                  >
                    Short
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Entry Price</label>
                <input 
                  type="number" 
                  step="0.00001" 
                  required 
                  value={entry} 
                  onChange={(e) => setEntry(e.target.value)}
                  placeholder="0.00" 
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Exit Price</label>
                <input 
                  type="number" 
                  step="0.00001" 
                  required 
                  value={exit} 
                  onChange={(e) => setExit(e.target.value)}
                  placeholder="0.00" 
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs outline-none" 
                />
              </div>
            </div>

            {/* Kolom 3: Ukuran & Konversi */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">3. Ukuran & Biaya</h3>
              {quoteCurrency !== "USD" && (
                <div>
                  <label className="block text-[10px] font-medium text-blue-600 mb-1 flex items-center gap-1">Kurs ke USD <Info size={10} /></label>
                  <input 
                    type="number" 
                    step="0.00001" 
                    required 
                    value={convRate}
                    onChange={(e) => setConvRate(e.target.value)}
                    placeholder="Kurs..." 
                    className="w-full p-2 rounded-lg border-2 border-blue-100 dark:border-blue-900 dark:bg-gray-700 dark:text-white text-xs outline-none" 
                  />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Lot Size</label>
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  value={lotSize} 
                  onChange={(e) => setLotSize(e.target.value)}
                  placeholder="0.01" 
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Fees ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs outline-none" 
                />
              </div>
            </div>

             {/* Kolom 4: Waktu & Catatan */}
             <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">4. Waktu & Catatan</h3>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Tgl Entry</label>
                <input name="dateEntry" type="date" required defaultValue={trade?.dateEntry} className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Tgl Exit</label>
                <input name="dateExit" type="date" required defaultValue={trade?.dateExit} className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Catatan</label>
                <textarea name="notes" defaultValue={trade?.notes} rows={2} className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs outline-none" />
              </div>
            </div>

          </form>

          {/* Live Preview Section */}
          {preview && (
            <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${preview.isWin ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {preview.isWin ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Estimasi Hasil</p>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-xl font-black ${preview.isWin ? 'text-green-600' : 'text-red-600'}`}>
                        {preview.pnl >= 0 ? '+' : ''}${preview.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`text-xs font-bold ${preview.isWin ? 'text-green-500' : 'text-red-500'}`}>
                        ({preview.rate >= 0 ? '+' : ''}{preview.rate}%)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-gray-500 uppercase">Status</p>
                   <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${preview.isWin ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {preview.isWin ? 'WIN' : 'LOSS'}
                   </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">Batal</button>
          <button 
            form="trade-form" 
            type="submit" 
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:bg-blue-400 flex items-center gap-2"
          >
            {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : (trade ? "Simpan Perubahan" : "Simpan Jurnal")}
          </button>
        </div>
      </div>
    </div>
  );
}

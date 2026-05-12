import React, { useState } from 'react';
import type { BPLogEntryProps, BPReading } from '../types';

const BPLogEntry: React.FC<BPLogEntryProps> = ({ onSave }) => {
  // We use strings for state so the inputs feel natural while typing
  const [sys, setSys] = useState<string>('');
  const [dia, setDia] = useState<string>('');
  const [period, setPeriod] = useState<BPReading['period']>('Morning');
  const [context, setContext] = useState<string>('');

  // NEW: Manual Time State
  const [showManualTime, setShowManualTime] = useState(false);
  const [customTimestamp, setCustomTimestamp] = useState<string>(
    new Date().toISOString().slice(0, 16) // Sets default to "right now" in input format
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Conversion Logic: TS will complain if we try to save strings as numbers
    const sysNum = parseInt(sys);
    const diaNum = parseInt(dia);

    if (isNaN(sysNum) || isNaN(diaNum)) {
      alert("Please enter valid numbers");
      return;
    }
    
    onSave({
      sys: sysNum,
      dia: diaNum,
      period,
      context,
      // Logic: Use the manual date if the toggle is on, otherwise use the exact current moment
      timestamp: showManualTime ? new Date(customTimestamp).toISOString() : new Date().toISOString(),
    });
    
    setSys('');
    setDia('');
  };

  return (
    <div className="bg-[--color-tactical-card] p-6 rounded-xl border border-slate-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Systolic</label>
            <input 
              type="number" 
              inputMode="numeric"
              className="w-full bg-slate-900 border border-slate-700 p-4 rounded text-2xl text-white outline-none focus:border-blue-500"
              value={sys}
              onChange={(e) => setSys(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Diastolic</label>
            <input 
              type="number" 
              inputMode="numeric"
              className="w-full bg-slate-900 border border-slate-700 p-4 rounded text-2xl text-white outline-none focus:border-blue-500"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['Morning', 'Mid-day', 'Evening'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`p-3 rounded-lg text-xs font-bold uppercase tracking-tighter border ${
                period === p ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <textarea 
          className="w-full bg-slate-900 border border-slate-700 p-3 rounded h-20 text-white outline-none focus:border-blue-500"
          placeholder="Notes (Coffee, stress, etc...)"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />

        {/* MANUAL OVERRIDE SECTION */}
        <div className="pt-2 border-t border-slate-800">
          <button 
            type="button"
            onClick={() => setShowManualTime(!showManualTime)}
            className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:text-blue-400 transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {showManualTime ? 'Use Live System Time' : 'Adjust Entry Time'}
          </button>

          {showManualTime && (
            <input 
              type="datetime-local" 
              className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-sm text-blue-400 outline-none focus:border-blue-500 mb-4"
              value={customTimestamp}
              onChange={(e) => setCustomTimestamp(e.target.value)}
            />
          )}
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold uppercase tracking-widest transition-all">
          Store Reading
        </button>
      </form>
    </div>
  );
};

export default BPLogEntry;
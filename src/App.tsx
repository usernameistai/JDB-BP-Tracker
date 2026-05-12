import React, { useEffect, useState } from 'react';
import type { BPReading } from './types';
import BPLogEntry from './components/BPLogEntry';
import LogCard from './components/LogCard';
import DailyChart from './components/DailyChart';
import AnalyticsView from './components/AnalyticsView';
import { exportToCsv } from './utils/exportToCsv';

const App: React.FC = () => {
  const [readings, setReadings] = useState<BPReading[]>(() => {
    const saved = localStorage.getItem('aegis_bp_logs');
    // If we find data, parse it and return it; otherwise, return an empty array
    return saved ? (JSON.parse(saved) as BPReading[]) : [];
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);
  type View = 'LOG' | 'CHARTS' | 'EXPORT';
  const [view, setView] = useState<View>('LOG');

  useEffect(() => {
    localStorage.setItem('aegis_bp_logs', JSON.stringify(readings));
  }, [readings]);

  const handleSave = (newReading: Omit<BPReading, 'id'>) => {
    const fullReading: BPReading = {
      ...newReading,
      id: crypto.randomUUID()
    };
    setReadings([fullReading, ...readings]);
    setIsAdding(false); // close form after saving
  };
  const handleDelete = (id: string) => {
    if (window.confirm("Delete this log entry?")) {
      setReadings(readings.filter(r => r.id !== id));
    }
  };

  // Get the most recent reading for the "Status Card"
  const latest = readings[0];

  return (
    <>
      <div className="min-h-screen bg-[--color-tactical-bg] text-slate-100 font-sans">
        {/* HEADER HUD */}
        <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-[--color-tactical-card]">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-blue-400">AEGIS // HEALTH_LOG</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">User: Grandad_Dad_JDB_Primary</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-green-500 animate-pulse uppercase">System_Online</span>
            <div className="h-2 w-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
          </div>
        </header>

        <main className="max-w-md mx-auto p-4 pb-24 space-y-6">
          
          {/* VIEW: LOGS (ENTRY & HISTORY) */}
          {view === 'LOG' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* LATEST STATUS & MINI-CHART (Hide when adding new entry to save space) */}
              {!isAdding && latest && (
                <>
                  <section className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Last Log Entry</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-5xl font-black text-white">{latest.sys}</span>
                        <span className="text-2xl text-slate-500 mx-2">/</span>
                        <span className="text-4xl font-bold text-slate-300">{latest.dia}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-400 font-bold">{latest.period}</p>
                        <p className="text-[10px] text-slate-500">{new Date(latest.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </section>

                  <section className="mt-4">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2 mb-2">Trend_Visualizer (Recent_10)</h3>
                    <DailyChart data={readings} />
                  </section>
                </>
              )}

              {/* INPUT TOGGLE */}
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg border-2 ${
                  isAdding ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-blue-600 border-blue-400 text-white'
                }`}
              >
                {isAdding ? '← Cancel Entry' : '+ New Measurement'}
              </button>

              {/* ENTRY FORM OR HISTORY LIST */}
              {isAdding ? (
                <BPLogEntry onSave={handleSave} />
              ) : (
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Mission History</h3>
                  {readings.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 italic">
                      No data logs found. Ready for first entry.
                    </div>
                  ) : (
                    readings.map((log) => <LogCard key={log.id} reading={log} onDelete={handleDelete}/>)
                  )}
                </section>
              )}
            </div>
          )}

          {/* VIEW: CHARTS (ANALYTICS) */}
          {view === 'CHARTS' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <AnalyticsView readings={readings} />
            </div>
          )}

          {/* VIEW: EXPORT (FUTURE MISSION) */}
          {view === 'EXPORT' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center">
                <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"/></svg>
                </div>
                <h2 className="text-xl font-bold text-[#ffffff] mb-2">Export Data</h2>
                <p className="text-sm text-slate-400 mb-8">
                  Generate a CSV file of all {readings.length} entries to share with your healthcare provider.
                </p>
                
                <button 
                  onClick={() => exportToCsv(readings)}
                  className="w-full bg-white text-slate-900 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-400 transition-colors"
                >
                  Download CSV Report
                </button>
              </div>
            </div>
          )}
        </main>

        {/* FOOTER NAV (Fixed) */}
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 p-4 flex justify-around items-center z-50">
          <button onClick={() => {setView('LOG'); setIsAdding(false);}} className={`flex flex-col items-center gap-1 transition-colors ${view === 'LOG' ? 'text-blue-400' : 'text-slate-500'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest">Log</span>
            {view === 'LOG' && <div className="h-1 w-4 bg-blue-400 rounded-full" />}
          </button>
          
          <button onClick={() => setView('CHARTS')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'CHARTS' ? 'text-blue-400' : 'text-slate-500'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest">Charts</span>
            {view === 'CHARTS' && <div className="h-1 w-4 bg-blue-400 rounded-full" />}
          </button>

          <button onClick={() => setView('EXPORT')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'EXPORT' ? 'text-blue-400' : 'text-slate-500'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest">Export</span>
            {view === 'EXPORT' && <div className="h-1 w-4 bg-blue-400 rounded-full" />}
          </button>
        </footer>
      </div>
    </>
  );
}

export default App
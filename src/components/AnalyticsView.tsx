import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { BPReading } from '../types';

const AnalyticsView = ({ readings }: { readings: BPReading[] }) => {
  
  // Calculate Weekly Average Intel
  const stats = useMemo(() => {
    const last7 = readings.slice(0, 7);
    if (last7.length === 0) return { sys: 0, dia: 0 };
    
    const sumSys = last7.reduce((acc, r) => acc + r.sys, 0);
    const sumDia = last7.reduce((acc, r) => acc + r.dia, 0);
    
    return {
      sys: Math.round(sumSys / last7.length),
      dia: Math.round(sumDia / last7.length)
    };
  }, [readings]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Weekly_Averages</h2>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <p className="text-[10px] text-blue-400 font-bold uppercase">Avg Systolic</p>
            <p className="text-3xl font-black text-white">{stats.sys || '--'}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Avg Diastolic</p>
            <p className="text-3xl font-black text-white">{stats.dia || '--'}</p>
          </div>
        </div>
      </header>

      <section className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Historical Trend (7 Logs)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[...readings].slice(0, 7).reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleDateString([], {weekday: 'short'})} tick={{fontSize: 10, fill: '#64748b'}} />
              <YAxis domain={[60, 180]} tick={{fontSize: 10, fill: '#64748b'}} />
              <Tooltip 
                allowEscapeViewBox={{ x: true, y: true }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const sysData = payload.find(p => p.dataKey === 'sys');
                    const diaData = payload.find(p => p.dataKey === 'dia');

                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">
                          {/* Added Date + Time for the Analytics view since it spans multiple days */}
                          {/* {new Date(label).toLocaleDateString([], { day: '2-digit', month: '2-digit' })} @ {new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()} */}
                          {label ? (
                            `${new Date(label).toLocaleDateString([], { day: '2-digit', month: '2-digit' })} @ ${new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}`
                          ) : (
                            'NO_TIMESTAMP'
                          )}
                        </p>
                        <div className="flex justify-between items-center gap-4 mb-1">
                          <span className="text-[10px] font-bold text-blue-400 uppercase">SYS</span>
                          <span className="text-sm font-black text-white">{sysData?.value}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">DIA</span>
                          <span className="text-sm font-black text-slate-300">{diaData?.value}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={170} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'LIMIT', fill: '#ef4444', fontSize: 10 }} />
              <Line type="monotone" dataKey="sys" stroke="#60a5fa" strokeWidth={4} dot={{ r: 6 }} />
              <Line type="monotone" dataKey="dia" stroke="#94a3b8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-xl">
        <p className="text-[10px] text-blue-400 uppercase font-bold mb-1">Status Report</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          {stats.sys > 150 
            ? "Readings are trending higher than optimal. Ensure rest periods are maintained before logging."
            : "System parameters are within established operational margins."}
        </p>
      </div>
    </div>
  );
};

export default AnalyticsView;
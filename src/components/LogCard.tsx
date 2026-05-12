import React from 'react';
import type { BPReading } from '../types';

interface LogCardProps {
  reading: BPReading;
  onDelete: (id: string) => void;
}

const LogCard: React.FC<LogCardProps> = ({ reading, onDelete }) => {
  // Check against specific "STRess-free" thresholds
  const isHighSys = reading.sys >= 170;
  const isHighDia = reading.dia >= 100;
  const isWarning = isHighSys || isHighDia;

  return (
    <>
      <div className={`bg-[--color-tactical-card] p-4 rounded-xl border transition-all ${
        isWarning ? 'border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-slate-800'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black ${isHighSys ? 'text-red-500' : 'text-cyan-300'}`}>
              {reading.sys}
            </span>
            <span className="text-slate-600 font-bold">/</span>
            <span className={`text-xl font-bold ${isHighDia ? 'text-red-500' : 'text-cyan-300'}`}>
              {reading.dia}
            </span>
            <span className="text-[10px] text-slate-500 ml-2 uppercase font-bold tracking-tighter">
              mmHg
            </span>
          </div>
          
          <div className="text-right">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
              reading.period === 'Morning' ? 'bg-orange-500/20 text-orange-400' :
              reading.period === 'Mid-day' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-indigo-500/20 text-indigo-400'
            }`}>
              {reading.period}
            </span>
          </div>

          <button 
            onClick={() => onDelete(reading.id)}
            className="text-slate-600 hover:text-red-500 p-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>

        {reading.context && (
          <div className="mt-3 p-2 bg-slate-900/50 rounded border-l-2 border-blue-500">
            <p className="text-xs text-slate-300 italic">
              " {reading.context} "
            </p>
          </div>
        )}

        <div className="mt-3 flex justify-between items-center border-t border-slate-800/50 pt-2">
          <span className="text-[9px] text-slate-500 font-mono uppercase">
            LOG_ID: {reading.id.slice(0, 8)}
          </span>
          <span className="text-[10px] text-slate-400 font-bold">
            {new Date(reading.timestamp).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })} @ {new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}
          </span>
        </div>
      </div>
    </>
  )
}

export default LogCard
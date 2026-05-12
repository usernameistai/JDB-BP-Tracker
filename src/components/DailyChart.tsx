import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import type { BPReading } from '../types';

interface DailyChartProps {
  data: BPReading[];
}

const DailyChart: React.FC<DailyChartProps> = ({ data }) => {
  // We only show the last 10 readings to keep the mini-chart from getting cluttered
  const displayData = data.slice(0, 10).reverse();

  return (
    <div className="h-48 w-full bg-slate-900/40 rounded-xl border border-slate-800 p-2 shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={displayData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="timestamp" hide />
          <YAxis domain={[40, 200]} hide />
          
          {/* Visual "Safe Zone" for Systolic (60 to 120) */}
          <ReferenceArea y1={60} y2={120} fill="#22c55e" fillOpacity={0.05} />
          
          <Tooltip
            allowEscapeViewBox={{ x: true, y: true }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                // Find our specific data points in the payload array
                const sysData = payload.find(p => p.dataKey === 'sys');
                const diaData = payload.find(p => p.dataKey === 'dia');

                return (
                  <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-2xl">
                    {/* 1. TIME AT THE TOP */}
                    <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-2 border-b border-slate-800 pb-1">
                      {/* {new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()} */}
                      {label ? (
                        `${new Date(label).toLocaleDateString([], { day: '2-digit', month: '2-digit' })} @ ${new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}`
                      ) : (
                        'NO_TIMESTAMP'
                      )}
                    </p>
                    
                    {/* 2. SYSTOLIC (BLUE) */}
                    <div className="flex justify-between items-center gap-4 mb-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">SYS</span>
                      <span className="text-sm font-black text-white">{sysData?.value}</span>
                    </div>

                    {/* 3. DIASTOLIC (GRAY) */}
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

          {/* 1. Diastolic (Lower Number / Gray) - Render first */}
          <Line 
            type="monotone" 
            dataKey="dia" 
            stroke="#94a3b8" 
            strokeWidth={2} 
            dot={{ r: 3, fill: '#475569' }} 
            isAnimationActive={false}
          />

          {/* 2. Systolic (Higher Number / Blue) - Render second so it's "on top" */}
          <Line 
            type="monotone" 
            dataKey="sys" 
            stroke="#60a5fa" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#60a5fa', stroke: '#0f172a', strokeWidth: 2 }} 
            activeDot={{ r: 6 }}
          />
        
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyChart;
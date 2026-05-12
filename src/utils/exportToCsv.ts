import type { BPReading } from '../types';

export const exportToCsv = (readings: BPReading[]) => {
  const headers = ["Date,Time,Systolic,Diastolic,Period,Notes\n"];
  
  const rows = readings.map(r => {
    const d = new Date(r.timestamp);
    const date = d.toLocaleDateString();
    // This gives us "14:30" or "2:30 PM" without the seconds or the Z
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    
    return `${date},${time},${r.sys},${r.dia},${r.period},"${r.context.replace(/"/g, '""')}"`;
  });

  const blob = new Blob([headers.concat(rows.join("\n")).join("")], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `BP_Log_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
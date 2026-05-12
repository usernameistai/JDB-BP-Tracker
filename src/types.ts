export interface BPReading {
  id: string;
  sys: number;
  dia: number;
  period: 'Morning' | 'Mid-day' | 'Evening' | 'Night';
  context: string;
  timestamp: string;
}

export const ALARM_THRESHOLDS = {
  SYS_MAX: 170,
  DIA_MAX: 100
}

export interface BPLogEntryProps {
  onSave: (reading: Omit<BPReading, 'id'>) => void;
}
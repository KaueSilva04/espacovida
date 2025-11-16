export interface MonthlyData {
  name: string;
  participantes: number;
}

export interface EventDistribution {
  name: string;
  value: number;
  [key: string]: string | number; // ← Requerido pelo Recharts
}

export interface NextEvent {
  id: number;
  name: string;
  date: string;
  location: string;
}

export interface TopEvent {
  id: number;
  name: string;
  participants: number;
}

export interface MockData {
  totalEvents: number;
  totalParticipants: number;
  averageParticipants: number;
  futureEvents: number;
  pastEvents: number;
  participantsMonthly: {
    [key: string]: MonthlyData[];
  };
  eventsDistribution: EventDistribution[];
  nextEvents: NextEvent[];
  topEvents: TopEvent[];
}

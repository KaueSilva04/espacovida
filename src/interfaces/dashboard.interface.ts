export interface Dashboard {
  totalEvents: number;
  totalParticipants: number;
  averageParticipants: number;

  futureEvents: number;
  pastEvents: number;

  participantsMonthly: {
    [year: string]: {
      name: string;
      participantes: number;
    }[];
  };

  nextEvents: {
    id: number;
    title: string;
    date: string;
    location: string;
  }[];

  topEvents: {
    id: number;
    title: string;
    participants: number;
  }[];
}

export default Dashboard;
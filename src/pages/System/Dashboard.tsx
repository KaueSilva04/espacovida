import { useState } from "react";

// Types
import { MockData } from "../../components/Dashboard/types";

// Cards
import TotalEventsCard from "../../components/Dashboard/Cards/TotalEventsCard";
import TotalParticipantsCard from "../../components/Dashboard/Cards/TotalParticipantsCard";
import AverageParticipantsCard from "../../components/Dashboard/Cards/AverageParticipantsCard";
import EventsStatusCard from "../../components/Dashboard/Cards/EventsStatusCard";

// Charts
import ParticipantsMonthlyChart from "../../components/Dashboard/Charts/ParticipantsMonthlyChart";
import EventsPieChart from "../../components/Dashboard/Charts/EventsPieChart";

// Lists
import NextEventsList from "../../components/Dashboard/Lists/NextEventsList";
import TopEventsList from "../../components/Dashboard/Lists/TopEventsList";

// Mock (pode vir de API depois)
import mockData from "../../components/Dashboard/mockaData"

import { useDashboardData } from "../../hooks/dashboard.Hook";

export default function Dashboard() {

  const { data, loading } = useDashboardData();
  console.log(data)
  const [selectedYear, setSelectedYear] = useState("2025");

  if (loading || !data) {
    return <div className="p-6 text-center text-xl">Carregando dashboard...</div>;
  }

  return (
    // Depois:
    <div className="w-full **bg-white dark:bg-gray-800 dark:text-white text-gray-900** p-6 rounded-xl space-y-5 max-w-full overflow-hidden">

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TotalEventsCard total={data.totalEvents} />
        <TotalParticipantsCard total={data.totalParticipants} />
        <AverageParticipantsCard average={data.averageParticipants} />
        <EventsStatusCard future={data.futureEvents} past={data.pastEvents} />
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ParticipantsMonthlyChart
            data={data.participantsMonthly[selectedYear]}
            years={Object.keys(data?.participantsMonthly ?? {})}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>
        <EventsPieChart data={data.eventsDistribution} />
      </div>

      {/* LISTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NextEventsList events={data.nextEvents} />
        </div>
        <TopEventsList events={data.topEvents} />
      </div>

    </div>
  );
}

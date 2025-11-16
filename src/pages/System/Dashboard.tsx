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
import mockData from "../../components/Dashboard/mockaData";

export default function Dashboard() {
  const data: MockData = mockData;
  const [selectedYear, setSelectedYear] = useState("2025");

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

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

import React from 'react';
import { CalendarClock, MapPin } from 'lucide-react';

interface NextEvent {
  id: number;
  title: string;
  date: string;
  location: string;
}

interface NextEventsListProps {
  events: NextEvent[];
}

const NextEventsList: React.FC<NextEventsListProps> = ({ events }) => (
  // ALTERADO: De dark:bg-gray-800 para dark:bg-dark-surface dark:bg-opacity-80
  <div className="bg-white dark:bg-dark-surface dark:bg-opacity-80 rounded-2xl shadow-lg p-6 h-full border border-gray-100 dark:border-gray-700/50">
    <div className="flex items-center gap-3 mb-5">
      <CalendarClock className="w-6 h-6 text-green-600 dark:text-green-400" />
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
        Próximos Eventos
      </h3>
    </div>

    <div className="divide-y divide-gray-100 dark:divide-gray-700/30">
      {events.map((event, i) => (
        <div
          key={event.id}
          className={`flex flex-col sm:flex-row justify-between py-4 gap-3 ${i === 0 ? 'pt-0' : ''}`}
        >
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3 h-3" />
              {event.location}
            </p>
          </div>

          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full h-fit whitespace-nowrap border border-gray-200 dark:border-gray-700/50">
            {event.date}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default NextEventsList;
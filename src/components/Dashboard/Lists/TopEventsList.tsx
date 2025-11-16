import React from 'react';
import { Trophy } from 'lucide-react';

interface TopEvent {
  id: number;
  name: string;
  participants: number;
}

interface TopEventsListProps {
  events: TopEvent[];
}

const TopEventsList: React.FC<TopEventsListProps> = ({ events }) => {
  const medalColor = (index: number) =>
    index === 0 ? "text-yellow-500"
    : index === 1 ? "text-gray-400"
    : index === 2 ? "text-yellow-700"
    : "text-gray-500 dark:text-gray-400";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-full">
      <div className="flex items-center gap-3 mb-5">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Top 5 Eventos Populares
        </h3>
      </div>

      <div className="space-y-4">
        {events.slice(0, 5).map((event, index) => (
          <div key={event.id} className="flex items-center gap-4">
            
            {/* Ícone medalha */}
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${medalColor(index)} bg-gray-100 dark:bg-gray-700`}>
              {index < 3 ? <Trophy className="w-5 h-5" /> : index + 1}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                {event.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {event.participants.toLocaleString('pt-BR')} participantes
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TopEventsList;

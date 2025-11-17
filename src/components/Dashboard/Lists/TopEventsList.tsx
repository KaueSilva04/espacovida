import React from 'react';
import { Trophy } from 'lucide-react';

interface TopEvent {
  id: number;
  title: string;
  participants: number;
}

interface TopEventsListProps {
  events: TopEvent[];
}

const TopEventsList: React.FC<TopEventsListProps> = ({ events }) => {
  const medalColor = (index: number) =>
    index === 0 ? "text-yellow-500 ring-yellow-500/20 bg-yellow-500/10"
      : index === 1 ? "text-gray-400 ring-gray-400/20 bg-gray-400/10"
        : index === 2 ? "text-amber-700 ring-amber-700/20 bg-amber-700/10"
          : "text-gray-500 dark:text-gray-400 ring-gray-500/20 bg-gray-500/10 dark:bg-white/5";

  return (
    // ALTERADO: De dark:bg-gray-800 para dark:bg-dark-surface dark:bg-opacity-80
    <div className="bg-white dark:bg-dark-surface dark:bg-opacity-80 rounded-2xl shadow-lg p-6 h-full border border-gray-100 dark:border-gray-700/50">
      <div className="flex items-center gap-3 mb-5">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Top 6 Eventos Populares
        </h3>
      </div>

      <div className="space-y-4">
        {events.slice(0, 6).map((event, index) => (
          <div key={event.id}>
            <div className="flex items-center gap-4 py-2 group cursor-default">

              <div className={`w-8 h-8 flex items-center justify-center rounded-full ring-1 ${medalColor(index)} transition-transform group-hover:scale-110`}>
                {index < 3 ? <Trophy className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100 truncate group-hover:text-green-500 transition-colors">
                  {event.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {event.participants.toLocaleString('pt-BR')} participantes
                </p>
              </div>
            </div>

            {/* Linha divisória mais sutil */}
            {index < 5 && (
              <div className="border-b border-gray-100 dark:border-gray-700/30" />
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default TopEventsList; 
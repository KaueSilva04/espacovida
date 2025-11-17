import { Clock } from "lucide-react";

export default function EventsStatusCard({
  future,
  past,
}: {
  future: number;
  past: number;
}) {
  return (
    <div className="
      bg-gradient-to-br from-purple-50 to-purple-100 
      dark:bg-none dark:bg-dark-bg dark:border dark:border-dark-border 
      p-5 rounded-2xl shadow-lg
    ">
      <div className="flex items-start gap-4">
        <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        <div>
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Situação dos Eventos</p>

          <div className="flex items-baseline gap-1.5 mt-1">
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{future}</p>
            <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Futuros</p>
          </div>

          <div className="flex items-baseline gap-1.5 -mt-1">
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{past}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-500">Passados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
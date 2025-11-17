import { BarChart2 } from "lucide-react";

export default function AverageParticipantsCard({ average }: { average: number }) {
  return (
    <div className="
      bg-gradient-to-br from-red-50 to-red-100 
      dark:bg-none dark:bg-dark-bg dark:border dark:border-dark-border 
      p-5 rounded-2xl shadow-lg
    ">
      <div className="flex items-center gap-4">
        <BarChart2 className="w-8 h-8 text-red-600 dark:text-red-400" />
        <div>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">Média por Evento</p>
          <p className="text-3xl font-bold text-red-900 dark:text-red-200">{average}</p>
        </div>
      </div>
    </div>
  );
}
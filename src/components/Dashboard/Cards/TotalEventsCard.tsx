import { CalendarDays } from "lucide-react";

export default function TotalEventsCard({ total }: { total: number }) {
  return (
    <div className="
      bg-gradient-to-br from-blue-50 to-blue-100 
      dark:bg-none dark:bg-dark-bg dark:border dark:border-dark-border 
      p-5 rounded-2xl shadow-lg
    ">
      <div className="flex items-start gap-4">
        <CalendarDays className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        <div>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total de Eventos</p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">{total}</p>
        </div>
      </div>
    </div>
  );
}
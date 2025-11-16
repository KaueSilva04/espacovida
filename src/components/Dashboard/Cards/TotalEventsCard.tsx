import { CalendarDays } from "lucide-react";

export default function TotalEventsCard({ total }: { total: number }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:bg-gray-800 p-5 rounded-2xl shadow-lg">
      <div className="flex items-start gap-4">
        <CalendarDays className="w-8 h-8 text-blue-600" />
        <div>
          <p className="text-sm text-blue-700">Total de Eventos</p>
          <p className="text-3xl font-bold text-blue-900">{total}</p>
        </div>
      </div>
    </div>
  );
}

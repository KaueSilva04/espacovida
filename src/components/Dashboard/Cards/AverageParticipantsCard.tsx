import { BarChart2 } from "lucide-react";

export default function AverageParticipantsCard({ average }: { average: number }) {
  return (
    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:bg-gray-800 p-5 rounded-2xl shadow-lg">
      <div className="flex items-start gap-4">
        <BarChart2 className="w-8 h-8 text-red-600" />
        <div>
          <p className="text-sm text-red-700">Média por Evento</p>
          <p className="text-3xl font-bold text-red-900">{average}</p>
        </div>
      </div>
    </div>
  );
}

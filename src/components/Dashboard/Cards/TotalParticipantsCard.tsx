import { Users } from "lucide-react";

export default function TotalParticipantsCard({ total }: { total: number }) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:bg-gray-800 p-5 rounded-2xl shadow-lg">
      <div className="flex items-start gap-4">
        <Users className="w-8 h-8 text-green-600" />
        <div>
          <p className="text-sm text-green-700">Total de Participantes</p>
          <p className="text-3xl font-bold text-green-900">
            {total.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
}

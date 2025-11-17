import { Users } from "lucide-react";

export default function TotalParticipantsCard({ total }: { total: number }) {
  return (
    <div className="
      bg-gradient-to-br from-green-50 to-green-100 
      dark:bg-none dark:bg-dark-bg dark:border dark:border-dark-border 
      p-5 rounded-2xl shadow-lg
    ">
      <div className="flex items-start gap-4">
        <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
        <div>
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total de Participantes</p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-200">
            {total.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
}
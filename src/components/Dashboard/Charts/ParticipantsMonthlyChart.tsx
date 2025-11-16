import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Filter } from 'lucide-react';

interface MonthlyData {
  name: string;
  participantes: number;
}

interface ParticipantsMonthlyChartProps {
  data: MonthlyData[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const ParticipantsMonthlyChart: React.FC<ParticipantsMonthlyChartProps> = ({ data, selectedYear, onYearChange }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all h-full">
    
    {/* Cabeçalho */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Participantes por Mês
        </h3>
      </div>

      {/* Filtro por Ano */}
      <div className="relative">
        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm border-2 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-green-600 transition-all"
        >
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>
    </div>

    {/* Gráfico */}
    <div className="h-72 text-gray-600 dark:text-gray-400">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} />
          <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="participantes"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ParticipantsMonthlyChart;

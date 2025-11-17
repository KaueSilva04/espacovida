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
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const ParticipantsMonthlyChart: React.FC<ParticipantsMonthlyChartProps> = ({ data, years, selectedYear, onYearChange }) => (
  // ALTERADO: De dark:bg-gray-800 para dark:bg-dark-surface dark:bg-opacity-80
  <div className="bg-white dark:bg-dark-surface dark:bg-opacity-80 rounded-2xl shadow-lg p-6 transition-all h-full border border-gray-100 dark:border-gray-700/50">

    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Participantes por Mês
        </h3>
      </div>

      <div className="relative">
        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-transparent dark:bg-white/5 text-gray-700 dark:text-white rounded-lg focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all"
        >
          {years.map(year => (
            <option key={year} value={year} className="dark:bg-gray-900">{year}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="h-72 text-gray-600 dark:text-gray-400">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} stroke="#94a3b8" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'currentColor', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tick={{ fill: 'currentColor', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderColor: '#334155', 
                color: '#fff',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            cursor={{ stroke: '#334155', strokeWidth: 1 }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="participantes"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ParticipantsMonthlyChart;
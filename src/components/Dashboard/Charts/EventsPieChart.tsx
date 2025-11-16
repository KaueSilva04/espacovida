import React from 'react';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

interface EventDistribution {
  name: string;
  value: number;
  [key: string]: string | number; 
}


interface EventsPieChartProps {
  data: EventDistribution[];
}


const EventsPieChart: React.FC<EventsPieChartProps> = ({ data }) => {
  const COLORS = ['#8b5cf6', '#3b82f6']; // Roxo e azul

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all h-full">
      <div className="flex items-center gap-3 mb-5">
        <PieIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Distribuição de Eventos
        </h3>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventsPieChart;

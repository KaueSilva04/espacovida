import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
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
  const COLORS = ['#8b5cf6', '#3b82f6']; 

  return (
    // ALTERADO: De dark:bg-gray-800 para dark:bg-dark-surface dark:bg-opacity-80
    <div className="bg-white dark:bg-dark-surface dark:bg-opacity-80 rounded-2xl shadow-lg p-6 transition-all h-full border border-gray-100 dark:border-gray-700/50">
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
                <Cell key={index} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: '#0f172a', // Um fundo bem escuro para o tooltip combinar
                    borderColor: '#334155', 
                    color: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
                itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventsPieChart;
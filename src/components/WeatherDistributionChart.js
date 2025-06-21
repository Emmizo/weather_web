import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const WeatherDistributionChart = ({ data }) => {
    const { t } = useTranslation();

  const COLORS = {
    cloudy: '#FFC107',
    sunny: '#DDDDDD',
    rainy: '#03A9F4',
  };

  const chartData = data.map(item => ({...item, name: t(item.name)}));

  return (
    <div className="chart-container">
      <h3>{t('weather_distribution')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[data[index].name]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherDistributionChart; 
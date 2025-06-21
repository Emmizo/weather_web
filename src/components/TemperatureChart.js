import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const TemperatureChart = ({ data, range }) => {
    const { t } = useTranslation();
  return (
    <div className="chart-container">
      <h3>{t('temperature_trend')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {range === 'today' ? (
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" name={t('temperature')} unit="°C" />
          ) : (
            <>
              <Line type="monotone" dataKey="max" stroke="#ff7300" name={`${t('temperature')} Max`} unit="°C" />
              <Line type="monotone" dataKey="min" stroke="#387908" name={`${t('temperature')} Min`} unit="°C" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart; 
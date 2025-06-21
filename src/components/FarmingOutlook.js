import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTractor } from 'react-icons/fa';
import { WiThermometer, WiRaindrop } from 'react-icons/wi';
import './FarmingOutlook.css';

const FarmingOutlook = ({ weatherData, range }) => {
    const { t } = useTranslation();

    if (!weatherData || !weatherData.daily) {
        return null;
    }

    const days = range === 'week' ? 7 : 16;
    const {
        temperature_2m_max,
        temperature_2m_min,
        precipitation_probability_max
    } = weatherData.daily;

    const avgTemp = (temperature_2m_max.slice(0, days).reduce((a, b) => a + b, 0) + temperature_2m_min.slice(0, days).reduce((a, b) => a + b, 0)) / (days * 2);
    const avgRainfall = precipitation_probability_max.slice(0, days).reduce((a, b) => a + b, 0) / days;

    let recommendationKey = "primary_recommendation_normal";
    if (avgTemp > 28) recommendationKey = "primary_recommendation_hot";
    else if (avgRainfall < 20) recommendationKey = "primary_recommendation_dry";

    return (
        <div className="farming-outlook">
            <h3 className="farming-outlook-title">
                <FaTractor /> {t('16_day_farming_outlook')}
            </h3>
            <div className="farming-outlook-metrics">
                <div className="metric-row">
                    <span className="metric-label"><WiThermometer /> {t('avg_temp_days', { days })}</span>
                    <span className="metric-value">{avgTemp.toFixed(1)}°C</span>
                </div>
                <div className="metric-row">
                    <span className="metric-label"><WiRaindrop /> {t('avg_rainfall_chance_days', { days })}</span>
                    <span className="metric-value">{avgRainfall.toFixed(1)}%</span>
                </div>
            </div>
            <div className="farming-outlook-recommendation">
                <h4>{t('primary_recommendation')}</h4>
                <p>{t(recommendationKey, { days: 16 })}</p>
            </div>
        </div>
    );
};

export default FarmingOutlook; 
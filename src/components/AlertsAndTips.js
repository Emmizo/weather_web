import React from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { FaInfoCircle } from 'react-icons/fa';
import './AlertsAndTips.css';

const getTips = (dailyData, t) => {
    const tips = [];
    if (!dailyData) return tips;

    const {
        temperature_2m_max,
        temperature_2m_min,
        precipitation_probability_max
    } = dailyData;

    // Heatwave alert
    if (temperature_2m_max.slice(0, 7).filter(temp => temp > 30).length >= 3) {
        tips.push({
            id: 'heatwave',
            title: t('alerts.heatwave.title'),
            text: t('alerts.heatwave.text'),
            tag: t('alerts.heatwave.tag'),
            icon: '☀️',
            color: '#ff6b6b'
        });
    }

    // Irrigation planning alert (only if not a heatwave)
    const avgPrecip = precipitation_probability_max.slice(0, 16).reduce((a, b) => a + b, 0) / 16;
    if (avgPrecip < 20 && !tips.some(tip => tip.id === 'heatwave')) {
        tips.push({
            id: 'irrigation',
            title: t('alerts.irrigation_planning.title'),
            text: t('alerts.irrigation_planning.text'),
            tag: t('alerts.irrigation_planning.tag'),
            icon: '💧',
            color: '#28a745'
        });
    }

    // Cold snap alert
    if (temperature_2m_min.slice(0, 7).filter(temp => temp < 10).length >= 3) {
        tips.push({
            id: 'cold_snap',
            title: t('alerts.cold_snap.title'),
            text: t('alerts.cold_snap.text'),
            tag: t('alerts.cold_snap.tag'),
            icon: '❄️',
            color: '#4db5ff'
        });
    }
    
    // Heavy rain alert
    if (precipitation_probability_max.slice(0, 7).filter(p => p > 60).length >= 3) {
        tips.push({
            id: 'heavy_rain',
            title: t('alerts.heavy_rain.title'),
            text: t('alerts.heavy_rain.text'),
            tag: t('alerts.heavy_rain.tag'),
            icon: '🌧️',
            color: '#546e7a'
        });
    }

    if (tips.length === 0) {
        tips.push({
            id: 'normal',
            title: t('alerts.normal.title'),
            text: t('alerts.normal.text'),
            tag: t('alerts.normal.tag'),
            icon: '✅',
            color: '#28a745'
        });
    }

    return tips;
}


const AlertsAndTips = ({ weatherData }) => {
    const { t } = useTranslation();
    
    const tips = getTips(weatherData.daily, t);

    const sliderSettings = {
        dots: true,
        infinite: tips.length > 1, // Only loop if there is more than one tip
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 7000,
        arrows: false,
    };

    return (
        <div className="alerts-section">
            <h3 className="alerts-title">
                <FaInfoCircle /> {t('todays_alerts_tips')}
            </h3>
            <Slider {...sliderSettings}>
                {tips.map(tip => (
                    <div key={tip.id}>
                        <div className="alert-card">
                            <div className="alert-icon">{tip.icon}</div>
                            <div className="alert-content">
                                <h4>{tip.title}</h4>
                                <p>{tip.text}</p>
                            </div>
                            <span className="alert-tag" style={{ backgroundColor: tip.color }}>{tip.tag}</span>
                        </div>
                    </div>
                ))}
            </Slider>
            <div className="swipe-indicator">
                {tips.length > 1 && `${t('swipe_to_see_more')} • ${t('auto_sliding')}`}
            </div>
        </div>
    );
};

export default AlertsAndTips; 
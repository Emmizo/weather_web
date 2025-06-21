import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTractor } from 'react-icons/fa';
import './FarmingOutlook.css'; // Reusing the same styles

const TwoMonthOutlook = ({ twoMonthData }) => {
    const { t } = useTranslation();

    if (!twoMonthData) {
        return <p>Loading 2-Month Outlook...</p>;
    }

    const avgTemp = twoMonthData.daily.temperature_2m_mean.reduce((a, b) => a + b, 0) / twoMonthData.daily.temperature_2m_mean.length;
    const totalPrecip = twoMonthData.daily.precipitation_sum.reduce((a, b) => a + b, 0);

    let recommendationKey = 'two_month_outlook_normal';
    if (avgTemp > 25 && totalPrecip < 100) {
        recommendationKey = 'two_month_outlook_hot_dry';
    } else if (totalPrecip > 400) {
        recommendationKey = 'two_month_outlook_rainy_season';
    }
    const recommendation = t(recommendationKey);

    return (
        <div className="farming-outlook">
            <h3 className="outlook-title">
                <FaTractor /> {t('two_month_outlook_title')}
            </h3>
            <div className="outlook-recommendation">
                <h4>{t('primary_recommendation')}</h4>
                <p>{recommendation}</p>
            </div>
        </div>
    );
};

export default TwoMonthOutlook; 
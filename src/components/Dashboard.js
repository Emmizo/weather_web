import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { getCoordinates, getHourlyForecast, getSixteenDayForecast, getAirQuality, getTwoMonthOutlook } from '../api/weatherService';
import Header from './Header';
import MetricCard from './MetricCard';
import TemperatureChart from './TemperatureChart';
import WeatherDistributionChart from './WeatherDistributionChart';
import FarmingOutlook from './FarmingOutlook';
import TwoMonthOutlook from './TwoMonthOutlook';
import AlertsAndTips from './AlertsAndTips';
import { WiThermometer, WiStrongWind, WiRaindrops } from 'react-icons/wi';
import { FaWind } from 'react-icons/fa';
import './Dashboard.css';

const weatherCodeToDistribution = (code) => {
    if (code === 0) return 'sunny';
    if (code > 0 && code < 4) return 'cloudy';
    if ((code > 40 && code < 50)) return 'cloudy'; // fog
    return 'rainy';
}

const Dashboard = () => {
  const { t } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const [dailyWeatherData, setDailyWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [twoMonthData, setTwoMonthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Kicukiro');
  
  const mainSliderRef = useRef(null);
  const ranges = ['today', 'week', 'month'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: coords } = await getCoordinates(selectedLocation);
        if (!coords || !coords.results || coords.results.length === 0) {
          throw new Error(`Could not find coordinates for ${selectedLocation}`);
        }
        
        const { latitude, longitude } = coords.results[0];
        
        const [hourly, daily, airQuality, twoMonth] = await Promise.all([
          getHourlyForecast(latitude, longitude),
          getSixteenDayForecast(latitude, longitude),
          getAirQuality(latitude, longitude),
          getTwoMonthOutlook(latitude, longitude)
        ]);

        setWeatherData(hourly.data);
        setDailyWeatherData(daily.data);
        setAirQualityData(airQuality.data);
        setTwoMonthData(twoMonth.data);

      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedLocation]);
  
  const handleRangeChange = (range) => {
    const index = ranges.indexOf(range);
    if(index !== -1 && mainSliderRef.current) {
        setActiveSlide(index);
        mainSliderRef.current.slickGoTo(index);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (error) {
    return <div className="loading-screen">Error: {error}</div>;
  }

  if (!weatherData || !dailyWeatherData || !airQualityData || !twoMonthData) {
    return <div className="loading-screen">No data available.</div>;
  }
  
  const { current_weather, hourly } = weatherData;

  const metricSliderSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      autoplay: false,
      responsive: [
          { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
          { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
          { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
  };

  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    afterChange: (current) => setActiveSlide(current)
  };

  const getChartDataForRange = (range) => {
    if (range === 'today') {
        return hourly.time.slice(0, 24).map((time, index) => ({
            time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temperature: hourly.temperature_2m[index],
        }));
    } else {
        const days = range === 'week' ? 7 : 16;
        return dailyWeatherData.daily.time.slice(0, days).map((time, index) => ({
            time: new Date(time).toLocaleDateString([], { weekday: 'short', day: 'numeric' }),
            max: dailyWeatherData.daily.temperature_2m_max[index],
            min: dailyWeatherData.daily.temperature_2m_min[index],
        }));
    }
  }

  const getWeatherDistributionForRange = (range) => {
      const days = range === 'week' ? 7 : 16;
      const codes = range === 'today' 
        ? hourly.weathercode.slice(0, 24) 
        : dailyWeatherData.daily.weathercode.slice(0, days);
      
      const distribution = codes.reduce((acc, code) => {
        const category = weatherCodeToDistribution(code);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, { sunny: 0, cloudy: 0, rainy: 0 });

      return [
          { name: 'cloudy', value: distribution.cloudy},
          { name: 'sunny', value: distribution.sunny },
          { name: 'rainy', value: distribution.rainy },
      ];
  }

  return (
    <div className="dashboard">
      <Header 
        selectedRange={ranges[activeSlide]}
        onSelectRange={handleRangeChange}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />
      
      <AlertsAndTips weatherData={dailyWeatherData} />

      <div className="metrics-carousel">
        <Slider {...metricSliderSettings}>
            <MetricCard title={t('temperature')} value={current_weather.temperature} unit="°C" icon={<WiThermometer />} />
            <MetricCard title={t('wind_speed')} value={current_weather.windspeed} unit="km/h" icon={<WiStrongWind />} />
            <MetricCard title={t('precipitation')} value={hourly.precipitation_probability ? hourly.precipitation_probability[0] : '--'} unit="%" icon={<WiRaindrops />} />
            {airQualityData && airQualityData.hourly && (
                <MetricCard title="Air Quality" icon={<FaWind />}>
                    <div className="air-quality-values">
                        <p className="metric-value-small">
                            PM10: {airQualityData.hourly.pm10 ? airQualityData.hourly.pm10[0] : '--'}
                            <span className="metric-unit-small">µg/m³</span>
                        </p>
                        <p className="metric-value-small">
                            PM2.5: {airQualityData.hourly.pm2_5 ? airQualityData.hourly.pm2_5[0] : '--'}
                            <span className="metric-unit-small">µg/m³</span>
                        </p>
                    </div>
                </MetricCard>
            )}
        </Slider>
      </div>

      <Slider ref={mainSliderRef} {...mainSliderSettings}>
        {ranges.map(range => (
            <div key={range}>
                <div className="charts-grid">
                    <TemperatureChart data={getChartDataForRange(range)} range={range} />
                    <WeatherDistributionChart data={getWeatherDistributionForRange(range)} />
                </div>
                {range === 'today' && twoMonthData && <TwoMonthOutlook twoMonthData={twoMonthData} />}
                {range !== 'today' && <FarmingOutlook weatherData={dailyWeatherData} range={range} />}
            </div>
        ))}
      </Slider>
    </div>
  );
};

export default Dashboard; 
import axios from 'axios';

const API_BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1';
const AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1';
const CLIMATE_API_URL = 'https://climate-api.open-meteo.com/v1/climate';

const Endpoints = {
    forecast: `${API_BASE_URL}/forecast`,
    geocoding: `${GEOCODING_API_URL}/search`,
    airQuality: `${AIR_QUALITY_API_URL}/air-quality`,
    climate: CLIMATE_API_URL,
};

const apiClient = axios.create();

export const getCoordinates = (name) => {
    const params = { name, count: 1, language: 'en', format: 'json' };
    return apiClient.get(Endpoints.geocoding, { params });
};

export const getHourlyForecast = (latitude, longitude) => {
    const params = {
        latitude,
        longitude,
        current_weather: 'true',
        hourly: 'temperature_2m,precipitation_probability,weathercode,relativehumidity_2m,windspeed_10m',
        timezone: 'auto',
        forecast_days: 2
    };
    return apiClient.get(Endpoints.forecast, { params });
};

export const getSixteenDayForecast = (latitude, longitude) => {
    const params = {
        latitude,
        longitude,
        daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
        timezone: 'auto'
    };
    return apiClient.get(Endpoints.forecast, { params });
};

export const getAirQuality = (latitude, longitude) => {
    const params = { latitude, longitude, hourly: 'pm10,pm2_5,european_aqi', timezone: 'auto' };
    return apiClient.get(Endpoints.airQuality, { params });
};

export const getTwoMonthOutlook = (latitude, longitude) => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 60);
    const formatDate = (date) => date.toISOString().split('T')[0];

    const params = {
        latitude,
        longitude,
        model: 'CMCC_CM2_VHR4',
        daily: ['temperature_2m_mean', 'precipitation_sum'],
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
    };
    return apiClient.get(Endpoints.climate, { params });
}; 
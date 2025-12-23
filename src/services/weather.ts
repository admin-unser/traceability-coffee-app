import type { WeatherData, WeatherCondition } from '../types';

// 沖縄県大宜味村の座標（概算）
const OGIMI_LAT = 26.7;
const OGIMI_LON = 128.1;

const conditionMap: Record<number, WeatherCondition> = {
  0: 'sunny',    // Clear sky
  1: 'sunny',    // Mainly clear
  2: 'cloudy',   // Partly cloudy
  3: 'cloudy',   // Overcast
  45: 'cloudy',  // Fog
  48: 'cloudy',  // Depositing rime fog
  51: 'rainy',   // Light drizzle
  53: 'rainy',   // Moderate drizzle
  55: 'rainy',   // Dense drizzle
  61: 'rainy',   // Slight rain
  63: 'rainy',   // Moderate rain
  65: 'rainy',   // Heavy rain
  71: 'rainy',   // Slight snow
  73: 'rainy',   // Moderate snow
  75: 'rainy',   // Heavy snow
  77: 'rainy',   // Snow grains
  80: 'rainy',   // Slight rain showers
  81: 'rainy',   // Moderate rain showers
  82: 'stormy',  // Violent rain showers
  85: 'rainy',   // Slight snow showers
  86: 'rainy',   // Heavy snow showers
  95: 'stormy',  // Thunderstorm
  96: 'stormy',  // Thunderstorm with slight hail
  99: 'stormy',  // Thunderstorm with heavy hail
};

export const weatherService = {
  async getCurrentWeather(): Promise<WeatherData> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${OGIMI_LAT}&longitude=${OGIMI_LON}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo&forecast_days=1`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();
      const current = data.current;
      const daily = data.daily;

      return {
        temperature: Math.round(current.temperature_2m),
        maxTemperature: daily?.temperature_2m_max?.[0] ? Math.round(daily.temperature_2m_max[0]) : undefined,
        minTemperature: daily?.temperature_2m_min?.[0] ? Math.round(daily.temperature_2m_min[0]) : undefined,
        condition: conditionMap[current.weather_code] || 'cloudy',
        humidity: current.relative_humidity_2m,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      // フォールバック: デフォルト値
      return {
        temperature: 25,
        maxTemperature: 28,
        minTemperature: 22,
        condition: 'sunny',
        timestamp: new Date().toISOString(),
      };
    }
  },
};


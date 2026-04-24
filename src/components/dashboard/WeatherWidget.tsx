import { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Droplets, Thermometer } from 'lucide-react';
import { weatherService } from '../../services/weather';
import type { WeatherData, WeatherCondition } from '../../types';

const weatherIcons: Record<WeatherCondition, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
};

const weatherLabels: Record<WeatherCondition, string> = {
  sunny: '晴れ',
  cloudy: '曇り',
  rainy: '雨',
  stormy: '嵐',
};

const weatherGradients: Record<WeatherCondition, string> = {
  sunny: 'from-amber-400 to-orange-500',
  cloudy: 'from-gray-400 to-gray-500',
  rainy: 'from-blue-400 to-blue-600',
  stormy: 'from-gray-600 to-gray-800',
};

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    weatherService.getCurrentWeather().then(setWeather);
  }, []);

  if (!weather) {
    return (
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-5 text-white animate-pulse h-32" />
    );
  }

  const WeatherIcon = weatherIcons[weather.condition];
  const gradient = weatherGradients[weather.condition];

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-6" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm mb-1">大宜味村</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">{weather.temperature}°</span>
            <span className="text-white/80 text-sm mb-1.5">{weatherLabels[weather.condition]}</span>
          </div>
          <div className="flex gap-3 mt-2">
            {weather.maxTemperature !== undefined && (
              <div className="flex items-center gap-1 text-xs text-white/80">
                <Thermometer size={12} />
                <span>最高 {weather.maxTemperature}°</span>
              </div>
            )}
            {weather.minTemperature !== undefined && (
              <span className="text-xs text-white/80">最低 {weather.minTemperature}°</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <WeatherIcon size={40} strokeWidth={1.5} />
          {weather.humidity !== undefined && (
            <div className="flex items-center gap-1 text-xs text-white/80">
              <Droplets size={12} />
              <span>{weather.humidity}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

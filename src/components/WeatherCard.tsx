import { Cloud, CloudRain, Sun, Zap } from 'lucide-react';
import type { WeatherData, WeatherCondition } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
}

const conditionIcons: Record<WeatherCondition, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: Zap,
};

const conditionLabels: Record<WeatherCondition, string> = {
  sunny: '晴れ',
  cloudy: '曇り',
  rainy: '雨',
  stormy: '嵐',
};

export function WeatherCard({ weather }: WeatherCardProps) {
  const Icon = conditionIcons[weather.condition];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">現在の天気</p>
          <div className="flex items-center gap-3">
            <Icon className="w-8 h-8 text-coffee-brown" />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {weather.temperature}°C
              </p>
              <p className="text-sm text-gray-600">
                {conditionLabels[weather.condition]}
              </p>
            </div>
          </div>
        </div>
        {weather.humidity && (
          <div className="text-right">
            <p className="text-sm text-gray-600">湿度</p>
            <p className="text-xl font-semibold text-gray-800">
              {weather.humidity}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


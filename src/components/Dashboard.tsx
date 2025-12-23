import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, Droplets, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import type { Activity, WeatherData } from '../types';
import { weatherService } from '../services/weather';
import { ActivityCalendar } from './ActivityCalendar';
import { ActivityList } from './ActivityList';
import { CoffeeNews } from './CoffeeNews';
import { StaggerContainer, StaggerItem, AnimatedCounter } from './AnimatedComponents';

interface DashboardProps {
  activities: Activity[];
  onActivityEdit?: (activity: Activity) => void;
  onActivityDelete?: (id: string) => void;
}

export function Dashboard({ activities, onActivityEdit, onActivityDelete }: DashboardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    weatherService.getCurrentWeather().then(setWeather).catch(console.error);
  }, []);

  useEffect(() => {
    setRecentActivities(activities.slice(0, 5));
  }, [activities]);

  return (
    <StaggerContainer className="space-y-4 p-4">
      {/* Weather Card - Natural style */}
      <StaggerItem>
        <motion.div 
          className="card-natural p-5"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          {/* Location header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-forest-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">現在地</h2>
              <p className="text-sm text-text-secondary">沖縄県大宜味村</p>
            </div>
          </div>
          
          {/* Weather grid */}
          <div className="grid grid-cols-4 gap-3">
            <WeatherCard 
              icon={<Thermometer className="w-4 h-4" />}
              label="現在"
              value={weather?.temperature}
              suffix="°"
              color="terracotta"
            />
            <WeatherCard 
              icon={<ArrowUp className="w-4 h-4" />}
              label="最高"
              value={weather?.maxTemperature}
              suffix="°"
              color="red"
            />
            <WeatherCard 
              icon={<ArrowDown className="w-4 h-4" />}
              label="最低"
              value={weather?.minTemperature}
              suffix="°"
              color="forest"
            />
            <WeatherCard 
              icon={<Droplets className="w-4 h-4" />}
              label="湿度"
              value={weather?.humidity}
              suffix="%"
              color="blue"
            />
          </div>
        </motion.div>
      </StaggerItem>

      {/* Calendar */}
      <StaggerItem>
        <ActivityCalendar 
          activities={activities}
          onActivityEdit={onActivityEdit}
          onActivityDelete={onActivityDelete}
        />
      </StaggerItem>

      {/* Recent Activities */}
      <StaggerItem>
        <div className="card-natural p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-terracotta-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">最近の活動</h2>
              <p className="text-sm text-text-secondary">直近の記録一覧</p>
            </div>
          </div>
          <ActivityList
            activities={recentActivities}
            onEdit={onActivityEdit}
            onDelete={onActivityDelete}
          />
        </div>
      </StaggerItem>

      {/* Coffee News */}
      <StaggerItem>
        <CoffeeNews />
      </StaggerItem>
    </StaggerContainer>
  );
}

// Weather Card Component
interface WeatherCardProps {
  icon: React.ReactNode;
  label: string;
  value?: number;
  suffix?: string;
  color: 'terracotta' | 'forest' | 'red' | 'blue';
}

function WeatherCard({ icon, label, value, suffix = '', color }: WeatherCardProps) {
  const colorStyles = {
    terracotta: {
      bg: 'bg-terracotta-50',
      text: 'text-terracotta-500',
      icon: 'text-terracotta-400',
    },
    forest: {
      bg: 'bg-forest-50',
      text: 'text-forest-500',
      icon: 'text-forest-400',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-500',
      icon: 'text-red-400',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-500',
      icon: 'text-blue-400',
    },
  };
  
  const style = colorStyles[color];

  return (
    <motion.div 
      className={`rounded-2xl p-3 text-center ${style.bg}`}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-center gap-1 mb-1">
        <span className={style.icon}>{icon}</span>
        <span className="text-xs text-text-secondary">{label}</span>
      </div>
      {value !== undefined ? (
        <div className="font-data">
          <AnimatedCounter 
            value={value} 
            suffix={suffix}
            className={`text-xl font-bold ${style.text}`}
          />
        </div>
      ) : (
        <p className="text-xl font-bold text-text-muted font-data">--</p>
      )}
    </motion.div>
  );
}

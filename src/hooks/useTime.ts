import { useState, useEffect } from 'react';
import { useSettings } from '../providers/SettingsProvider';

export function useTime() {
  const { settings } = useSettings();
  const { timezone } = settings;

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time parts for the clock display
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat('en-US', {
    ...formatOptions,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = formatter.formatToParts(time);
  
  const hours = parts.find(p => p.type === 'hour')?.value ?? '00';
  const minutes = parts.find(p => p.type === 'minute')?.value ?? '00';
  const seconds = parts.find(p => p.type === 'second')?.value ?? '00';

  const dateString = time.toLocaleString('en-US', {
    timeZone: timezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return {
    time,
    hours,
    minutes,
    seconds,
    dateString,
    timezone,
  };
}


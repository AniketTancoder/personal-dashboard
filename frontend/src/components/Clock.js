import React, { useState, useEffect } from 'react';
import './Widget.css';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-icon">⏰</span>
        <h2>Current Time</h2>
      </div>
      <div className="widget-content">
        <div className="clock-time">
          {currentTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
          })}
        </div>
        <div className="clock-date">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
    </div>
  );
};

export default Clock;
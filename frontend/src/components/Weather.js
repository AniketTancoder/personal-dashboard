import React, { useState, useEffect } from 'react';
import './Widget.css';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        if (!response.ok) {
          throw new Error('Weather API not available');
        }
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        // Fallback to mock data if backend is not available
        const mockWeatherData = {
          temp: Math.floor(Math.random() * 30) + 10,
          humidity: Math.floor(Math.random() * 50) + 30,
          wind: Math.floor(Math.random() * 20) + 5,
          description: ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
          icon: "☀️",
          city: "Local"
        };
        setWeather(mockWeatherData);
        setError('Using mock data - Backend unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather every 5 minutes
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="widget loading">Loading weather...</div>;

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-icon">🌤️</span>
        <h2>Weather</h2>
        {error && <span className="error-badge">Mock</span>}
      </div>
      <div className="widget-content">
        {error && <div className="warning-message">{error}</div>}
        <div className="weather-info">
          <div className="weather-main">
            <div className="weather-temp">{weather.temp}°C</div>
            <div className="weather-description">{weather.description}</div>
          </div>
          <div className="weather-details">
            <div className="weather-detail">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{weather.humidity}%</span>
            </div>
            <div className="weather-detail">
              <span className="detail-label">Wind</span>
              <span className="detail-value">{weather.wind} km/h</span>
            </div>
            <div className="weather-detail">
              <span className="detail-label">Location</span>
              <span className="detail-value">{weather.city}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
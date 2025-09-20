import React, { useState, useEffect } from 'react';
import './Widget.css';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockWeatherData = {
          temp: Math.floor(Math.random() * 30) + 10, // Random temp between 10-40°C
          humidity: Math.floor(Math.random() * 50) + 30, // Random humidity between 30-80%
          wind: Math.floor(Math.random() * 20) + 5, // Random wind between 5-25 km/h
          description: ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
          icon: "☀️",
          city: "New York"
        };
        
        setWeather(mockWeatherData);
      } catch (err) {
        setError('Unable to fetch weather data');
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
  if (error) return <div className="widget error">Error: {error}</div>;

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-icon">🌤️</span>
        <h2>Weather</h2>
      </div>
      <div className="widget-content">
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
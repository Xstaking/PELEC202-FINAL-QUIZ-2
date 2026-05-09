import React, { useState } from 'react';
import './App.css';

// ⚠️ Replace with your actual API key from https://openweathermap.org/api
// For production: use process.env.REACT_APP_API_KEY with a .env file
const API_KEY = 'f86438c53d9166f62a33c036561880f1';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await fetch(
        `${API_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found');
        }
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      setWeather({
        city: data.name,
        temperature: data.main.temp,
        condition: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && city.trim()) {
      fetchWeather(city);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌤️ Weather App</h1>
        <p className="subtitle">Check the weather anywhere in the world</p>
      </header>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <input
            type="text"
            className="city-input"
            placeholder="Enter city name (e.g., London, Tokyo)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="City name input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-btn"
            disabled={loading || !city.trim()}
            aria-label="Search weather"
          >
            {loading ? (
              <span className="spinner" aria-hidden="true"></span>
            ) : (
              '🔍 Search'
            )}
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="status-message loading">
          <span className="loading-dots">Loading</span>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="status-message error" role="alert">
          ⚠️ {error}
        </div>
      )}
      
      {/* Weather Data Display */}
      {weather && !loading && !error && (
        <div className="weather-card" aria-live="polite">
          <div className="weather-icon">
            {weather.icon && (
              <img 
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                alt={weather.condition}
                width="80"
                height="80"
              />
            )}
          </div>
          
          <h2 className="city-name">{weather.city}</h2>
          
          <div className="temperature">
            <span className="temp-value">{Math.round(weather.temperature)}</span>
            <span className="temp-unit">°C</span>
          </div>
          
          <p className="condition">
            <span className="condition-label">Condition:</span>
            <span className="condition-value">{weather.condition}</span>
          </p>
          
          <div className="weather-footer">
            <small>Data provided by OpenWeatherMap</small>
          </div>
        </div>
      )}

      {/* Empty State Hint */}
      {!weather && !loading && !error && (
        <div className="hint">
          <p>💡 Try searching for: <strong>Paris</strong>, <strong>New York</strong>, or <strong>Tokyo</strong></p>
        </div>
      )}
    </div>
  );
}

export default App;
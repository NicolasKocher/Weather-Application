import "../styles/Forecast.css";
import React, { useState, useEffect } from 'react';
import useGeolocation from "../components/Geolocation";

const Forecast = () => {
  const [forecast, setForecast] = useState([]);

  const { coords } = useGeolocation();

  useEffect(() => {
    const apiKey = 'ac38eaac6b1fe46460c2813b9d7b964d'; // Ersetzen Sie 'YOUR_API_KEY' mit Ihrem API-Schlüssel
    if (coords) {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}&units=metric`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const dailyData = {};
          
          data.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('de-DE', { weekday: 'long' });
            
            if (!dailyData[day]) {
              dailyData[day] = { min: item.main.temp_min, max: item.main.temp_max };
            } else {
              dailyData[day].min = Math.min(dailyData[day].min, item.main.temp_min);
              dailyData[day].max = Math.max(dailyData[day].max, item.main.temp_max);
            }
          });

          setForecast(Object.entries(dailyData).slice(0, 5));
        })
        .catch(error => console.error("Fehler beim Abrufen der Wetterdaten: ", error));
    }
  }, [coords]);

  return (
    <div>
      <h2>Wettervorhersage</h2>
      {forecast.length > 0 ? (
        <ul className="forecast-container">
          {forecast.map(([day, temps], index) => (
            <li key={index} className="single-forecast">
              {day} - Min: {temps.min.toFixed(1)}°C, Max: {temps.max.toFixed(1)}°C
            </li>
          ))}
        </ul>
      ) : (
        <p>Lade Wetterdaten...</p>
      )}
    </div>
  );
};

export default Forecast;

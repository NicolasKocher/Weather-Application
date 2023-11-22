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
        .then(responseData => {
          const dailyData = {};
          
          responseData.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('de-DE', { weekday: 'long' });

            if (!dailyData[day]) {
              dailyData[day] = { 
                min: item.main.temp_min, 
                max: item.main.temp_max,
                icon: item.weather[0].icon // Extrahiert den Icon-Code
              };
            } else {
              dailyData[day].min = Math.min(dailyData[day].min, item.main.temp_min);
              dailyData[day].max = Math.max(dailyData[day].max, item.main.temp_max);
              if (!dailyData[day].icon) {
                dailyData[day].icon = item.weather[0].icon; // Stellt sicher, dass ein Icon-Code gesetzt wird, falls noch nicht vorhanden
              }
            }
          });

          setForecast(Object.entries(dailyData).slice(0, 5));
        })
        .catch(error => console.error("Fehler beim Abrufen der Wetterdaten: ", error));
    }
  }, [coords]);

  return (
    <div>
      {forecast.length > 0 ? (
        <ul className="forecast-container">
          {forecast.map(([day, dayData], index) => (
            <div key={index} className="whole-forecast-container">
              <li className="single-forecast-day">
                {day}
              </li>
              {dayData.icon && 
                <img 
                  src={`http://openweathermap.org/img/wn/${dayData.icon}@2x.png`} 
                  alt="Wettericon"
                  className="weather-icon"
                />
              }
              <div className="min-max-container">
                <li className="single-forecast">
                  {Math.floor(dayData.min.toFixed(1))}°
                </li>
                <li className="single-forecast">
                  {Math.floor(dayData.max.toFixed(1))}°
                </li>
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <p>Lade Wetterdaten...</p>
      )}
    </div>
  );
};

export default Forecast;

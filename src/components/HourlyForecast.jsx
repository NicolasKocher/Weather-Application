import React, { useState, useEffect } from "react";
import useGeolocation from "./Geolocation";
import "ldrs/ring";
import "../styles/HourlyForecast.css";

const HourlyForecast = ({ isDarkMode }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { coords } = useGeolocation();

  useEffect(() => {
    const apiKey = "ac38eaac6b1fe46460c2813b9d7b964d";
    if (coords) {
      setIsLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}&units=metric&lang=de&cnt=24`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const now = new Date();
          const today = now.getDate();
          let lastDay = null;

          const processedData = data.list
            .slice(0, 24) // Nur die nächsten 24 Zeitpunkte
            .map((item) => {
              const date = new Date(item.dt * 1000);
              const hour = date.getHours();
              const day = date.getDate();
              const month = date.getMonth() + 1;

              // Bestimme, ob es der aktuelle Zeitpunkt ist
              const isNow =
                date.getHours() === now.getHours() &&
                date.getDate() === now.getDate();

              // Bestimme, ob ein neuer Tag beginnt
              const isNewDay = lastDay !== null && day !== lastDay;

              // Aktualisiere den letzten Tag
              lastDay = day;

              // Formatiere das Datum für die Anzeige
              let displayDate = "";
              if (day === today) {
                displayDate = "Heute";
              } else if (day === today + 1) {
                displayDate = "Morgen";
              } else {
                const days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
                displayDate = `${days[date.getDay()]} ${day}.${month}.`;
              }

              return {
                time: isNow ? "Jetzt" : `${hour}:00`,
                temp: Math.round(item.main.temp),
                icon: item.weather[0].icon,
                description: item.weather[0].description,
                isNow: isNow,
                isNewDay: isNewDay,
                displayDate: displayDate,
                day: day,
              };
            });

          // Prüfen, ob der erste Eintrag eine Tagesmarkierung benötigt
          if (processedData.length > 0) {
            processedData[0].isFirstDay = true;
          }

          setHourlyData(processedData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(
            "Fehler beim Abrufen der stündlichen Wetterdaten:",
            error
          );
          setIsLoading(false);
        });
    }
  }, [coords]);

  if (isLoading) {
    return (
      <div className="hourly-forecast-loading">
        <l-ring size="40" color={isDarkMode ? "#ffffff" : "#007AFF"}></l-ring>
      </div>
    );
  }

  return (
    <div
      className={`hourly-forecast-container ${isDarkMode ? "dark-mode" : ""}`}
    >
      <h2 className="hourly-forecast-title">Stündliche Vorhersage</h2>
      <div className="hourly-forecast-scroll">
        {hourlyData.map((item, index) => (
          <React.Fragment key={index}>
            {(item.isFirstDay || item.isNewDay) && (
              <div className="hourly-day-separator">
                <span className="day-label">{item.displayDate}</span>
              </div>
            )}
            <div
              className={`hourly-item ${item.isNow ? "hourly-item-now" : ""}`}
            >
              <span className="hourly-time">{item.time}</span>
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                alt={item.description}
                className="hourly-icon"
                title={item.description}
              />
              <span className="hourly-temp">{item.temp}°</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;

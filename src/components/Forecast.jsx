import "../styles/Forecast.css";
import React, { useState, useEffect } from "react";
import useGeolocation from "./Geolocation";
import "ldrs/ring";

const Forecast = ({ isDarkMode }) => {
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { coords } = useGeolocation();

  useEffect(() => {
    const apiKey = "ac38eaac6b1fe46460c2813b9d7b964d";
    if (coords) {
      setIsLoading(true);
      // 5-Tage-Vorhersage für alle 3 Stunden
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}&units=metric&lang=de`;

      fetch(url)
        .then((response) => response.json())
        .then((responseData) => {
          // Gruppieren nach Tagen
          const dailyData = {};

          responseData.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const dayOfWeek = date.getDay();
            const today = new Date().getDay();

            // Behandlung der Wochentage - "Heute", "Morgen" und dann Wochentage
            let dayKey;
            if (dayOfWeek === today) {
              dayKey = "Heute";
            } else if (dayOfWeek === (today + 1) % 7) {
              dayKey = "Morgen";
            } else {
              dayKey = date.toLocaleDateString("de-DE", { weekday: "long" });
            }

            // Extrahieren der Temperatur und Icon für jeden Zeitpunkt
            const tempData = {
              temp: item.main.temp,
              tempMin: item.main.temp_min,
              tempMax: item.main.temp_max,
              icon: item.weather[0].icon,
              description: item.weather[0].description,
              time: date.getHours(),
            };

            // Initialisieren oder aktualisieren
            if (!dailyData[dayKey]) {
              dailyData[dayKey] = {
                tempMin: tempData.tempMin,
                tempMax: tempData.tempMax,
                icon: tempData.icon,
                description: tempData.description,
                hourlyData: [tempData],
                isToday: dayKey === "Heute",
              };
            } else {
              // Min und Max aktualisieren
              dailyData[dayKey].tempMin = Math.min(
                dailyData[dayKey].tempMin,
                tempData.tempMin
              );
              dailyData[dayKey].tempMax = Math.max(
                dailyData[dayKey].tempMax,
                tempData.tempMax
              );

              // Tagesmitte (12 Uhr) für das Icon bevorzugen
              if (tempData.time === 12 || !dailyData[dayKey].icon) {
                dailyData[dayKey].icon = tempData.icon;
                dailyData[dayKey].description = tempData.description;
              }

              // Stündliche Daten hinzufügen
              dailyData[dayKey].hourlyData.push(tempData);
            }
          });

          // Sortieren: "Heute", "Morgen", dann Wochentage
          const sortedDays = Object.keys(dailyData).sort((a, b) => {
            if (a === "Heute") return -1;
            if (b === "Heute") return 1;
            if (a === "Morgen") return -1;
            if (b === "Morgen") return 1;
            return 0;
          });

          // Für jeden Tag ein Objekt erstellen
          const sortedForecast = sortedDays
            .map((day) => ({
              day,
              ...dailyData[day],
            }))
            .slice(0, 7); // Nur eine Woche anzeigen

          setForecast(sortedForecast);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Fehler beim Abrufen der Wetterdaten: ", error);
          setIsLoading(false);
        });
    }
  }, [coords]);

  // Berechnen der Temperaturskala für die Balken
  const getTemperatureScale = (forecasts) => {
    if (!forecasts || forecasts.length === 0) return { min: 0, max: 30 };

    let globalMin = Infinity;
    let globalMax = -Infinity;

    forecasts.forEach((item) => {
      globalMin = Math.min(globalMin, item.tempMin);
      globalMax = Math.max(globalMax, item.tempMax);
    });

    // Gerundete Werte mit etwas Spielraum
    return { min: Math.floor(globalMin) - 2, max: Math.ceil(globalMax) + 2 };
  };

  const tempScale = getTemperatureScale(forecast);

  // Berechnet die prozentuale Breite des Temperaturbalkens
  const calculateBarWidth = (min, max) => {
    if (!tempScale) return 0;

    const totalRange = tempScale.max - tempScale.min;
    const currentRange = max - min;
    const position = (min - tempScale.min) / totalRange;
    const width = currentRange / totalRange;

    return {
      width: `${width * 100}%`,
      left: `${position * 100}%`,
    };
  };

  return (
    <section className="forecast-section fade-in">
      <h2 className="weather-forecast-text">7-Tage-Vorhersage</h2>

      {isLoading ? (
        <div className="loading-container">
          <l-ring size="60" color={isDarkMode ? "#ffffff" : "#007AFF"}></l-ring>
        </div>
      ) : (
        <ul className="forecast-container">
          {forecast.map((item, index) => {
            const barStyle = calculateBarWidth(item.tempMin, item.tempMax);
            const rowClass = item.isToday
              ? "forecast-day-row forecast-day-today"
              : "forecast-day-row";

            return (
              <li key={index} className={rowClass}>
                {item.isToday && <span className="today-label">Heute</span>}
                <div className="day-name">{item.day}</div>

                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                  alt={item.description}
                  className="weather-icon"
                />

                <div className="temperature-bar-container">
                  <div className="temperature-bar" style={barStyle}></div>
                </div>

                <div className="temperature-range">
                  <span className="min-temp">{Math.round(item.tempMin)}°</span>
                  <span className="max-temp">{Math.round(item.tempMax)}°</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default Forecast;

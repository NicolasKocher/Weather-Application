import React, { useState, useEffect } from "react";
import useGeolocation from "./Geolocation";
import "../styles/AirQuality.css";

const AirQuality = ({ isDarkMode }) => {
  const [airQuality, setAirQuality] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { coords } = useGeolocation();

  useEffect(() => {
    if (coords) {
      const apiKey = "ac38eaac6b1fe46460c2813b9d7b964d";
      const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.list && data.list.length > 0) {
            const aqiData = data.list[0];

            // AQI-Wert (1-5, wobei 1 sehr gut und 5 sehr schlecht ist)
            const aqi = aqiData.main.aqi;

            // Verschiedene Schadstoffwerte (in μg/m³)
            const pollutants = {
              co: aqiData.components.co, // Kohlenmonoxid
              no2: aqiData.components.no2, // Stickstoffdioxid
              o3: aqiData.components.o3, // Ozon
              pm10: aqiData.components.pm10, // Feinstaub (Partikel < 10 μm)
              pm2_5: aqiData.components.pm2_5, // Feinstaub (Partikel < 2.5 μm)
              so2: aqiData.components.so2, // Schwefeldioxid
            };

            // AQI-Text basierend auf dem Wert
            let qualityText = "";
            let qualityColor = "";

            switch (aqi) {
              case 1:
                qualityText = "Sehr gut";
                qualityColor = "var(--ios-green)";
                break;
              case 2:
                qualityText = "Gut";
                qualityColor = "var(--ios-green)";
                break;
              case 3:
                qualityText = "Mäßig";
                qualityColor = "var(--ios-orange)";
                break;
              case 4:
                qualityText = "Schlecht";
                qualityColor = "var(--ios-orange)";
                break;
              case 5:
                qualityText = "Sehr schlecht";
                qualityColor = "var(--ios-red)";
                break;
              default:
                qualityText = "Keine Daten";
                qualityColor = "var(--ios-gray)";
            }

            setAirQuality({
              aqi,
              qualityText,
              qualityColor,
              pollutants,
            });
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Fehler beim Abrufen der Luftqualitätsdaten:", error);
          setIsLoading(false);
        });
    }
  }, [coords]);

  if (isLoading || !airQuality) {
    return (
      <div className="air-quality-loading">
        <l-ring size="40" color={isDarkMode ? "#ffffff" : "#007AFF"}></l-ring>
      </div>
    );
  }

  return (
    <div className={`air-quality-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="air-quality-header">
        <h2 className="air-quality-title">Luftqualität</h2>
        <div
          className="air-quality-badge"
          style={{ backgroundColor: airQuality.qualityColor }}
        >
          {airQuality.qualityText}
        </div>
      </div>

      <div className="air-quality-details">
        <div className="air-quality-gauge">
          <div
            className="air-quality-gauge-fill"
            style={{
              width: `${airQuality.aqi * 20}%`,
              backgroundColor: airQuality.qualityColor,
            }}
          ></div>
        </div>

        <div className="air-quality-pollutants">
          <div className="pollutant-item">
            <div className="pollutant-label">PM2.5</div>
            <div className="pollutant-value">
              {airQuality.pollutants.pm2_5} µg/m³
            </div>
          </div>
          <div className="pollutant-item">
            <div className="pollutant-label">PM10</div>
            <div className="pollutant-value">
              {airQuality.pollutants.pm10} µg/m³
            </div>
          </div>
          <div className="pollutant-item">
            <div className="pollutant-label">O₃</div>
            <div className="pollutant-value">
              {airQuality.pollutants.o3} µg/m³
            </div>
          </div>
          <div className="pollutant-item">
            <div className="pollutant-label">NO₂</div>
            <div className="pollutant-value">
              {airQuality.pollutants.no2} µg/m³
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQuality;

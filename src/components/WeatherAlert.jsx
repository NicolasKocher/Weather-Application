import React, { useState, useEffect } from "react";
import useGeolocation from "./Geolocation";
import "../styles/WeatherAlert.css";

const WeatherAlert = ({ isDarkMode }) => {
  const [alerts, setAlerts] = useState([]);
  const [hasCheckedAlerts, setHasCheckedAlerts] = useState(false);
  const { coords } = useGeolocation();

  useEffect(() => {
    if (coords) {
      const apiKey = "ac38eaac6b1fe46460c2813b9d7b964d";
      const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}&exclude=minutely,hourly,daily&units=metric&lang=de`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.alerts && data.alerts.length > 0) {
            setAlerts(
              data.alerts.map((alert) => ({
                ...alert,
                title: alert.event,
                description: alert.description,
              }))
            );
          } else {
            // Wenn keine tatsächlichen Warnungen vorhanden sind, erstellen wir eine Dummy-Warnung
            // für Demonstrationszwecke
            const currentCondition = data.current.weather[0].main.toLowerCase();
            let dummyAlert = null;

            if (data.current.temp > 30) {
              dummyAlert = {
                title: "Hitzewarnung",
                description:
                  "Die Temperaturen erreichen heute über 30°C. Bitte genug Wasser trinken und direkte Sonneneinstrahlung meiden.",
                type: "heat",
              };
            } else if (data.current.temp < 0) {
              dummyAlert = {
                title: "Frost",
                description:
                  "Die Temperaturen fallen unter den Gefrierpunkt. Vorsicht auf Straßen und Gehwegen.",
                type: "frost",
              };
            } else if (
              currentCondition.includes("rain") ||
              currentCondition.includes("drizzle")
            ) {
              dummyAlert = {
                title: "Regenwarnung",
                description:
                  "Es wird heute regnen. Vergiss deinen Regenschirm nicht!",
                type: "rain",
              };
            } else if (currentCondition.includes("snow")) {
              dummyAlert = {
                title: "Schneewarnung",
                description:
                  "Schneefälle sind heute zu erwarten. Vorsicht auf Straßen und Gehwegen.",
                type: "snow",
              };
            } else if (currentCondition.includes("thunderstorm")) {
              dummyAlert = {
                title: "Gewitterwarnung",
                description:
                  "Gewitter sind in der Region möglich. Bitte Vorsichtsmaßnahmen treffen.",
                type: "thunderstorm",
              };
            } else if (data.current.wind_speed > 10) {
              dummyAlert = {
                title: "Windwarnung",
                description:
                  "Starke Winde mit Geschwindigkeiten über 36 km/h erwartet. Bitte lose Gegenstände sichern.",
                type: "wind",
              };
            }

            if (dummyAlert) {
              setAlerts([dummyAlert]);
            }
          }
          setHasCheckedAlerts(true);
        })
        .catch((error) => {
          console.error("Fehler beim Abrufen der Wetterwarnungen:", error);
          setHasCheckedAlerts(true);
        });
    }
  }, [coords]);

  const closeAlert = (index) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  // Wenn keine Warnungen vorhanden sind oder noch nicht überprüft wurde, nichts anzeigen
  if (!hasCheckedAlerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className="alerts-container">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`alert-card ${isDarkMode ? "dark-mode" : ""} ${
            alert.type || ""
          }`}
        >
          <div className="alert-icon">
            {alert.type === "heat" && <span>🌡️</span>}
            {alert.type === "frost" && <span>❄️</span>}
            {alert.type === "rain" && <span>🌧️</span>}
            {alert.type === "snow" && <span>❄️</span>}
            {alert.type === "thunderstorm" && <span>⚡</span>}
            {alert.type === "wind" && <span>💨</span>}
            {!alert.type && <span>⚠️</span>}
          </div>
          <div className="alert-content">
            <h3 className="alert-title">{alert.title || "Wetterwarnung"}</h3>
            <p className="alert-description">
              {alert.description || "Keine Beschreibung verfügbar"}
            </p>
          </div>
          <button className="alert-close-btn" onClick={() => closeAlert(index)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default WeatherAlert;

import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Forecast from "./components/Forecast";
import HourlyForecast from "./components/HourlyForecast";
import WeatherAlert from "./components/WeatherAlert";
import AirQuality from "./components/AirQuality";
import Footer from "./components/Footer";
import { DarkModeSwitch } from "react-toggle-dark-mode";

function App() {
  // Initialen Dark Mode basierend auf Systemeinstellungen erkennen
  const [isDarkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    } else {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
  });

  // Dark Mode beim Start anwenden
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    localStorage.setItem("darkMode", JSON.stringify(checked));
    if (checked) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="dark-mode-switch">
        <DarkModeSwitch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={28}
          moonColor="#f2f2f6"
          sunColor="#f39c12"
        />
      </div>
      <Header isDarkMode={isDarkMode} />
      <WeatherAlert isDarkMode={isDarkMode} />
      <HourlyForecast isDarkMode={isDarkMode} />
      <Forecast isDarkMode={isDarkMode} />
      <AirQuality isDarkMode={isDarkMode} />
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;

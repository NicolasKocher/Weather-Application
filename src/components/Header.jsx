import { useEffect, useState } from "react";
import "../styles/Header.css";
import useGeolocation from "./Geolocation";
import "ldrs/ring";

function Header({ isDarkMode }) {
  // Aktuelles Datum und Uhrzeit erhalten
  const currentDateAndTime = new Date();

  // Das aktuelle Datum anzeigen
  const daysOfWeek = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];
  const currentDayOfWeekIndex = currentDateAndTime.getDay();
  const currentDayOfWeek = daysOfWeek[currentDayOfWeekIndex];

  const [currentMinutes, setCurrentMinutes] = useState(
    currentDateAndTime.getMinutes()
  );
  const [currentHours, setCurrentHours] = useState(
    currentDateAndTime.getHours()
  );

  // Zeit aktualisieren
  const updateMinutes = () => {
    setCurrentMinutes(new Date().getMinutes());
  };
  const updateHours = () => {
    setCurrentHours(new Date().getHours());
  };

  useEffect(() => {
    const minutesIntervalId = setInterval(updateMinutes, 60000); // Alle Minute aktualisieren
    const hoursIntervalId = setInterval(updateHours, 60000);

    return () => {
      clearInterval(minutesIntervalId);
      clearInterval(hoursIntervalId);
    };
  }, []);

  // Geoposition
  const { coords } = useGeolocation();
  // State für Koordinaten
  const [latitude, setLatitude] = useState(() => {
    const savedLatitude = localStorage.getItem("latitude");
    return savedLatitude ? Number(savedLatitude) : null;
  });

  const [longitude, setLongitude] = useState(() => {
    const savedLongitude = localStorage.getItem("longitude");
    return savedLongitude ? Number(savedLongitude) : null;
  });

  // Standortname
  const [locationName, setLocationName] = useState("Mein Standort");
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  useEffect(() => {
    if (coords) {
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);

      localStorage.setItem("latitude", coords.latitude);
      localStorage.setItem("longitude", coords.longitude);

      // Reverse Geocoding um Standortnamen zu bekommen
      const reverseGeocodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${coords.latitude}&lon=${coords.longitude}&limit=1&appid=ac38eaac6b1fe46460c2813b9d7b964d`;

      fetch(reverseGeocodingUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            setLocationName(data[0].name);
          }
        })
        .catch((error) =>
          console.error("Fehler beim Abrufen des Standortnamens: ", error)
        );
    }
  }, [coords]);

  // Wetter API
  const apiKey = "ac38eaac6b1fe46460c2813b9d7b964d";

  // Die URL für die API-Anfrage zusammenstellen
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=de`;

  const [temperatureCelsius, setTemperatureCelsius] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState("");
  const [windSpeed, setWindSpeed] = useState(null);
  const [cloud, setCloud] = useState(null);
  const [weatherDescription, setWeatherDescription] = useState("");
  const [feelsLike, setFeelsLike] = useState(null);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setIsLoadingWeather(true);

      const fetchData = () => {
        fetch(apiUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // Temperature
            const temperatureCelsius = Math.round(data.main.temp);
            setTemperatureCelsius(temperatureCelsius);

            // Feels like
            const feelsLike = Math.round(data.main.feels_like);
            setFeelsLike(feelsLike);

            // Humidity
            const humidity = data.main.humidity;
            setHumidity(humidity);

            // Weather Icon
            const weatherIcon = data.weather[0].icon;
            setWeatherIcon(
              `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
            );

            // Weather Description
            const weatherDescription = data.weather[0].description;
            setWeatherDescription(
              weatherDescription.charAt(0).toUpperCase() +
                weatherDescription.slice(1)
            );

            // Wind speed
            const windSpeed = Math.round(data.wind.speed * 3.6);
            setWindSpeed(windSpeed);

            // Cloudiness in %
            const cloud = data.clouds.all;
            setCloud(cloud);

            setIsLoadingWeather(false);
          })
          .catch((error) => {
            console.error("Fehler beim Abrufen der API-Daten:", error);
            setIsLoadingWeather(false);
          });
      };

      fetchData();

      const intervalID = setInterval(fetchData, 300000); // Alle 5 Minuten aktualisieren

      return () => clearInterval(intervalID);
    }
  }, [latitude, longitude, apiUrl]);

  const headerClass = isDarkMode ? "header dark-mode" : "header";

  // Zeige Ladeanimation während Daten geladen werden
  if (isLoadingWeather && !temperatureCelsius) {
    return (
      <header className={headerClass}>
        <div className="time-container">
          <h2>Wetter</h2>
          <h4>
            {currentDayOfWeek},{" "}
            {currentHours < 10 ? `0${currentHours}` : currentHours}:
            {currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}
          </h4>
        </div>
        <div
          className="loading-container"
          style={{ height: "100%", marginTop: "80px" }}
        >
          <div className="loading-spinner">
            <l-ring size="60" color="#ffffff"></l-ring>
          </div>
          <div style={{ color: "white", marginTop: "20px", fontSize: "18px" }}>
            Wetterdaten werden geladen...
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`${headerClass} fade-in`}>
      <div className="location-container">
        <h1 className="location-name">{locationName}</h1>
      </div>

      <div className="temperature-container">
        {weatherIcon && (
          <img
            src={weatherIcon}
            alt="Aktuelles Wetterbild"
            className="weather-image"
          />
        )}
        <h1>{temperatureCelsius}°</h1>
        <p className="weather-condition">{weatherDescription}</p>
      </div>

      <div className="weather-data">
        <div className="weather-data-item">
          <span className="data-label">Gefühlt</span>
          <span className="data-value">{feelsLike}°</span>
        </div>
        <div className="weather-data-item">
          <span className="data-label">Wind</span>
          <span className="data-value">{windSpeed} km/h</span>
        </div>
        <div className="weather-data-item">
          <span className="data-label">Feuchte</span>
          <span className="data-value">{humidity}%</span>
        </div>
        <div className="weather-data-item">
          <span className="data-label">Wolken</span>
          <span className="data-value">{cloud}%</span>
        </div>
      </div>
    </header>
  );
}

export default Header;

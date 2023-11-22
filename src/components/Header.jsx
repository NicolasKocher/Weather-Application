import { useEffect, useState } from "react";
import "../styles/Header.css"
import weatherImage from "../assets/weather-example.png"
import useGeolocation from "./Geolocation";


function Header() {

    // Aktuelles Datum und Uhrzeit erhalten
  const currentDateAndTime = new Date();

  // Das aktuelle Datum anzeigen (z.B., "Mon Nov 21 2023")
  const daysOfWeek = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const currentDayOfWeekIndex = currentDateAndTime.getDay();
  const currentDayOfWeek = daysOfWeek[currentDayOfWeekIndex];

  const [currentMinutes, setCurrentMinutes] = useState(currentDateAndTime.getMinutes());
  const [currentHours, setCurrentHours] = useState(currentDateAndTime.getHours());

  const updateMinutes = () => {setCurrentMinutes(new Date().getMinutes());}
  const updateHours = () => {setCurrentHours(new Date().getHours())}

  useEffect(() => {
    const minutesIntervalId = setInterval(updateMinutes, 2000);
    const hoursIntervalId = setInterval(updateHours, 2000);

    return () => {
      clearInterval(minutesIntervalId);
      clearInterval(hoursIntervalId);
    }
  }, [])

  // TODO
  const { coords } = useGeolocation();
  // 49.419463, 11.132484
   // Initialize state from local storage or default to null
   const [latitude, setLatitude] = useState(() => {
    const savedLatitude = localStorage.getItem('latitude');
    return savedLatitude ? Number(savedLatitude) : null;
  });

  const [longitude, setLongitude] = useState(() => {
    const savedLongitude = localStorage.getItem('longitude');
    return savedLongitude ? Number(savedLongitude) : null;
  });


  useEffect(() => {
    if (coords) {
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);

      localStorage.setItem('latitude', coords.latitude);
      localStorage.setItem('longitude', coords.longitude);
    }
  }, [coords]);

  useEffect(() => {
    // Retrieve coordinates from local storage on component mount
    const savedLatitude = localStorage.getItem('latitude');
    const savedLongitude = localStorage.getItem('longitude');
    if (savedLatitude && savedLongitude) {
      setLatitude(Number(savedLatitude));
      setLongitude(Number(savedLongitude));
    }
  }, []);

  // Wetter API 
  const apiKey = 'ac38eaac6b1fe46460c2813b9d7b964d';

  // Die URL für die API-Anfrage zusammenstellen
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  const [temperatureCelsius, setTemperatureCelsius] = useState(null)
  const [humidity, setHumidity] = useState(null)
  const [weatherIcon, setWeatherIcon] = useState("")
  const [windSpeed, setWindSpeed] = useState(null)
  const [cloud, setCloud] = useState(null)

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      const fetchData = () => {
        fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // Temperature
          const temperatureKelvin = data.main.temp;
          const temperatureCelsius = Math.floor((temperatureKelvin - 273.15));
          setTemperatureCelsius(temperatureCelsius);
    
          // Humidity
          const humidity = data.main.humidity;
          setHumidity(humidity);
    
          // Weather Icon
          let weatherIcon = data.weather[0].icon;
          weatherIcon = weatherIcon.slice(0, -1) + 'd'; // Ersetzt das letzte Zeichen durch 'd'
          setWeatherIcon(`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
          console.log(weatherIcon);
    
          // Wind speed
          const windSpeed = Math.floor(data.wind.speed * 3.6);
          setWindSpeed(windSpeed);
    
          // Cloudiness in %
          const cloud = data.clouds.all;
          setCloud(cloud);
        })
        .catch((error) => {
          console.error('Fehler beim Abrufen der API-Daten:', error);
        });
      };
  
      fetchData();
  
      const intervalID = setInterval(fetchData, 300000);
      
      return () => clearInterval(intervalID)
    }

    }, [])
      

  return (
    <header className="header">
      <div className="temperature-container">
        {weatherIcon && <img src={weatherIcon} alt="Aktuelles Wetterbild" className="weather-image"/>}
        <h1>{temperatureCelsius}°C</h1>
      </div>
      <div className="weather-data">
        <p>Wolken: {cloud}%</p>
        <p>Luftfeuche: {humidity}%</p>
        <p>Wind: {windSpeed} km/h</p>
      </div>
      <div className="time-container">
        <h2>Wetter</h2>
        <h4>{currentDayOfWeek}</h4>
        <h4>{currentHours < 10 ? `0${currentHours}` : currentHours}:
            {currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}
        </h4>
      </div>
      
    </header>
  )
}

export default Header
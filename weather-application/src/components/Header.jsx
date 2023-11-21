import { useEffect, useState } from "react";
import "../styles/Header.css"
import weatherImage from "../assets/weather-example.png"


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


  // Wetter API 
  const apiKey = 'ac38eaac6b1fe46460c2813b9d7b964d';
  const latitude = 49.419393;
  const longitude = 11.132510;

  // Die URL für die API-Anfrage zusammenstellen
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  const [temperatureCelsius, setTemperatureCelsius] = useState(null)
  const [humidity, setHumidity] = useState(null)
  const [weatherIcon, setWeatherIcon] = useState(null)
  const [windSpeed, setWindSpeed] = useState(null)
  const [cloud, setCloud] = useState(null)

  useEffect(() => {
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
        const weatherIcon = data.weather.icon;
        setWeatherIcon(weatherIcon);
  
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

    }, [])
      

  return (
    <header className="header">
      <div className="temperature-container">
        <img src={weatherImage} alt="Weather-image" className="weather-image"/>
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
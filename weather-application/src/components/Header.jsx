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

  useEffect(() => {
    // Eine HTTP-GET-Anfrage an die API senden
    fetch(apiUrl)
    .then((response) => {
      // Überprüfen, ob die Antwort erfolgreich ist (HTTP-Statuscode 200)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Die Antwort als JSON-Promis parsen
      return response.json();
    })
    .then((data) => {
      // Hier haben Sie Zugriff auf die Daten von der API

      // Beispiel: Die Temperatur aus den API-Daten extrahieren
      const temperatureKelvin = data.main.temp;
      const temperatureCelsius = Math.floor((temperatureKelvin - 273.15));
      setTemperatureCelsius(temperatureCelsius)
    })
    .catch((error) => {
      console.error('Fehler beim Abrufen der API-Daten:', error);
    });
  }, [])
  

    
  
  return (
    <header className="header">
      <img src={weatherImage} alt="Weather-image" className="weather-image"/>
      <h1>{temperatureCelsius}°C</h1>
      <div>
        <p>Niederschlag: 10%</p>
        <p>Luftfeuche: 89%</p>
        <p>Wind: 6km/h</p>
      </div>
      <div>
        <h2>Wetter</h2>
        <h3>{currentDayOfWeek}</h3>
        <h3>{currentHours < 10 ? `0${currentHours}` : currentHours}:
          {currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}</h3>
      </div>
      
    </header>
  )
}

export default Header
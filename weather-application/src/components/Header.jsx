import { useState } from "react";
import "../styles/Header.css"
import weatherImage from "../assets/weather-example.png"


function Header() {
  
  
  return (
    <header className="header">
      <img src={weatherImage} alt="Weather-image" className="weather-image"/>
      <h1>9°C</h1>
    </header>
  )
}

export default Header
import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Forecast from './components/Forecast'
import { DarkModeSwitch } from 'react-toggle-dark-mode';

function App() {

  const [isDarkMode, setDarkMode] = useState(false);
  

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    if (checked) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }

  return (
    <div className={`body ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <DarkModeSwitch
        checked={isDarkMode}
        onChange={toggleDarkMode}
        size={40}
        className="dark-mode-switch"
      />
      <Header isDarkMode={isDarkMode} />
      <Forecast isDarkMode={isDarkMode} />
    </div>
  )
}
 

export default App

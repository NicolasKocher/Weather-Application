import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Forecast from './components/Forecast'

function App() {

  return (
    <div className='body-container'>
      <Header />
      <Forecast/>
    </div>
  )
}

export default App

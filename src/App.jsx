import React from 'react'
import './App.css'
import Header from './components/header/Header'
import CalendarGrid from './components/calendarGrid/CalendarGrid'
import { SelectedDateProvider } from './context/SelectedDateContext.jsx'
import EventPanel from './components/eventpanel/EventPanel.jsx'

const App = () => {
  return (
    <SelectedDateProvider>
      <Header/>
      <div className="calendar-app">
        <CalendarGrid />
        <EventPanel />
      </div>
    </SelectedDateProvider>
  )
}

export default App

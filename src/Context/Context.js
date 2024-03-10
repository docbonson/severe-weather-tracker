import React, { useContext, useState } from 'react'

const mainContext = React.createContext()

export function useMainContext() {
  return useContext(mainContext)
}
/**
 * Custom hook to access the main context.
 * @returns {Object} The context value containing event data and state setters.
 */

export function ContextProvider({ children }) {
  const [eventData, setEventData] = useState([]) // Store all data from NASA EONET
  const [selectedEvent, setSelectedEvent] = useState(null) // Store the selected event
  const [reRenderMakers, setRerenderMakers] = useState(null) // Trigger rerendering of markers

  // Value object containing the state variables and setter functions
  const value = {
    eventData,
    setEventData,
    selectedEvent,
    setSelectedEvent,
    reRenderMakers,
    setRerenderMakers,
  }

  // Provide the value to the context
  return <mainContext.Provider value={value}>{children}</mainContext.Provider>
}

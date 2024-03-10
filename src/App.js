import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Map from './components/Map'
import Loader from './components/Loader'
import Search from './components/Search'
import { useMainContext } from './Context/Context'

function App() {
  // Using the custom hook useMainContext to access state and functions from the context
  const { eventData, setEventData } = useMainContext()
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState('All')

  // useEffect hook to fetch event data from NASA EONET API when component mounts or eventData changes
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true)
      try {
        // Fetching event data from the NASA EONET API
        const res = await fetch('https://eonet.gsfc.nasa.gov/api/v2.1/events')
        const { events } = await res.json()
        setEventData(events)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching event data:', error)
        setLoading(false)
      }
    }

    fetchEventData()
  }, [setEventData])

  // Function to handle the change in selected option in the dropdown
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  return (
    <div>
      <Header />
      {!loading ? (
        <>
          <Map eventData={eventData} selectedOption={selectedOption} />{' '}
          <Search handleOptionChange={handleOptionChange} />{' '}
        </>
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default App

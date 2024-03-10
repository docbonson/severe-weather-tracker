import React, { useRef, useState, useEffect } from 'react'
import { useMainContext } from '../Context/Context'

// Search component responsible for filtering and displaying event data
const Search = () => {
  // Destructuring necessary context variables from the main context
  const { eventData, setSelectedEvent, setRerenderMakers } = useMainContext()
  // State variables for storing search results and selected filter option
  const [searchResults, setSearchResults] = useState([])
  const [storeSelection, setStoreSelection] = useState('All')
  // Reference to the search input field
  const searchBox = useRef()

  // Effect to filter event data whenever there's a change in eventData or storeSelection
  useEffect(() => {
    const filterEventData = () => {
      let filteredData = [...eventData]
      // Filter event data based on the selected storeSelection option
      if (storeSelection !== 'All') {
        filteredData = filteredData.filter(
          (event) => event.categories[0].title === storeSelection,
        )
      }
      return filteredData
    }
    // Update search results and markers to rerender based on filtered event data
    setSearchResults(filterEventData())
    setRerenderMakers(filterEventData())
  }, [eventData, storeSelection, setRerenderMakers])

  // Function to handle search input and filter event data accordingly
  const handleSearch = () => {
    const searchQuery = searchBox.current.value.toLowerCase()
    // Filter eventData based on the search query
    const filteredResults = eventData.filter((event) =>
      event.title.toLowerCase().includes(searchQuery),
    )
    // Update search results with the filtered eventData or display a message if no results found
    setSearchResults(
      filteredResults.length > 0
        ? filteredResults
        : [{ title: 'No results found', categories: [{ title: '' }] }],
    )
  }

  return (
    <>
      {/* Dropdown for selecting event type */}
      <section className="option-container">
        <p>Type:</p>
        <select
          onChange={(e) => setStoreSelection(e.target.value)}
          defaultValue="All"
        >
          <option value="All">All</option>
          <option value="Wildfires">Wildfires</option>
          <option value="Severe Storms">Severe Storms</option>
          <option value="Volcanoes">Volcanoes</option>
          <option value="Sea and Lake Ice">Sea and Lake Ice</option>
        </select>
      </section>
      {/* Search input field */}
      <section className="search-container">
        <p>Search:</p>
        <input
          ref={searchBox}
          type="text"
          placeholder="Search"
          onKeyUp={handleSearch}
        />
      </section>
      {/* Table to display search results */}
      <table className="search-table">
        <thead>
          <tr>
            <th style={{ width: '60%' }}>Title</th>
            <th>Type</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping through search results and displaying event information */}
          {searchResults.map((ev, index) => (
            <tr key={index}>
              <td>{ev.title}</td>
              <td>{ev.categories[0].title}</td>
              <td>
                {ev.categories[0].title && (
                  <a
                    href="#"
                    onClick={() => {
                      setSelectedEvent(ev)
                    }}
                  >
                    Click Here
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Search

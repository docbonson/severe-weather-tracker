import React from 'react'

/**
 * LocationInfoBox component displays information about a selected event location.
 * @param {Object} info - Information about the selected event location.
 * @param {string} info.id - The ID of the event location.
 * @param {string} info.title - The title of the event location.
 */
const LocationInfoBox = ({ info }) => {
  return (
    <div className="location-info">
      <h2>Event Location Info</h2>
      <ul>
        <li>
          ID: <strong>{info.id}</strong>
        </li>
        <li>
          TITLE: <strong>{info.title}</strong>
        </li>
      </ul>
    </div>
  )
}

export default LocationInfoBox

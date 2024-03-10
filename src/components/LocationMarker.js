import React from 'react'
import { Icon } from '@iconify/react'
import fireIcon from '@iconify/icons-emojione/fire'
import volcanoIcon from '@iconify/icons-emojione/volcano'
import iceIcon from '@iconify/icons-emojione/snowflake'

/**
 * LocationMarker component displays an icon at a specific location on the map.
 * @param {number} lat - Latitude of the location.
 * @param {number} lng - Longitude of the location.
 * @param {function} onClick - Function to execute when the marker is clicked.
 * @param {number} id - Identifier for determining the type of icon to display.
 */
const LocationMarker = ({ lat, lng, onClick, id }) => {
  let renderIcon = null

  // Determine which icon to render based on the provided id
  if (id === 8) {
    renderIcon = fireIcon
  } else if (id === 12) {
    renderIcon = volcanoIcon
  } else if (id === 15) {
    renderIcon = iceIcon
  }

  return (
    <div onClick={onClick}>
      <Icon icon={renderIcon} className="location-icon" />
    </div>
  )
}

export default LocationMarker

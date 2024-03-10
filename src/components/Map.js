import React, { useRef, useState, useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import useSupercluster from 'use-supercluster'
import LocationMarker from './LocationMarker'
import LocationInfoBox from './LocationInfoBox'
import { useMainContext } from '../Context/Context'

const Map = ({ center, eventData, selectedOption }) => {
  // Reference to the GoogleMapReact component
  const mapRef = useRef()
  // Accessing selectedEvent from the main context
  const { selectedEvent } = useMainContext()
  // State to manage the zoom level of the map
  const [zoom, setZoom] = useState(4)
  // State to manage the bounds of the map for clustering
  const [bounds, setBounds] = useState(null)
  // State to manage the location information box
  const [locationInfo, setLocationInfo] = useState(null)
  //API Key
  const GMAPS_API_KEY = process.env.REACT_APP_API_KEY

  // Index of event data by category ID
  const eventDataIndex = {
    8: 'WildFires',
    12: 'Volcanoes',
    15: 'Sea and Lake Ice',
  }

  // Array of category IDs
  const eventDataIndexNum = Object.keys(eventDataIndex).map(Number)

  // Filtering event data based on selected option
  const filteredEventData = eventData.filter(
    (event) =>
      eventDataIndex[event.categories[0].id] === selectedOption ||
      selectedOption === 'All',
  )

  // Converting event data to points for clustering
  const points = filteredEventData.map((event) => ({
    type: 'Feature',
    properties: {
      cluster: false,
      eventKey: event.id,
      eventTitle: event.title,
      eventType: event.categories[0].id,
    },
    geometry: {
      type: 'Point',
      coordinates: event.geometries[0].coordinates,
    },
  }))

  // Using Supercluster for clustering
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  })

  // Effect to zoom in and pan to selected event
  useEffect(() => {
    if (selectedEvent !== null) {
      const [longitude, latitude] = selectedEvent.geometries[0].coordinates
      mapRef.current.panTo({ lat: latitude, lng: longitude })
      mapRef.current.setZoom(10)
    }
  }, [selectedEvent])

  return (
    <div className="map-container">
      <GoogleMapReact
        bootstrapURLKeys={{ key: GMAPS_API_KEY }}
        center={center}
        zoom={zoom}
        yesIWantToUseGoogleMapApiInternals
        // Callback function to access the map instance
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map
        }}
        // Callback function to handle map changes
        onChange={({ zoom, bounds }) => {
          setZoom(zoom)
          setBounds([
            bounds.nw.lat,
            bounds.se.lng,
            bounds.se.lng,
            bounds.nw.lat,
          ])
        }}
        // Callback function to handle map clicks
        onClick={() => {
          setLocationInfo(null)
        }}
        // Callback function to handle map dragging
        onDrag={() => {
          setLocationInfo(null)
        }}
      >
        {/* Render clusters and location markers */}
        {clusters &&
          clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates
            const {
              cluster: isCluster,
              point_count: pointCount,
            } = cluster.properties
            if (isCluster) {
              let changeSize = Math.round((pointCount / points.length) * 100)
              let addSize = Math.min(changeSize * 10, 40)
              return (
                <section lat={latitude} lng={longitude} key={cluster.id}>
                  <div
                    className="cluster-marker"
                    style={{
                      width: addSize + changeSize + 'px',
                      height: addSize + changeSize + 'px',
                    }}
                    onClick={() => {
                      const expansionZoom = Math.min(
                        supercluster.getClusterExpansionZoom(cluster.id),
                        20,
                      )
                      mapRef.current.setZoom(expansionZoom)
                      mapRef.current.panTo({ lat: latitude, lng: longitude })
                    }}
                  >
                    {pointCount}
                  </div>
                </section>
              )
            }
            if (
              eventDataIndexNum.includes(cluster.properties.eventType) &&
              cluster.geometry.coordinates.length === 2
            ) {
              return (
                <LocationMarker
                  lat={latitude}
                  lng={longitude}
                  key={cluster.properties.eventKey}
                  onClick={() =>
                    setLocationInfo({
                      id: cluster.properties.eventType,
                      title: cluster.properties.eventTitle,
                    })
                  }
                  id={cluster.properties.eventType}
                />
              )
            }
          })}
      </GoogleMapReact>
      {locationInfo && <LocationInfoBox info={locationInfo} />}
    </div>
  )
}

Map.defaultProps = {
  center: {
    lat: 42.7127837,
    lng: -100.0059413,
  },
}

export default Map

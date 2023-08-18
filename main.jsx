import 'maplibre-gl/dist/maplibre-gl.css'

import maplibregl from 'maplibre-gl' // or "const maplibregl = require('maplibre-gl');"
import * as pmtiles from 'pmtiles'

import MapLibreGlDirections, {
  LoadingIndicatorControl
} from '@maplibre/maplibre-gl-directions'

import basemap from './map_styles/white.json'
import { sources } from '/src/map/sources.js'
import { layers } from '/src/map/layers.js'
import { navLayers } from '/src/map/nav-layers.js'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { configureStore } from '@reduxjs/toolkit'
import navigationReducer from '/src/reducers/navigationReducer.js'
import searchReducer from '/src/reducers/searchReducer.js'

import { Provider } from 'react-redux'
import MapProvider from '/src/providers/MapProvider.jsx'
import DirectionsProvider from '/src/providers/DirectionsProvider.jsx'

import OverlayWrapper from '/src/components/OverlayWrapper'
import MapPopupContent from '/src/components/MapPopupContent'

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    search: searchReducer
  }
})

let protocol = new pmtiles.Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)

const map = new maplibregl.Map({
  container: 'map',
  hash: true,
  // style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
  center: [-106, 39], // starting position [lng, lat]
  zoom: 6, // starting zoom
  style: {
    glyphs: '/fonts/{fontstack}/{range}.pbf',
    // sprite: 'http://localhost:5173/map_styles/sprite',
    version: 8,
    sources,
    layers
  }
})

// we'll need the `map` from above for navigation

ReactDOM.createRoot(
  document.querySelector('#application-overlay')
).render(
  <React.StrictMode>
    <Provider store={store}>
      <MapProvider map={map}>
        <OverlayWrapper />
      </MapProvider>
    </Provider>
  </React.StrictMode>
)

map.addControl(
  new maplibregl.NavigationControl({
    showZoom: true,
    showCompass: true
  })
)

map.on('load', () => {
  // Create an instance of the default class
  const directions = new MapLibreGlDirections(map, {
    api: 'https://nuc.tail54c6a.ts.net/route/v1',
    requestOptions: { steps: true, overview: 'full' },
    layers: navLayers,
    sensitiveWaypointLayers: ['maplibre-gl-directions-waypoint'],
    sensitiveSnappointLayers: ['maplibre-gl-directions-snappoint'],
    sensitiveRoutelineLayers: ['maplibre-gl-directions-routeline'],
    sensitiveAltRoutelineLayers: ['maplibre-gl-directions-alt-routeline']
  })

  let contentElem = null
  directions.on('fetchroutesend', e => {
    if (e.data.code === 'Ok') {
      const distance = `${Math.trunc(e.data.routes[0].distance / 1000)} km`

      contentElem.innerHTML = distance
    }
  })

  // Optionally add the standard loading-indicator control
  map.addControl(new LoadingIndicatorControl(directions))

  let existingPopup = null

  function handleClickEvent (e) {
    const features = map.queryRenderedFeatures(e.point)

    if (existingPopup) existingPopup.remove()

    let popup = new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML("<div class='customRoute'></div>")
      .addTo(map)

    contentElem = popup.getElement().querySelector('.customRoute')
    ReactDOM.createRoot(contentElem).render(
      <React.StrictMode>
        <MapProvider map={map}>
          <DirectionsProvider directions={directions}>
            <Provider store={store}>
              <MapPopupContent
                features={features}
                popupEvent={e}
                popup={popup}
              />
            </Provider>
          </DirectionsProvider>
        </MapProvider>
      </React.StrictMode>
    )

    existingPopup = popup
  }

  map.on('click', handleClickEvent)
})

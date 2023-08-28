import 'maplibre-gl/dist/maplibre-gl.css'
import './style.css'

import maplibregl from 'maplibre-gl' // or "const maplibregl = require('maplibre-gl');"
import * as pmtiles from 'pmtiles'

let protocol = new pmtiles.Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)

const map = new maplibregl.Map({
  container: 'map',
  hash: true,
  // style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
  center: [-106, 39], // starting position [lng, lat]
  zoom: 6, // starting zoom
  style: '/map_styles/bright.json'
})

map.addControl(
  new maplibregl.NavigationControl({
    showZoom: true,
    showCompass: true
  }),
  'bottom-right'
)

map.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  }),
  'bottom-right'
)

map.addControl(
  new maplibregl.ScaleControl({
    maxWidth: 200,
    unit: 'imperial'
}),
  'bottom-left'
)

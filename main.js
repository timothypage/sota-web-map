import 'maplibre-gl/dist/maplibre-gl.css'

import maplibregl from 'maplibre-gl' // or "const maplibregl = require('maplibre-gl');"
import * as pmtiles from 'pmtiles'

import basemap from './map_styles/white.json'

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
    sources: {
      osm: {
        ...basemap.sources.protomaps
      },
      summits: {
        type: 'geojson',
        data: '/tiles/summitslistw0c.geojson'
      },
      colorado_hillshade: {
        type: 'raster',
        url: 'pmtiles:///tiles/colorado_hillshade.pmtiles',
        bounds: [-110, 37, -100, 42],
        minzoom: 5,
        maxzoom: 16
      },
      colorado_contours: {
        type: 'vector',
        url: 'pmtiles:///tiles/colorado_contours.pmtiles'
      },
      states: {
        type: 'vector',
        url: 'pmtiles:///tiles/states.pmtiles',
        attribution: 'Natural Earth'
      },
      countries: {
        type: 'vector',
        url: 'pmtiles:///tiles/countries.pmtiles',
        attribution: 'Natural Earth'
      },
      BLM_CO_Surface_Management_Agency: {
        type: 'vector',
        url: 'pmtiles:///tiles/co_sma.pmtiles'
      }
    },
    layers: [
      {
        id: 'blm-management',
        source: 'BLM_CO_Surface_Management_Agency',
        'source-layer': 'co_sma',
        filter: ['==', 'adm_code', 'BLM'],
        type: 'fill',
        paint: {
          'fill-color': 'hsla(36, 55%, 54%, 0.66)'
        }
      },
      {
        id: 'usfs-management',
        source: 'BLM_CO_Surface_Management_Agency',
        'source-layer': 'co_sma',
        filter: ['==', 'adm_code', 'USFS'],
        type: 'fill',
        paint: {
          'fill-color': 'hsla(122, 55%, 33%, 0.66)'
        }
      },
      {
        id: 'nps-management',
        source: 'BLM_CO_Surface_Management_Agency',
        'source-layer': 'co_sma',
        filter: ['==', 'adm_code', 'NPS'],
        type: 'fill',
        paint: {
          'fill-color': 'hsla(121, 66%, 16%, 0.66)'
        }
      },
      {
        id: 'state-management',
        source: 'BLM_CO_Surface_Management_Agency',
        'source-layer': 'co_sma',
        filter: ['==', 'adm_code', 'STA'],
        type: 'fill',
        paint: {
          'fill-color': 'hsla(196, 100%, 35%, 0.65)'
        }
      },
      {
        id: 'dod-management',
        source: 'BLM_CO_Surface_Management_Agency',
        'source-layer': 'co_sma',
        filter: ['==', 'adm_code', 'DOD'],
        type: 'fill',
        paint: {
          'fill-color': 'hsla(0, 100%, 35%, 0.65)'
        }
      },

      ...basemap.layers.map(layer =>
        layer.source ? { ...layer, source: 'osm' } : layer
      ),

      {
        id: 'colorado_hillshade',
        type: 'raster',
        source: 'colorado_hillshade',
        minzoom: 10,
        maxzoom: 20,
        paint: {
          'raster-opacity': 0.2
        }
      },

      {
        id: 'contours',
        source: 'colorado_contours',
        'source-layer': 'colorado_contours',
        type: 'line',
        minzoom: 11,
        paint: {
          'line-color': 'hsla(26, 30%, 40%, 0.7)'
        }
      },
      {
        id: 'contour-text',
        type: 'symbol',
        source: 'colorado_contours',
        'source-layer': 'colorado_contours',
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 1
        },
        layout: {
          'symbol-placement': 'line',
          'text-size': 10,
          'text-field': ['concat', ['number-format', ['get', 'ELEV'], {}], 'm'],
          'text-font': ['NotoSans-Regular']
        }
      },

      {
        id: 'states',
        source: 'states',
        'source-layer': 'states',
        type: 'line',
        paint: {
          'line-color': 'brown'
        }
      },

      {
        id: 'countries',
        source: 'countries',
        'source-layer': 'countries',
        type: 'line',
        paint: {
          'line-color': 'black'
        }
      },

      {
        id: 'summits-circle',
        type: 'circle',
        source: 'summits',
        paint: {
          'circle-stroke-color': 'rgba(255, 255, 255, 1)',
          'circle-color': [
            'match',
            ['get', 'Points'],
            [1],
            'rgba(77, 122, 32, 1)',
            [2],
            'rgba(109, 165, 54, 1)',
            [4],
            'rgba(174, 167, 39, 1)',
            [6],
            'rgba(239, 168, 24, 1)',
            [8],
            'rgba(220, 93, 4, 1)',
            [10],
            'rgba(200, 16, 30, 1)',
            '#000'
          ],
          'circle-stroke-width': {
            stops: [
              [4, 0],
              [15, 1]
            ]
          },
          'circle-radius': {
            stops: [
              [0, 0.05],
              [10, 5],
              [22, 20]
            ]
          }
        }
      },
      {
        id: 'summits-names',
        type: 'symbol',
        source: 'summits',
        minzoom: 9,
        layout: {
          visibility: 'visible',
          'text-field': '{SummitName}\n{SummitCode}\n{AltFt} ft',
          'text-size': {
            stops: [
              [10, 10],
              [20, 40]
            ]
          },
          'text-font': ['Open Sans Regular'],
          'text-anchor': 'bottom',
          'text-offset': {
            stops: [
              [10, [0, -1]],
              [20, [0, -2]]
            ]
          },
          'icon-size': 1,
          'symbol-spacing': 250,
          'symbol-avoid-edges': false,
          'text-keep-upright': true,
          'text-transform': 'none',
          'text-optional': false,
          'text-allow-overlap': {
            stops: [
              [18, false],
              [19, true]
            ]
          },
          'text-ignore-placement': false,
          'text-justify': 'center',
          'text-rotate': 0
        },
        paint: {
          'text-color': 'rgba(51, 51, 51, 1)',
          'text-halo-color': 'rgba(255, 255, 255, 1)',
          'text-halo-width': 1,
          'text-halo-blur': 1
        }
      }
    ]
  }
})

map.addControl(
  new maplibregl.NavigationControl({
    showZoom: true,
    showCompass: true
  })
)

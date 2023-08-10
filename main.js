import 'maplibre-gl/dist/maplibre-gl.css'

import maplibregl from 'maplibre-gl' // or "const maplibregl = require('maplibre-gl');"
import * as pmtiles from 'pmtiles'

import basemap from './white.json'

console.log('basemap', basemap)

let protocol = new pmtiles.Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)

const PMTILES_URL = '/colorado_contours_50m_drop.pmtiles'
const p = new pmtiles.PMTiles(PMTILES_URL)

// this is so we share one instance across the JS code and the map renderer
protocol.add(p)

// protocol.add(new pmtiles.PMTiles("/summits_list_w0c.pmtiles"));

// we first fetch the header so we can get the center lon, lat of the map.
p.getHeader().then(h => {
  console.log(h)
})

const map = new maplibregl.Map({
  container: 'map',
  // style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
  center: [-106, 39], // starting position [lng, lat]
  zoom: 6, // starting zoom
  style: {
    glyphs: '/fonts/{fontstack}/{range}.pbf',
    version: 8,
    sources: {
      osm: {
        ...basemap.sources.protomaps
      },
      summits: {
        type: 'geojson',
        data: '/summitslistw0c.geojson'
      },
      colorado_hillshade: {
        type: 'raster',
        tiles: ['/hillshade_tiles/{z}/{x}/{y}.avif'],
        tileSize: 256,
        bounds: [-110, 37, -100, 42],
        minzoom: 5,
        maxzoom: 16
      },
      colorado_contours: {
        type: 'vector',
        url: 'pmtiles://' + PMTILES_URL,
        attribution: '© Tim Zwolak'
      },
      // "w0c_summits": {
      //   type: "geojson",
      //   data: "/summitslistw0c.json"
      // },
      states: {
        type: 'vector',
        url: 'pmtiles://states.pmtiles',
        attribution: 'Natural Earth'
      },
      countries: {
        type: 'vector',
        url: 'pmtiles://countries.pmtiles',
        attribution: 'Natural Earth'
      }
    },
    layers: [
      ...basemap.layers.map(layer =>
        layer.source ? { ...layer, source: 'osm' } : layer
      ),
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
            'rgba(77, 122, 32, 0.5)',
            [2],
            'rgba(109, 165, 54, 0.5)',
            [4],
            'rgba(174, 167, 39, 0.5)',
            [6],
            'rgba(239, 168, 24, 0.5)',
            [8],
            'rgba(220, 93, 4, 0.5)',
            [10],
            'rgba(200, 16, 30, 0.5)',
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
              [10, 8],
              [22, 100]
            ]
          }
        }
      },
      {
        id: 'summits-names',
        type: 'symbol',
        source: 'summits',
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
      },
      {
        id: 'colorado_hillshade',
        type: 'raster',
        source: 'colorado_hillshade',
        minzoom: 5,
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
          'line-color': 'hsla(26, 55%, 54%, 0.7)'
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

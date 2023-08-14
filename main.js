import 'maplibre-gl/dist/maplibre-gl.css'

import maplibregl from 'maplibre-gl' // or "const maplibregl = require('maplibre-gl');"
import * as pmtiles from 'pmtiles'

import MapLibreGlDirections, {
  LoadingIndicatorControl
} from '@maplibre/maplibre-gl-directions'

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
        data: '/tiles/summitslistw0c-active.geojson'
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
        url: 'pmtiles:///tiles/co_sma.pmtiles',
        minzoom: 8
      },
      denver_mountain_parks: {
        type: 'vector',
        url: 'pmtiles:///tiles/denver_mountain_parks.pmtiles'
      },
      cpw_public_access_properties: {
        type: 'vector',
        url: 'pmtiles:///tiles/cpw_public_access_properties.pmtiles'
      },
      cotrex_trailheads: {
        type: 'vector',
        url: 'pmtiles:///tiles/cotrex_trailheads.pmtiles'
      },
      padus_co_wilderness_areas: {
        type: 'vector',
        url: 'pmtiles:///tiles/padus_co_wilderness_areas.pmtiles',
        minzoom: 8
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
        id: 'padus-co-wilderness-areas',
        source: 'padus_co_wilderness_areas',
        'source-layer': 'padus_co_wilderness_areas',
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

      {
        id: 'denver-mountain-parks',
        source: 'denver_mountain_parks',
        'source-layer': 'mountain_parks',
        type: 'fill',
        paint: {
          'fill-color': 'hsla(230, 100%, 50%, 0.65)'
        }
      },

      {
        id: 'cpw-public-access-properties',
        source: 'cpw_public_access_properties',
        'source-layer': 'cpw_public_access_properties',
        type: 'fill',
        paint: {
          'fill-color': 'hsla(196, 100%, 35%, 0.65)'
        }
      },

      {
        id: 'colorado_hillshade',
        type: 'raster',
        source: 'colorado_hillshade',
        minzoom: 11,
        maxzoom: 20,
        paint: {
          'raster-opacity': 0.2
        }
      },

      ...basemap.layers.map(layer =>
        layer.source ? { ...layer, source: 'osm' } : layer
      ),

      {
        id: 'contours',
        source: 'colorado_contours',
        'source-layer': 'colorado_contours',
        type: 'line',
        minzoom: 13,
        paint: {
          'line-color': 'hsla(26, 30%, 40%, 0.7)'
        }
      },
      {
        id: 'contour-text',
        type: 'symbol',
        source: 'colorado_contours',
        'source-layer': 'colorado_contours',
        minzoom: 13,
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
        id: 'cotrex-trailheads',
        source: 'cotrex_trailheads',
        'source-layer': 'cotrex_trailheads',
        type: 'symbol',
        minzoom: 12,
        layout: {
          visibility: 'visible',
          'text-field': '{name}',
          'text-size': {
            stops: [
              [12, 12],
              [20, 24]
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
              [10, 12],
              [20, 40]
            ]
          },
          'text-font': ['Open Sans Bold'],
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
        id: 'summits_activations',
        type: 'symbol',
        source: 'summits',
        minzoom: 10,
        maxzoom: 24,
        layout: {
          'text-field': '{ActivationCount}',
          'text-font': ['Open Sans Bold'],
          'text-size': {
            stops: [
              [10, 8],
              [20, 22]
            ]
          }
        },
        paint: { 'text-color': 'rgba(255, 255, 255, 1)' }
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

map.on('load', () => {
  // Create an instance of the default class
  const directions = new MapLibreGlDirections(map, {
    api: 'https://nuc.tail54c6a.ts.net/route/v1',
    requestOptions: { steps: true, overview: 'full' },
    layers: [
      {
        id: 'maplibre-gl-directions-snapline',
        type: 'line',
        source: 'maplibre-gl-directions',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': 'red',
          'line-opacity': 0.65,
          'line-width': 2
        },
        filter: ['==', ['get', 'type'], 'SNAPLINE']
      },

      {
        id: 'maplibre-gl-directions-alt-routeline',
        type: 'line',
        source: 'maplibre-gl-directions',
        layout: {
          'line-cap': 'butt',
          'line-join': 'round'
        },
        paint: {
          'line-color': 'gray',
          'line-opacity': 0.65,
          'line-width': 2
        },
        filter: ['==', ['get', 'route'], 'ALT']
      },

      {
        id: 'maplibre-gl-directions-routeline',
        type: 'line',
        source: 'maplibre-gl-directions',
        layout: {
          'line-cap': 'butt',
          'line-join': 'round'
        },
        paint: {
          'line-color': 'blue',
          'line-opacity': 1,
          'line-width': 6
        },
        filter: ['==', ['get', 'route'], 'SELECTED']
      },

      {
        id: 'maplibre-gl-directions-hoverpoint',
        type: 'circle',
        source: 'maplibre-gl-directions',
        paint: {
          'circle-stroke-color': 'rgba(255, 255, 255, 1)',
          'circle-color': 'orangered'
        },
        filter: ['==', ['get', 'type'], 'HOVERPOINT']
      },

      {
        id: 'maplibre-gl-directions-snappoint',
        type: 'circle',
        source: 'maplibre-gl-directions',
        paint: {
          'circle-stroke-color': 'rgba(255, 255, 255, 1)',
          'circle-color': 'steelblue'
        },
        filter: ['==', ['get', 'type'], 'SNAPPOINT']
      },

      {
        id: 'maplibre-gl-directions-waypoint',
        type: 'circle',
        source: 'maplibre-gl-directions',
        paint: {
          'circle-stroke-color': 'rgba(255, 255, 255, 1)',
          'circle-color': 'green',
          'circle-stroke-width': {
            stops: [
              [4, 1],
              [15, 3]
            ]
          },
          'circle-radius': {
            stops: [
              [0, 0.05],
              [10, 10],
              [22, 25]
            ]
          }
        },
        filter: ['==', ['get', 'type'], 'WAYPOINT']
      }
    ],
    sensitiveWaypointLayers: ['maplibre-gl-directions-waypoint'],
    sensitiveSnappointLayers: ['maplibre-gl-directions-snappoint'],
    sensitiveRoutelineLayers: ['maplibre-gl-directions-routeline'],
    sensitiveAltRoutelineLayers: ['maplibre-gl-directions-alt-routeline']
  })

  // Enable interactivity (if needed)
  // directions.interactive = true;

  let contentElem = null;

  directions.on("fetchroutesend", e => {
    console.log('fetchroutesend event', e)

    if (e.data.code === "Ok") {
      const distance = `${Math.trunc(e.data.routes[0].distance / 1000)} km`;

      const disp = document.querySelector('#directions-overlay .directions-overlay-content')

      contentElem.innerHTML = distance;

      console.log(
        `${Math.trunc(e.data.routes[0].distance / 1000)} km`
      )
    }
  });

  // Optionally add the standard loading-indicator control
  map.addControl(new LoadingIndicatorControl(directions))

  // Set the waypoints programmatically
  // directions.setWaypoints([
  //   [-105.01632, 39.59428],
  //   [-105.52064, 39.68238]
  // ])

  const home = [-105.01632, 39.59428];


  map.on('mousedown', e => {

    // console.log('mousedown event', e);

    if (e.originalEvent.which !== 3) return;

    let div = document.createElement('div');
    div.innerHTML = "Navigate Here"
    div.addEventListener('click', clickEvent => {
      console.log('clicked!')

      directions.setWaypoints([
        home,
        [e.lngLat.lng, e.lngLat.lat]
      ])
    })

    let popup = new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML("<div class='customRoute'></div>")
      .addTo(map);

      contentElem = popup.getElement().querySelector('.customRoute');
      contentElem.appendChild(div);


  })
})

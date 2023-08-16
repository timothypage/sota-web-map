import basemap from '/map_styles/white.json'

export const layers = [
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
    id: 'usfs-national-forests-fill',
    source: 'usfs_national_forests',
    'source-layer': 'usfs_national_forests',
    type: 'fill',
    minzoom: 8,
    paint: {
      'fill-color': 'hsla(0, 0%, 0%, 0)'
    }
  },

  {
    id: 'usfs-national-forests-large',
    source: 'usfs_national_forests',
    'source-layer': 'usfs_national_forests',
    type: 'fill',
    minzoom: 1,
    maxzoom: 8,
    paint: {
      'fill-color': 'hsla(122, 55%, 33%, 0.7)'
    }
  },

  {
    id: 'usfs-national-forests',
    source: 'usfs_national_forests',
    'source-layer': 'usfs_national_forests',
    type: 'line',
    minzoom: 8,
    paint: {
      'line-color': 'hsla(122, 55%, 33%, 1)',
      'line-width': 2
    }
  },

  {
    id: 'usfs-national-forests-label',
    type: 'symbol',
    source: 'usfs_national_forests',
    'source-layer': 'usfs_national_forests',
    layout: {
      'symbol-placement': 'line',
      'text-font': ['NotoSans-Regular'],
      'text-field': ['get', 'FORESTNAME'],
      'text-size': {
        stops: [
          [14, 13],
          [14.5, 22],
          [15.1, 13]
        ]
      },
      'text-pitch-alignment': 'map',
      'text-rotation-alignment': 'map',
      'text-offset': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15.99,
        ['literal', [0, 0.69]],
        16,
        ['literal', [0, 0.75]]
      ],
      'text-max-angle': 25,
      visibility: 'visible',
      'text-padding': 0,
      'text-transform': 'uppercase',
      'text-letter-spacing': 0.1,
      'symbol-spacing': 300,
      'text-line-height': 0.7,
      'text-allow-overlap': false,
      'text-ignore-placement': false
    },
    paint: {
      'text-color': 'white',
      'text-halo-width': 1.8,
      'text-halo-color': 'hsla(122, 70%, 23%, 1)'
    }
  },

  {
    id: 'usfs-national-forests-casing',
    source: 'usfs_national_forests',
    'source-layer': 'usfs_national_forests',
    type: 'line',
    minzoom: 12,
    paint: {
      'line-color': 'hsla(122, 55%, 33%, 0.15)',
      'line-width': {
        stops: [
          [12, 18],
          [14, 25],
          [22, 50]
        ]
      },
      'line-offset': {
        stops: [
          [12, 9],
          [14, 12.5],
          [22, 25]
        ]
      }
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
    minzoom: 8,
    paint: {
      'fill-color': 'hsla(230, 100%, 50%, 0.65)'
    }
  },

  {
    id: 'cpw-public-access-properties',
    source: 'cpw_public_access_properties',
    'source-layer': 'cpw_public_access_properties',
    type: 'fill',
    minzoom: 8,
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

import basemap from '/map_styles/white.json'

export const sources = {
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
  usfs_national_forests: {
    type: 'vector',
    url: 'pmtiles:///tiles/usfs_national_forests.pmtiles'
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
}

import React from "react";
import ReactDOM from "react-dom/client";

import { configureStore } from "@reduxjs/toolkit";
import navigationReducer, {
  setRoute,
} from "/src/reducers/navigationReducer.js";
import searchReducer from "/src/reducers/searchReducer.js";

import { Provider } from "react-redux";

import MapProvider from "/src/providers/MapProvider.jsx";
import DirectionsProvider from "/src/providers/DirectionsProvider.jsx";

import MapPopupContent from "/src/components/MapPopupContent/MapPopupContent";

import maplibregl from "maplibre-gl";
import * as pmtiles from "pmtiles";

import MapLibreGlDirections from "@maplibre/maplibre-gl-directions";
import mlcontour from "maplibre-contour";

import bright from "./map_styles/bright.json"; // reload on change
import navLayers from "./map_styles/nav-layers.js";
import proclaimedLayers from "./map_styles/proclaimed-layers.js";
import padusLayers from "./map_styles/padus-layers";
import summitLayers from "./map_styles/summit-layers.js";
import contourLayers from "./map_styles/contour-layers";

import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";

import Authenticated from "/src/components/Authenticated";
import TopBar from "/src/components/TopBar";
import MyStuff from "/src/components/MyStuff";
import OfferPopupContent from "/src/components/OfferPopupContent"
import { AuthProvider } from "react-oidc-context";

import styles from "./main.module.css";
import RouteSummary from "/src/components/RouteSummary";

import * as turf from "@turf/turf";

const padusSrcFilename =
  document.querySelector("#padus")?.innerText ?? "padus.pmtiles";
const summitsSrcFilename =
  document.querySelector("#summits")?.innerText ?? "us_sota_summits.geojson";

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    search: searchReducer,
  },
});

const oidcConfig = {
  authority: "https://auth.tzwolak.com/realms/sota",
  client_id: "test-python",
  redirect_uri: import.meta.env.PROD
    ? "https://tzwolak.com/map.html"
    : "http://localhost:5173/",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  // ...
};

let protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const demSource = new mlcontour.DemSource({
  url:
    "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
  encoding: "terrarium",
  worker: true,
});

demSource.setupMaplibre(maplibregl);

const satelliteLayerSet = [
  {
    id: "background",
    type: "background",
    paint: {
      "background-color": "#f8f4f0",
    },
  },
  {
    id: "naip-raster-tiles",
    type: "raster",
    source: "naipRasterTiles",
    minzoom: 6,
    maxzoom: 22,
  },
  ...bright.layers.filter(
    (l) => !(l.type === "symbol" && l.id.startsWith("place-"))
  ),
  ...summitLayers,
  ...bright.layers.filter(
    (l) => l.type === "symbol" && l.id.startsWith("place-")
  ),
].filter(
  (layer) =>
    ![
      "building-top",
      "building",
      "landuse-school",
      "landuse-hospital",
      "landuse-cemetery",
      "water",
    ].includes(layer.id)
);

const vectorLayerSet = [
  {
    id: "background",
    type: "background",
    paint: {
      "background-color": "#f8f4f0",
    },
  },
  ...bright.layers,
  {
    id: "aisles",
    type: "fill",
    source: "aisles",
    minzoom: 16,
    paint: {
      "fill-color": "hsla(206, 100%, 50%, 1)"
    }
  },
  {
    id: "aisle-labels",
    type: "symbol",
    source: "aisles",
    minzoom: 17,
    layout: {
      visibility: "visible",
      "text-field": "{aisle_id}",
      "text-size": {
        stops: [
          [18, 10],
         [26, 52]
        ]
      },
      "text-font": ["Noto Sans Italic"],
      "text-anchor": "center",
      // "text-offset": {
      //   stops: [
      //     [10, [0, 0]],
      //     [20, [0, 0.8]],
      //   ],
      // },
    }
  }


  // ...proclaimedLayers,
  // ...padusLayers,
  // ...contourLayers,
  // ...bright.layers.filter(
  //   (l) => !(l.type === "symbol" && l.id.startsWith("place-"))
  // ),
  // ...summitLayers,
  // ...bright.layers.filter(
  //   (l) => l.type === "symbol" && l.id.startsWith("place-")
  // ),
];

const map = new maplibregl.Map({
  container: "map",
  hash: true,
  center: [-104.9899692, 39.6123901], // starting position [lng, lat]
  zoom: 8, // starting zoom
  style: {
    version: 8,
    name: "Bright",
    metadata: {},
    center: [-106, 39],
    zoom: 6,
    bearing: 0,
    pitch: 0,
    sources: {
      openmaptiles: {
        type: "vector",
        url: "pmtiles:///tiles/us.pmtiles",
        attribution:
          '<a href="http://openmaptiles.org/" target="_blank">&copy; OpenMapTiles</a> | <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      },
      // usfs_national_forests_and_grasslands: {
      //   type: "vector",
      //   url: "pmtiles:///tiles/usfs_national_forests_and_grasslands.pmtiles",
      // },
      // us_federal_proclaimed_areas: {
      //   type: "vector",
      //   url: "pmtiles:///tiles/us_federal_proclaimed_areas.pmtiles",
      //   attribution: '<a href="https://www.usgs.gov/">USGS</a>',
      // },
      // padus: {
      //   type: "vector",
      //   url: `pmtiles:///tiles/${padusSrcFilename}`,
      //   minzoom: 8,
      //   attribution: '<a href="https://www.usgs.gov/">USGS</a>',
      // },
      // summits: {
      //   type: "geojson",
      //   data: `/tiles/${summitsSrcFilename}`,
      // },
      aisles: {
        type: "geojson",
        data: "/tiles/62000131-store-layout.geojson"
      },
      // hillshadeSource: {
      //   type: "raster-dem",
      //   // share cached raster-dem tiles with the contour source
      //   tiles: [demSource.sharedDemProtocolUrl],
      //   tileSize: 512,
      //   maxzoom: 12,
      // },
      // terrainSource: {
      //   type: "raster-dem",
      //   tiles: [demSource.sharedDemProtocolUrl],
      //   tileSize: 512,
      //   maxzoom: 12,
      // },
      // contourSourceFeet: {
      //   type: "vector",
      //   tiles: [
      //     demSource.contourProtocolUrl({
      //       // meters to feet
      //       multiplier: 3.28084,
      //       overzoom: 1,
      //       thresholds: {
      //         // zoom: [minor, major]
      //         11: [200, 1000],
      //         12: [100, 500],
      //         13: [100, 500],
      //         14: [50, 200],
      //         15: [20, 100],
      //       },
      //       elevationKey: "ele",
      //       levelKey: "level",
      //       contourLayer: "contours",
      //     }),
      //   ],
      //   maxzoom: 15,
      // },

      // naipRasterTiles: {
      //   type: "raster",
      //   // tiles: ["https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}"],
      //   tiles: [
      //     "https://worker-long-block-5560.timothypage.workers.dev/tile/{z}/{y}/{x}",
      //   ],
      //   tileSize: 256,
      //   attribution:
      //     '<a href="https://naip-usdaonline.hub.arcgis.com/">USDA</a>',
      //   maxzoom: 18,
      // },
    },

    sprite: import.meta.env.PROD
      ? "https://tzwolak.com/map_styles/sprite"
      : "http://localhost:5173/map_styles/sprite",
    glyphs: "/fonts/{fontstack}/{range}.pbf",
    layers: vectorLayerSet,
  },
});

class LayerControl {
  currentLayerSet = "vector";
  vectorLayerIds = vectorLayerSet.map((l) => l.id);
  satelliteLayerIds = satelliteLayerSet.map((l) => l.id);

  constructor(options) {
    this.options = options;
  }

  onAdd(map) {
    this.map = map;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    this._layerButton = document.createElement("button");
    this._layerButton.type = "button";
    this._layerButton.innerText = "Sat.";
    this._layerButton.addEventListener("click", this.toggleLayers.bind(this));

    this._container.appendChild(this._layerButton);

    return this._container;
  }

  onRemove() {
    console.log("onRemove");
    document.removeElement(this._container);
    this._map = undefined;
  }

  toggleLayers() {
    console.log("LayerControl instance", this);
    if (this.currentLayerSet === "vector") {
      this.vectorLayerIds.forEach((l) => this.map.removeLayer(l));
      satelliteLayerSet.forEach((l) => this.map.addLayer(l));

      this._layerButton.innerText = "Vec.";
      this.currentLayerSet = "satellite";
    } else {
      this.satelliteLayerIds.forEach((l) => this.map.removeLayer(l));
      vectorLayerSet.forEach((l) => this.map.addLayer(l));

      this._layerButton.innerText = "Sat.";
      this.currentLayerSet = "vector";
    }
  }
}

map.addControl(
  new maplibregl.NavigationControl({
    showZoom: true,
    showCompass: true,
  }),
  "bottom-right"
);

map.addControl(
  new maplibregl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  }),
  "bottom-right"
);

map.addControl(
  new maplibregl.ScaleControl({
    maxWidth: 200,
    unit: "imperial",
  }),
  "bottom-left"
);

// map.addControl(
//   new maplibregl.TerrainControl({
//     source: "terrainSource",
//     exaggeration: 0.06,
//   }),
//   "bottom-right"
// );

// map.addControl(new LayerControl(), "bottom-right");

let directions;

map.on("load", () => {

  let offers = [
    {
      image: "https://images.ipn-assets.com/069UO00000813VWYAY_tmnVw4-v1.png",
      name: "Pillsbury™ Grands!™ Flaky Layers",
      details: "Offer valid on Pillsbury™ Grands!™ Flaky Layers for any variety, 5ct only. This purchase cannot be combined with coupons for the same product",
      share_url: "https://ibotta.com/rebates/1602544/pillsbury-grands-flaky-layers",
      aisle_id: "Aisle 1",
      cash_back: "0.50",
      bayNumber: 6
    },
    {
      image: "https://images.ipn-assets.com/54006_BC4eAG-v1.png",
      name: "Nestle® Toll House® Frozen Dairy Dessert Sandwiches",
      details: "Offer valid on Nestle® Toll House® Frozen Dairy Dessert Sandwiches for select varieties, select sizes. Offer includes the following varieties: • Nestle® Toll House® Vanilla Chocolate Chip Cookie Sandwiches, 7 ct • Nestle® Toll House® MINI Vanilla Chocolate Chip Cookie Sandwiches, 12 ct This purchase cannot be combined with coupons for the same product.",
      share_url: "https://ibotta.com/rebates/1581077/nestle-toll-house-frozen-dairy-dessert-sandwiches",
      aisle_id: "Aisle 4",
      cash_back: "0.50",
      bayNumber: 1
    }
  ]

  let markerElements = [];

  fetch('/tiles/62000131-store-layout.geojson')
  .then(async res => {
      const geojson = await res.json();

      const aisleSlotsByID = {}
      geojson.features.forEach(feature => {
        const bbox = turf.bbox(feature);
        const pointGrid = turf.pointGrid(bbox, 25, {units: "feet"});

        // [{lng:, lat}]
        const slots = pointGrid.features.map(p => {
          const lng = p.geometry.coordinates[0];
          const lat = p.geometry.coordinates[1];
          return {lng, lat, taken: false}
        })

        aisleSlotsByID[ feature.properties.aisle_id ] = slots;
      });

      for (const offer of offers) {
        const slots = aisleSlotsByID[offer.aisle_id];
        if (slots == null) {
          console.log(`couldn't find slot for aisle_id: ${offer.aisle_id}`);
          continue;
        }

        // const availableSlot = slots.find(s => s.taken === false);
        const availableSlot = findNearestAvailableSlot(slots, offer.bayNumber);

        if (availableSlot) {
          availableSlot.taken = true;

          const el = document.createElement('div');
          el.classList.add('marker');

          markerElements.push(el);

          let marker = new maplibregl.Marker({element: el})
            .setLngLat(availableSlot);

          ReactDOM.createRoot(el).render(
            <React.StrictMode>
              <Provider store={store}>
                <OfferPopupContent offer={offer} />
              </Provider>
            </React.StrictMode>
          )

          if (map.getZoom() > 14) {
            marker.addTo(map);
            marker.addClassName('added');
          }
        }

      }

      // visualize slots
      // for (const [key, slots] of Object.entries(aisleSlotsByID)) {
      //   console.log('key', key);
      //   console.log('slots', slots);

      //   for (const slot of slots) {
      //     new maplibregl.Marker()
      //       .setLngLat(slot)
      //       .addTo(map)
      //   }
      // }

      // for (const p of pointGrid.features) {
      //   const lng = p.geometry.coordinates[0];
      //   const lat = p.geometry.coordinates[1];
      //   new maplibregl.Marker()
      //   .setLngLat({lng, lat})
      //   .addTo(map)
      // }
    });

  function findNearestAvailableSlot(slots, bayNumber) {
    const assumedMaxTotalBayNumber = 15;
    

    let slotIndex = Math.floor((slots.length / assumedMaxTotalBayNumber) * ( bayNumber - 1));

    console.log('slotIndex', slotIndex);

    if (slots[slotIndex].taken === false) return slots[slotIndex];

    for (let i = 0; i < slots.length; i++) {
      const lesserSlot = slots[slotIndex - i];
      const greaterSlot = slots[slotIndex + i];

      if (lesserSlot?.taken === false) return lesserSlot;
      if (greaterSlot?.taken === false) return greaterSlot;
    }

    return null; 
  }


  // const el = document.createElement('div');
  // el.classList.add('marker')
  // // el.style.width = "1px";
  // // el.style.height = "1px";
  // const elements = [el];

  // let marker = new maplibregl.Marker({element: el})
  // .setLngLat({lng: -104.99007764549899, lat: 39.61251148838437})
  // // .addTo(map);

  // if (map.getZoom() > 14) {
  //   marker.addTo(map);
  //   marker.addClassName('added');
  // }

  // // ReactDOM.createRoot(contentElem).render(
  // ReactDOM.createRoot(el).render(
  //   <React.StrictMode>
  //     <Provider store={store}>
  //       <OfferPopupContent offer={offer} />
  //     </Provider>
  //   </React.StrictMode>
  // )

  map.on('zoom', () => {
    const zoom = map.getZoom();

    for (let elem of markerElements) {
      elem = elem.children[0];
      if (zoom < 14 && elem && elem.style) { elem.style.display = 'none' } else { elem.style.display = 'grid' }
      if (zoom <= 14) { elem.classList.remove('zoom-14'); } else { elem.classList.add('zoom-14'); }
      if (zoom <= 15) { elem.classList.remove('zoom-15'); } else { elem.classList.add('zoom-15'); }
      if (zoom <= 16) { elem.classList.remove('zoom-16'); } else { elem.classList.add('zoom-16'); }
      if (zoom <= 17) { elem.classList.remove('zoom-17'); } else { elem.classList.add('zoom-17'); }
      if (zoom <= 18) { elem.classList.remove('zoom-18'); } else { elem.classList.add('zoom-18'); }
      if (zoom <= 19) { elem.classList.remove('zoom-19'); } else { elem.classList.add('zoom-19'); }
      if (zoom <= 20) { elem.classList.remove('zoom-20'); } else { elem.classList.add('zoom-20'); }
      if (zoom <= 21) { elem.classList.remove('zoom-21'); } else { elem.classList.add('zoom-21'); }
      if (zoom <= 22) { elem.classList.remove('zoom-22'); } else { elem.classList.add('zoom-22'); }
    }
  })



  function handleClickEvent(e) {
  }

  map.on("click", handleClickEvent);
});

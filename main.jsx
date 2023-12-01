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
import { AuthProvider } from "react-oidc-context";

import styles from "./main.module.css";
import RouteSummary from "/src/components/RouteSummary";

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
  ...proclaimedLayers,
  ...padusLayers,
  ...contourLayers,
  ...bright.layers.filter(
    (l) => !(l.type === "symbol" && l.id.startsWith("place-"))
  ),
  ...summitLayers,
  ...bright.layers.filter(
    (l) => l.type === "symbol" && l.id.startsWith("place-")
  ),
];

const map = new maplibregl.Map({
  container: "map",
  hash: true,
  center: [-106, 39], // starting position [lng, lat]
  zoom: 6, // starting zoom
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
      usfs_national_forests_and_grasslands: {
        type: "vector",
        url: "pmtiles:///tiles/usfs_national_forests_and_grasslands.pmtiles",
      },
      us_federal_proclaimed_areas: {
        type: "vector",
        url: "pmtiles:///tiles/us_federal_proclaimed_areas.pmtiles",
        attribution: '<a href="https://www.usgs.gov/">USGS</a>',
      },
      padus: {
        type: "vector",
        url: `pmtiles:///tiles/${padusSrcFilename}`,
        minzoom: 8,
        attribution: '<a href="https://www.usgs.gov/">USGS</a>',
      },
      summits: {
        type: "geojson",
        data: `/tiles/${summitsSrcFilename}`,
      },
      hillshadeSource: {
        type: "raster-dem",
        // share cached raster-dem tiles with the contour source
        tiles: [demSource.sharedDemProtocolUrl],
        tileSize: 512,
        maxzoom: 12,
      },
      terrainSource: {
        type: "raster-dem",
        tiles: [demSource.sharedDemProtocolUrl],
        tileSize: 512,
        maxzoom: 12,
      },
      contourSourceFeet: {
        type: "vector",
        tiles: [
          demSource.contourProtocolUrl({
            // meters to feet
            multiplier: 3.28084,
            overzoom: 1,
            thresholds: {
              // zoom: [minor, major]
              11: [200, 1000],
              12: [100, 500],
              13: [100, 500],
              14: [50, 200],
              15: [20, 100],
            },
            elevationKey: "ele",
            levelKey: "level",
            contourLayer: "contours",
          }),
        ],
        maxzoom: 15,
      },

      naipRasterTiles: {
        type: "raster",
        // tiles: ["https://gis.apfo.usda.gov/arcgis/rest/services/NAIP/USDA_CONUS_PRIME/ImageServer/tile/{z}/{y}/{x}"],
        tiles: [
          "https://worker-long-block-5560.timothypage.workers.dev/tile/{z}/{y}/{x}",
        ],
        // tiles: ["https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=QnjKTufcyG1I2YSod1bHu"],
        tileSize: 256,
        attribution:
          '<a href="https://naip-usdaonline.hub.arcgis.com/">USDA</a>',
        maxzoom: 18,
      },
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

map.addControl(
  new maplibregl.TerrainControl({
    source: "terrainSource",
    exaggeration: 0.06,
  }),
  "bottom-right"
);

map.addControl(new LayerControl(), "bottom-right");

let directions;

map.on("load", () => {
  directions = new MapLibreGlDirections(map, {
    api: "https://desktop-k8ngvmk.tail54c6a.ts.net/route/v1", // routing all of US needs ~32 GB of ram -_-
    requestOptions: { steps: true, overview: "full" },
    layers: navLayers,
    sensitiveWaypointLayers: ["maplibre-gl-directions-waypoint"],
    sensitiveSnappointLayers: ["maplibre-gl-directions-snappoint"],
    sensitiveRoutelineLayers: ["maplibre-gl-directions-routeline"],
    sensitiveAltRoutelineLayers: ["maplibre-gl-directions-alt-routeline"],
  });

  ReactDOM.createRoot(document.querySelector("#overlay")).render(
    <AuthProvider {...oidcConfig}>
      <Provider store={store}>
        <MapProvider map={map}>
          <DirectionsProvider directions={directions}>
            <TopBar />
            <div className={styles.grid}>
              <div className={styles.navSummaryArea}>
                <RouteSummary className={styles.routeSummary} />
              </div>
              <div className={styles.myStuffArea}>
                <Authenticated>
                  <MyStuff className={styles.myStuff} />
                </Authenticated>
              </div>
            </div>
          </DirectionsProvider>
        </MapProvider>
      </Provider>
    </AuthProvider>
  );

  directions.on("fetchroutesend", (e) => {
    if (e.data.code === "Ok") {
      const route = e.data.routes[0];

      if (route == null) return;

      store.dispatch(
        setRoute({
          duration: route.duration,
          distance: route.distance,
        })
      );
    }
  });

  let existingPopup = null;
  let popup = new maplibregl.Popup();

  function handleClickEvent(e) {
    const features = map.queryRenderedFeatures(e.point);

    console.log("features", features);

    // if you click on a summit, open that summit in sotl.as
    const summit = features.find(f => f.layer.id === "summits-circle");
    if (summit) {
      const url = "https://sotl.as/summits/" + summit.properties.code;
      window.open(url, 'sotlas_summit_page').focus();
      return;
    }

    if (existingPopup) existingPopup.remove();

    popup = new maplibregl.Popup()
      .setLngLat(e.lngLat)
      // render enough height that the popup doesn't render outside the browser view
      // only happens because the popup is computing where to display before react is adding the content
      // Maplibregl.Popup#setDOMContent has the same problem
      .setHTML(
        `<div class="popup" style="height:${150 * features.length}px"></div>`
      )
      .addTo(map);

    let contentElem = popup.getElement().querySelector(".popup");
    ReactDOM.createRoot(contentElem).render(
      <React.StrictMode>
        <Provider store={store}>
          <MapProvider map={map}>
            <DirectionsProvider directions={directions}>
              <MapPopupContent
                features={features}
                popupEvent={e}
                popup={popup}
              />
            </DirectionsProvider>
          </MapProvider>
        </Provider>
      </React.StrictMode>
    );

    contentElem.style = "";
    existingPopup = popup;
  }

  map.on("mouseenter", "summits-circle", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "summits-circle", () => {
    map.getCanvas().style.cursor = "default";
  });

  map.on("click", handleClickEvent);
});

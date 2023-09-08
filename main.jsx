import React from "react";
import ReactDOM from "react-dom/client";

import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "/src/reducers/navigationReducer.js";
import searchReducer from "/src/reducers/searchReducer.js";

import { Provider } from "react-redux";
import { setRoute } from "/src/reducers/navigationReducer.js";

import MapProvider from "/src/providers/MapProvider.jsx";
import DirectionsProvider from "/src/providers/DirectionsProvider.jsx";

import OverlayLayout from "/src/components/OverlayLayout";
import MapPopupContent from "/src/components/MapPopupContent/MapPopupContent";

import maplibregl from "maplibre-gl";
import * as pmtiles from "pmtiles";

import MapLibreGlDirections from "@maplibre/maplibre-gl-directions";

import bright from "./map_styles/bright.json"; // reload on change
import navLayers from "./map_styles/nav-layers.js";

import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    search: searchReducer,
  },
});

let protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
  container: "map",
  hash: true,
  // style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
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
      },
      usfs_national_forests_and_grasslands: {
        type: "vector",
        url: "pmtiles:///tiles/usfs_national_forests_and_grasslands.pmtiles",
      },
      us_federal_proclaimed_areas: {
        type: "vector",
        url: "pmtiles:///tiles/us_federal_proclaimed_areas.pmtiles",
      },
    },
    sprite: "http://localhost:5173/map_styles/sprite",
    glyphs: "/fonts/{fontstack}/{range}.pbf",
    layers: [...bright.layers],
  },
});

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

map.on("load", () => {
  const directions = new MapLibreGlDirections(map, {
    api: "http://192.168.1.241:5000/route/v1", // routing all of US needs ~32 GB of ram -_-
    requestOptions: { steps: true, overview: "full" },
    layers: navLayers,
    sensitiveWaypointLayers: ["maplibre-gl-directions-waypoint"],
    sensitiveSnappointLayers: ["maplibre-gl-directions-snappoint"],
    sensitiveRoutelineLayers: ["maplibre-gl-directions-routeline"],
    sensitiveAltRoutelineLayers: ["maplibre-gl-directions-alt-routeline"],
  });

  ReactDOM.createRoot(document.querySelector("#overlay")).render(
    <React.StrictMode>
      <Provider store={store}>
        <MapProvider map={map}>
          <DirectionsProvider directions={directions}>
            <OverlayLayout />
          </DirectionsProvider>
        </MapProvider>
      </Provider>
    </React.StrictMode>
  );

  directions.on("fetchroutesend", (e) => {
    // console.log("fetchroutesend data", e.data);

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

  function handleClickEvent(e) {
    const features = map.queryRenderedFeatures(e.point);

    if (existingPopup) existingPopup.remove();

    let popup = new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML('<div class="popup"></div>')
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

    existingPopup = popup;
  }

  map.on("click", handleClickEvent);
});

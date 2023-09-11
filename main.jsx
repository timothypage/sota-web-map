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

import OverlayLayout from "/src/components/OverlayLayout";
import MapPopupContent from "/src/components/MapPopupContent/MapPopupContent";

import maplibregl from "maplibre-gl";
import * as pmtiles from "pmtiles";

import MapLibreGlDirections from "@maplibre/maplibre-gl-directions";

import bright from "./map_styles/bright.json"; // reload on change
import navLayers from "./map_styles/nav-layers.js";
import proclaimedLayers from "./map_styles/proclaimed-layers.js";
import padusLayers from "./map_styles/padus-layers";
import summitLayers from "./map_styles/summit-layers.js";

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
      padus: {
        type: "vector",
        url: "pmtiles:///tiles/padus.pmtiles",
        minzoom: 8,
      },
      summits: {
        type: "geojson",
        data: "/tiles/us_sota_summits.geojson",
      },
    },
    sprite: "http://localhost:5173/map_styles/sprite",
    glyphs: "/fonts/{fontstack}/{range}.pbf",
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#f8f4f0",
        },
      },
      ...proclaimedLayers,
      ...padusLayers,
      ...bright.layers.filter(
        (l) => !(l.type === "symbol" && l.id.startsWith("place-"))
      ),
      ...summitLayers,
      ...bright.layers.filter(
        (l) => l.type === "symbol" && l.id.startsWith("place-")
      ),
    ],
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
    api: "https://desktop-k8ngvmk.tail54c6a.ts.net/route/v1", // routing all of US needs ~32 GB of ram -_-
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
  let popup = new maplibregl.Popup();

  function handleClickEvent(e) {
    const features = map.queryRenderedFeatures(e.point);

    // console.log("features", features);

    if (existingPopup) existingPopup.remove();


    popup = new maplibregl.Popup()
      .setLngLat(e.lngLat)
      // render enough height that the popup doesn't render outside the browser view
      // only happens because the popup is computing where to display before react is adding the content
      // Maplibregl.Popup#setDOMContent has the same problem
      .setHTML(`<div class="popup" style="height:${150 * features.length}px"></div>`)
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
    </React.StrictMode>);

    contentElem.style = "";
    existingPopup = popup;
  }

  map.on("click", handleClickEvent);
});

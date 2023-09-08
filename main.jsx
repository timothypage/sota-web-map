import React from "react";
import ReactDOM from "react-dom/client";

import MapPopupContent from "/src/components/MapPopupContent/MapPopupContent";

import maplibregl from "maplibre-gl";
import * as pmtiles from "pmtiles";

import bright from "./map_styles/bright.json"; // reload on change

import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";

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
        <MapPopupContent features={features} />
      </React.StrictMode>
    );

    existingPopup = popup;
  }

  map.on("click", handleClickEvent);
});

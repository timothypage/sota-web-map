import { current } from "@reduxjs/toolkit";
import * as turf from "@turf/turf";

let start_marker = null;
let stop_marker = null;

export async function loadGPX(url, map, maplibregl) {
  const parser = new DOMParser();

  const gpx = await fetch(url, {
    headers: { "Content-Type": "text/plain" },
  }).then((response) => response.text());

  let parsed = parser.parseFromString(gpx, "text/xml");
  let trkpts = parsed.getElementsByTagName("trkpt");
  let pts = [];

  for (let trkpt of trkpts) {
    let pt = [
      parseFloat(trkpt.getAttribute("lon")),
      parseFloat(trkpt.getAttribute("lat")),
    ];

    pts.push(pt);
  }

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: pts,
        },
      },
    ],
  };

  if (map.getLayer("gpx-path")) {
    map.removeLayer("gpx-path");
    map.removeSource("gpx-route");
  }

  map.addSource("gpx-route", {
    type: "geojson",
    data: geojson,
  });

  map.addLayer({
    id: "gpx-path",
    type: "line",
    source: "gpx-route",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#00b",
      "line-width": 5,
    },
  });

  if (start_marker) start_marker.remove();
  if (stop_marker) stop_marker.remove();

  // Add the markers
  start_marker = new maplibregl.Marker({ color: "#00dd00" })
    .setLngLat(pts[0])
    .addTo(map);
  stop_marker = new maplibregl.Marker({ color: "#dd0000" })
    .setLngLat(pts.slice(-1)[0])
    .addTo(map);

  const trackBBox = turf.bbox(geojson);

  map.fitBounds(trackBBox, {
    padding: { top: 150, bottom: 150, left: 100, right: 100 },
  });

  return gpx;
}

export function clearGPX() {
  if (start_marker) start_marker.remove();
  if (stop_marker) stop_marker.remove();

  if (map.getLayer("gpx-path")) {
    map.removeLayer("gpx-path");
    map.removeSource("gpx-route");
  }
}

export function measureGPX(gpx) {
  const parser = new DOMParser();

  let parsed = parser.parseFromString(gpx, "text/xml");
  let trkpts = parsed.getElementsByTagName("trkpt");

  let duration_secs = null;
  try {
    const first_timestamp = trkpts[0].getElementsByTagName("time")[0]
      .textContent;
    const last_timestamp = trkpts[trkpts.length - 1].getElementsByTagName(
      "time"
    )[0].textContent;

    const difference = Date.parse(last_timestamp) - Date.parse(first_timestamp);
    if (Number.isNaN(difference))
      throw new Error(
        `Error parsing dates: ${first_timestamp} ${last_timestamp}`
      );
    duration_secs = Math.floor(difference / 1000);
  } catch (e) {
    console.log("Couldn't determine duration", e);
  }

  let previous_elevation = null;
  try {
    previous_elevation = Math.floor(
      parseInt(trkpts[0].getElementsByTagName("ele")[0].textContent, 10)
    );
  } catch {}

  let total_gained = 0;
  let total_lost = 0;
  let pts = [];
  let elevation_chart_data = [];

  for (let trkpt of trkpts) {
    let pt = [
      parseFloat(trkpt.getAttribute("lon")),
      parseFloat(trkpt.getAttribute("lat")),
    ];

    let current_elevation = null;
    try {
      current_elevation = Math.floor(
        parseInt(trkpt.getElementsByTagName("ele")[0].textContent, 10)
      );
    } catch {}

    if (previous_elevation == null || current_elevation == null) continue;
    if (Number.isNaN(previous_elevation) || Number.isNaN(current_elevation))
      continue;

    if (current_elevation > previous_elevation)
      total_gained += current_elevation - previous_elevation;

    if (current_elevation < previous_elevation)
      total_lost += previous_elevation - current_elevation;

    previous_elevation = current_elevation;

    pts.push(pt);
    if (pts.length < 2) continue;

    const current_distance = turf.length(
      turf.lineString(pts), { units: "feet" }
    );

    elevation_chart_data.push({elevation: Math.floor(current_elevation * 3.28084), distance: Math.floor(current_distance)})
  }

  let distance_ft = null;
  try {
    distance_ft = Math.floor(
      turf.length(turf.lineString(pts), { units: "feet" })
    );
  } catch (e) {
    console.log("Couldn't get total distance", e);
  }

  const gained_elevation_ft = Math.floor(total_gained * 3.28084);
  const lost_elevation_ft = Math.floor(total_lost * 3.28084);

  return {
    duration_secs,
    distance_ft,
    gained_elevation_ft,
    lost_elevation_ft,
    elevation_chart_data
  };
}

import bbox from "@turf/bbox";

let start_marker = null;
let stop_marker = null;

export async function loadGPX(url, map, maplibregl) {
  const parser = new DOMParser();

  const gpx = await fetch(url, {headers: {"Content-Type": "text/plain"}}).then((response) => response.text());

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
    map.removeLayer("gpx-path")
    map.removeSource("gpx-route")
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

  const trackBBox = bbox(geojson);

  console.log("trackBBox", trackBBox);

  map.fitBounds(trackBBox, {
    padding: { top: 150, bottom: 150, left: 100, right: 100 },
  });
}

export function clearGPX() {
  if (start_marker) start_marker.remove();
  if (stop_marker) stop_marker.remove();

  if (map.getLayer("gpx-path")) {
    map.removeLayer("gpx-path")
    map.removeSource("gpx-route")
  } 
}

import bbox from "@turf/bbox";

export async function loadGPX(url, map, maplibregl) {
  const parser = new DOMParser();

  const gpx = await fetch(url).then((response) => response.text());

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

  map.addSource("route", {
    type: "geojson",
    data: geojson,
  });

  map.addLayer({
    id: "path",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#00b",
      "line-width": 5,
    },
  });

  // Add the markers
  const start_marker = new maplibregl.Marker({ color: "#00dd00" })
    .setLngLat(pts[0])
    .addTo(map);
  const stop_marker = new maplibregl.Marker({ color: "#dd0000" })
    .setLngLat(pts.slice(-1)[0])
    .addTo(map);

  const trackBBox = bbox(geojson);

  console.log("trackBBox", trackBBox);

  map.fitBounds(trackBBox, {
    padding: { top: 150, bottom: 150, left: 100, right: 100 },
  });
}
export async function loadGPX (url, map, maplibregl) {
  const parser = new DOMParser();

  const gpx = await fetch(url).then(response => response.text())

  let parsed = parser.parseFromString(gpx, "text/xml");
  let trkpts = parsed.getElementsByTagName("trkpt");
  let pts = [];

  for (let trkpt of trkpts) {
    let pt = [
      parseFloat(trkpt.getAttribute("lon")),
      parseFloat(trkpt.getAttribute("lat"))
    ];

    pts.push(pt);
  }

  map.addSource("route", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: pts
          }
        }
      ]
    }
  });

  map.addLayer({
    id: "path",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": "#00b",
      "line-width": 5
    }
  });

  // Add the markers
  const start_marker = new maplibregl.Marker({ color: "#00dd00" })
    .setLngLat(pts[0])
    .addTo(map);
  const stop_marker = new maplibregl.Marker({ color: "#dd0000" })
    .setLngLat(pts.slice(-1)[0])
    .addTo(map); 
}



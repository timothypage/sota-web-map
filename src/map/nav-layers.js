const navLayers = [
  {
    id: "maplibre-gl-directions-snapline",
    type: "line",
    source: "maplibre-gl-directions",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "red",
      "line-opacity": 0.65,
      "line-width": 2,
    },
    filter: ["==", ["get", "type"], "SNAPLINE"],
  },

  {
    id: "maplibre-gl-directions-alt-routeline",
    type: "line",
    source: "maplibre-gl-directions",
    layout: {
      "line-cap": "butt",
      "line-join": "round",
    },
    paint: {
      "line-color": "gray",
      "line-opacity": 0.65,
      "line-width": 2,
    },
    filter: ["==", ["get", "route"], "ALT"],
  },

  {
    id: "maplibre-gl-directions-routeline",
    type: "line",
    source: "maplibre-gl-directions",
    layout: {
      "line-cap": "butt",
      "line-join": "round",
    },
    paint: {
      "line-color": "blue",
      "line-opacity": 1,
      "line-width": 6,
    },
    filter: ["==", ["get", "route"], "SELECTED"],
  },

  {
    id: "maplibre-gl-directions-hoverpoint",
    type: "circle",
    source: "maplibre-gl-directions",
    paint: {
      "circle-stroke-color": "rgba(255, 255, 255, 1)",
      "circle-color": "orangered",
    },
    filter: ["==", ["get", "type"], "HOVERPOINT"],
  },

  {
    id: "maplibre-gl-directions-snappoint",
    type: "circle",
    source: "maplibre-gl-directions",
    paint: {
      "circle-stroke-color": "rgba(255, 255, 255, 1)",
      "circle-color": "steelblue",
    },
    filter: ["==", ["get", "type"], "SNAPPOINT"],
  },

  {
    id: "maplibre-gl-directions-waypoint",
    type: "circle",
    source: "maplibre-gl-directions",
    paint: {
      "circle-stroke-color": "rgba(255, 255, 255, 1)",
      "circle-color": "green",
      "circle-stroke-width": {
        stops: [
          [4, 1],
          [15, 3],
        ],
      },
      "circle-radius": {
        stops: [
          [0, 0.05],
          [10, 10],
          [22, 25],
        ],
      },
    },
    filter: ["==", ["get", "type"], "WAYPOINT"],
  },
];

export default navLayers;

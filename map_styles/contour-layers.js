const contourLayers = [
  {
    id: "hills",
    type: "hillshade",
    minzoom: 9,
    source: "hillshadeSource",
    layout: { visibility: "visible" },
    paint: {
      "hillshade-exaggeration": {
        stops: [
          [9, 0.01],
          [14, 0.08],
        ],
      },
    },
  },
  {
    id: "contours-major",
    type: "line",
    source: "contourSourceFeet",
    "source-layer": "contours",
    filter: ["all", ["==", ["get", "level"], 1]],
    paint: {
      "line-opacity": {
        stops: [
          [11, 0.8],
          [14, 1],
        ],
      },
      "line-color": "rgb(166, 116, 66)",

      // "major" contours have level=1, "minor" have level=0
      "line-width": 1,
    },
  },
  {
    id: "contours-minor",
    type: "line",
    source: "contourSourceFeet",
    "source-layer": "contours",
    filter: ["all", ["==", ["get", "level"], 0]],
    paint: {
      "line-opacity": {
        stops: [
          [11, 0.8],
          [14, 1],
        ],
      },
      "line-color": "rgb(166, 116, 66)",
      "line-width": 0.3,
    },
  },
  {
    id: "contour-text",
    type: "symbol",
    source: "contourSourceFeet",
    "source-layer": "contours",
    filter: [">", ["get", "level"], 0],
    paint: {
      "text-color": "rgb(131, 66, 37)",
      "text-halo-color": "hsla(0, 0%, 100%, 0.5)",
      "text-halo-width": 1.5,
    },
    layout: {
      "symbol-placement": "line",
      "text-size": 10,
      "text-field": ["concat", ["number-format", ["get", "ele"], {}], "'"],
      "text-font": ["Noto Sans Bold"],
    },
  },
];

export default contourLayers;

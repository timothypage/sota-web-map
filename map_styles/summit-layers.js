const summitLayers = [
  {
    id: "summits-circle",
    type: "circle",
    source: "summits",
    paint: {
      "circle-stroke-color": "rgba(255, 255, 255, 1)",
      "circle-color": [
        "match",
        ["get", "pts"],
        [1],
        "rgba(77, 122, 32, 1)",
        [2],
        "rgba(109, 165, 54, 1)",
        [4],
        "rgba(174, 167, 39, 1)",
        [6],
        "rgba(239, 168, 24, 1)",
        [8],
        "rgba(220, 93, 4, 1)",
        [10],
        "rgba(200, 16, 30, 1)",
        "#000",
      ],
      "circle-stroke-width": {
        stops: [
          [4, 0],
          [15, 1],
        ],
      },
      "circle-radius": {
        stops: [
          [0, 0.05],
          [10, 5],
          [11, 8],
          [22, 20],
        ],
      },
    },
  },
  {
    id: "summits-names",
    type: "symbol",
    source: "summits",
    minzoom: 9,
    layout: {
      visibility: "visible",
      "text-field": "{name}\n{code}\n{alt} ft",
      "text-size": {
        stops: [
          [10, 12],
          [20, 40],
        ],
      },
      "text-font": ["Open Sans Bold"],
      "text-anchor": "bottom",
      "text-offset": {
        stops: [
          [10, [0, -1]],
          [20, [0, -2]],
        ],
      },
      "icon-size": 1,
      "symbol-spacing": 250,
      "symbol-avoid-edges": false,
      "text-keep-upright": true,
      "text-transform": "none",
      "text-optional": false,
      "text-allow-overlap": {
        stops: [
          [18, false],
          [19, true],
        ],
      },
      "text-ignore-placement": false,
      "text-justify": "center",
      "text-rotate": 0,
    },
    paint: {
      "text-color": "rgba(51, 51, 51, 1)",
      "text-halo-color": "rgba(255, 255, 255, 1)",
      "text-halo-width": 1,
      "text-halo-blur": 1,
    },
  },
  {
    id: "summits_activations",
    type: "symbol",
    source: "summits",
    minzoom: 10,
    maxzoom: 24,
    layout: {
      "text-field": "{count}",
      "text-font": ["Open Sans Bold"],
      "text-size": {
        stops: [
          [10, 8],
          [20, 22],
        ],
      },
    },
    paint: { "text-color": "rgba(255, 255, 255, 1)" },
  },
];

export default summitLayers;

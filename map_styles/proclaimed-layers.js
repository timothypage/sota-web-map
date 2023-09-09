const proclaimedLayers = [
  {
    id: "proclaimedareas-dod",
    type: "fill",
    source: "us_federal_proclaimed_areas",
    "source-layer": "us_federal_proclaimed_areas",
    filter: ["all", ["==", "dept", "DOD"]],
    layout: {
      visibility: "visible",
    },
    paint: {
      "fill-antialias": false,
      "fill-color": "rgba(196, 128, 128, 1)",
    },
  },
  {
    id: "proclaimedareas-usfs",
    type: "fill",
    source: "us_federal_proclaimed_areas",
    "source-layer": "us_federal_proclaimed_areas",
    filter: ["all", ["==", "dept", "USFS"]],
    layout: {
      visibility: "visible",
    },
    paint: {
      "fill-antialias": false,
      "fill-color": "rgba(204, 217, 204, 1)",
    },
  },
  {
    id: "proclaimedareas-nps",
    type: "fill",
    source: "us_federal_proclaimed_areas",
    "source-layer": "us_federal_proclaimed_areas",
    filter: ["all", ["==", "dept", "NPS"]],
    layout: {
      visibility: "visible",
    },
    paint: {
      "fill-antialias": false,
      "fill-color": "rgba(29, 93, 29, 0.66)",
    },
  },
  {
    id: "usfs_national_forests_and_grasslands",
    type: "fill",
    source: "usfs_national_forests_and_grasslands",
    "source-layer": "usfs_national_forests_and_grasslands",
    minzoom: 3,
    maxzoom: 8,
    layout: {
      visibility: "none",
    },
    paint: {
      "fill-color": "hsla(122, 55%, 33%, 0.08)",
    },
  },
  {
    id: "usfs-national-forests-fill",
    type: "fill",
    source: "usfs_national_forests_and_grasslands",
    "source-layer": "usfs_national_forests_and_grasslands",
    minzoom: 8,
    layout: {
      visibility: "none",
    },
    paint: {
      "fill-color": "hsla(122, 55%, 33%, 0.05)",
    },
  },
  {
    id: "usfs-national-forests",
    type: "line",
    source: "usfs_national_forests_and_grasslands",
    "source-layer": "usfs_national_forests_and_grasslands",
    minzoom: 8,
    layout: {
      visibility: "none",
    },
    paint: {
      "line-color": "hsla(122, 55%, 33%, 0.5)",
      "line-width": 2,
    },
  },
  {
    id: "usfs-national-forests-label",
    type: "symbol",
    source: "usfs_national_forests_and_grasslands",
    "source-layer": "usfs_national_forests_and_grasslands",
    layout: {
      "symbol-placement": "line",
      "text-font": ["Noto Sans Regular"],
      "text-field": ["get", "name"],
      "text-size": {
        stops: [
          [14, 13],
          [14.5, 22],
          [15.1, 13],
        ],
      },
      "text-pitch-alignment": "map",
      "text-rotation-alignment": "map",
      "text-offset": [
        "interpolate",
        ["linear"],
        ["zoom"],
        13.99,
        ["literal", [0, 0.69]],
        16,
        ["literal", [0, 0.75]],
      ],
      "text-max-angle": 25,
      visibility: "none",
      "text-padding": 0,
      "text-transform": "uppercase",
      "text-letter-spacing": 0.1,
      "symbol-spacing": 300,
      "text-line-height": 0.7,
      "text-allow-overlap": false,
      "text-ignore-placement": false,
    },
    paint: {
      "text-color": "white",
      "text-halo-width": 1.8,
      "text-halo-color": "hsla(122, 70%, 23%, 1)",
    },
  },
  {
    id: "usfs-national-forests-casing",
    type: "line",
    source: "usfs_national_forests_and_grasslands",
    "source-layer": "usfs_national_forests_and_grasslands",
    minzoom: 12,
    layout: {
      visibility: "none",
    },
    paint: {
      "line-color": "hsla(122, 55%, 33%, 0.15)",
      "line-width": {
        stops: [
          [12, 18],
          [14, 25],
          [22, 50],
        ],
      },
      "line-offset": {
        stops: [
          [12, 9],
          [14, 12.5],
          [22, 25],
        ],
      },
    },
  },
  {
    id: "padus-fill",
    type: "fill",
    source: "padus",
    "source-layer": "padus",
    minzoom: 9,
    paint: {
      "fill-color": [
        "match",
        ["get", "display_type"],
        ["blm"],
        "rgba(229, 182, 54, 1)",
        ["other_federal"],
        "rgba(229, 182, 54, 1)",
        ["county_parks_and_open_space"],
        "rgba(152, 125, 183, 1)",
        ["state_land_board"],
        "rgba(72, 125, 231, 1)",
        ["state_parks_or_conservation_area"],
        "rgba(71, 168, 200, 1)",
        ["other_state_or_regional"],
        "rgba(71, 168, 200, 1)",
        ["local_park"],
        "rgba(175, 104, 247, 1)",
        ["other_local"],
        "rgba(175, 104, 247, 1)",
        ["national_forest_or_grassland"],
        "rgba(108, 168, 55, 1)",
        ["wilderness_area"],
        "rgba(52, 91, 25, 1)",
        ["private_open_access"],
        "rgba(255, 158, 23, 1)",
        "#000",
      ],
      "fill-opacity": {
        stops: [
          [8, 0.001],
          [9, 0.005],
          [10, 0.4],
          [12, 1],
        ],
      },
    },
  },
];

export default proclaimedLayers;

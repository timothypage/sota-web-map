const padusLayers = [
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
        "hsla(44, 77%, 55%, 1)",
        ["other_federal"],
        "hsla(44, 77%, 55%, 1)",
        ["county_parks_and_open_space"],
        "hsla(268, 29%, 60%, 1)",
        ["state_land_board"],
        "hsla(220, 77%, 59%, 1)",
        ["state_parks_or_conservation_area"],
        "hsla(195, 54%, 53%, 1)",
        ["other_state_or_regional"],
        "hsla(195, 54%, 53%, 1)",
        ["local_park"],
        "hsla(270, 90%, 69%, 1)",
        ["other_local"],
        "hsla(270, 90%, 69%, 1)",
        ["national_forest_or_grassland"],
        "hsla(76, 35%, 70%, 1)",
        ["wilderness_area"],
        "hsla(87, 30%, 55%, 1)",
        ["private_open_access"],
        "hsla(35, 100%, 55%, 1)",
        "green",
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

export default padusLayers;

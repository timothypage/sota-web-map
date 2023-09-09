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

export default padusLayers;

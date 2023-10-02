const padusLayers = [
  {
    id: "padus-blm",
    type: "fill",
    source: "padus",
    "source-layer": "padus",
    minzoom: 8,
    filter: ["in", "display_type", "blm", "other_federal"],
    paint: {
      "fill-color": {
        stops: [
          [8, "hsla(44, 77%, 89%, 1)"],
          [14, "hsla(44, 77%, 55%, 1)"],
        ],
      },
    },
  },

  {
    id: "padus-county-open-space",
    type: "fill",
    source: "padus",
    "source-layer": "padus",
    minzoom: 8,
    filter: ["==", "display_type", "county_parks_and_open_space"],
    paint: {
      "fill-color": {
        stops: [
          [8, "hsla(268, 29%, 85%, 1)"],
          [14, "hsla(268, 29%, 60%, 1)"],
        ],
      },
    },
  },

  {
    id: "padus-slb",
    type: "fill",
    source: "padus",
    "source-layer": "padus",
    minzoom: 8,
    filter: ["==", "display_type", "state_land_board"],
    paint: {
      "fill-color": {
        stops: [
          [8, "hsla(220, 77%, 89%, 1)"],
          [14, "hsla(220, 77%, 59%, 1)"],
        ],
      },
    },
  },

  {
    id: "padus-state",
    type: "fill",
    source: "padus",
    "source-layer": "padus",
    minzoom: 8,
    filter: [
      "in",
      "display_type",
      "state_parks_or_conservation_area",
      "other_state_or_regional",
    ],
    paint: {
      "fill-color": {
        stops: [
          [8, "hsla(195, 54%, 83%, 1)"],
          [14, "hsla(195, 54%, 53%, 1)"],
        ],
      },
    },
  },

  {
    id: "padus-local",
    type: "fill",
    source: "padus",
    "source-layer": "padus",
    minzoom: 8,
    filter: ["in", "display_type", "local_park", "other_local"],
    paint: {
      "fill-color": {
        stops: [
          [8, "hsla(270, 90%, 99%, 1)"],
          [14, "hsla(270, 90%, 69%, 1)"],
        ],
      },
    },
  },

  {
    id: "padus-forest",
    type: "fill",
    source: "padus",
    "source-layer": "padus",
    minzoom: 8,
    filter: ["==", "display_type", "national_forest_or_grassland"],
    paint: {
      "fill-color": {
        stops: [
          [8, "hsla(76, 35%, 90%, 1)"],
          [14, "hsla(76, 35%, 70%, 1)"],
        ],
      },
    },
  },

  {
    id: "padus-wilderness-research",
    type: "fill",
    source: "padus",
    "source-layer": "padus",
    minzoom: 8,
    filter: [
      "in",
      "display_type",
      "wilderness_area",
      "research__or_other_restricted_area",
    ],
    paint: {
      "fill-color": {
        stops: [
          [8, "hsla(87, 30%, 85%, 1)"],
          [14, "hsla(87, 30%, 55%, 1)"],
        ],
      },
    },
  },

  {
    id: "padus-private-open",
    type: "fill",
    source: "padus",
    "source-layer": "padus",
    minzoom: 8,
    filter: ["==", "display_type", "private_open_access"],
    paint: {
      "fill-color": {
        stops: [
          [8, "hsla(35, 100%, 85%, 1)"],
          [14, "hsla(35, 100%, 55%, 1)"],
        ],
      },
    },
  },

  {
    id: "padus-restricted",
    type: "fill",
    source: "padus",
    "source-layer": "padus",
    minzoom: 8,
    filter: ["==", "display_type", "restricted_access"],
    paint: {
      "fill-color": {
        stops: [
          [8, "hsla(0, 0%, 85%, 1)"],
          [14, "hsla(0, 0%, 55%, 1)"],
        ],
      },
    },
  },

  {
    id: "padus-closed",
    type: "fill",
    source: "padus",
    "source-layer": "padus",
    minzoom: 8,
    filter: ["==", "display_type", "no_access"],
    paint: {
      "fill-color": {
        stops: [
          [8, "hsla(0, 0%, 65%, 1)"],
          [14, "hsla(0, 0%, 35%, 1)"],
        ],
      },
    },
  },
];

export default padusLayers;

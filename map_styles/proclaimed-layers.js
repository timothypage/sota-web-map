const proclaimedLayers = [
  {
    id: "proclaimedareas-fill",
    type: "fill",
    source: "us_federal_proclaimed_areas",
    "source-layer": "us_federal_proclaimed_areas",
    paint: {
      "fill-color": [
        "match",
        ["get", "dept"],
        ["DOD"],
        "rgba(196, 128, 128, 1)",
        ["USFS"],
        "rgba(204, 217, 204, 1)",
        ["NPS"],
        "rgba(29, 93, 29, 0.66)",
        "#000",
      ],
    },
  },
];

export default proclaimedLayers;

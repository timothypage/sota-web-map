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
        "hsla(0, 37%, 64%, 1)",
        ["USFS"],
        "hsla(120, 15%, 92%, 1)",
        ["NPS"],
        "hsla(115, 22%, 60%, 1)",
        "#000",
      ],
    },
  },
];

export default proclaimedLayers;

// @jest-environment jsdom
// for DOMParser

import { expect, test } from "vitest";
import { measureGPX } from "./load-gpx.js";

import { readFileSync } from "node:fs";

// const gpx = readFileSync("./test-gpx-berrian.gpx");
const gpx = readFileSync("./src/helpers/test-gpx-berrian.gpx").toString();

test("measureGPX returns distance, time, elev gained and lost", () => {
  expect(measureGPX(gpx)).toEqual({
    duration_secs: 3374,
    distance_ft: 8299,
    gained_elevation_ft: 1056,
    lost_elevation_ft: 180,
  });
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  getCityLocation,
  getEventCoordinates,
  projectFromIndiaMap,
  projectToIndiaMap,
} from "./india-locations.ts";

test("projects India map coordinates in both directions", () => {
  const source = { lat: 19.076, lng: 72.8777 };
  const projected = projectToIndiaMap(source.lat, source.lng);
  const roundTrip = projectFromIndiaMap(projected.x, projected.y);

  assert.ok(Math.abs(roundTrip.lat - source.lat) < 0.75);
  assert.ok(Math.abs(roundTrip.lng - source.lng) < 0.75);
});

test("finds a city regardless of input casing", () => {
  const city = getCityLocation("bengaluru");

  assert.ok(city);
  assert.equal(city?.city, "Bengaluru");
});

test("falls back to city coordinates when an event does not include lat/lng", () => {
  const coordinates = getEventCoordinates({
    city: "Jaipur",
    lat: undefined,
    lng: undefined,
  });

  assert.ok(coordinates);
  assert.equal(coordinates?.lat, 26.9124);
  assert.equal(coordinates?.lng, 75.7873);
});

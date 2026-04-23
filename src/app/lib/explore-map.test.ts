import assert from "node:assert/strict";
import test from "node:test";
import {
  buildExploreResults,
  createCitySelection,
  findNearestIndiaCity,
  formatDistanceLabel,
} from "./explore-map.ts";
import type { EventRecord, MapSelection } from "../types.ts";

const sampleEvents: EventRecord[] = [
  {
    id: "delhi",
    title: "Delhi Design Jam",
    categoryId: "workshops",
    categoryName: "Workshops",
    date: "Aug 12, 2026",
    time: "18:00 - 21:00",
    city: "New Delhi",
    venue: "Pragati Maidan",
    price: 799,
    image: "https://example.com/delhi.jpg",
    description: "A workshop for product and visual designers in the capital.",
    lat: 28.6177,
    lng: 77.2431,
  },
  {
    id: "mumbai",
    title: "Mumbai Music Night",
    categoryId: "concerts",
    categoryName: "Concerts",
    date: "Sep 01, 2026",
    time: "19:00 - 23:00",
    city: "Mumbai",
    venue: "NSCI Dome",
    price: 1499,
    image: "https://example.com/mumbai.jpg",
    description: "A live music night with multiple artists and late entry slots.",
    lat: 19.0186,
    lng: 72.8295,
  },
];

test("creates a city selection from mapped city data", () => {
  const selection = createCitySelection("Panaji");

  assert.deepEqual(selection, {
    label: "Panaji",
    lat: 15.4909,
    lng: 73.8278,
    source: "city",
    city: "Panaji",
  } satisfies MapSelection);
});

test("finds the nearest India city for a map point", () => {
  const nearestCity = findNearestIndiaCity({ lat: 28.61, lng: 77.2 });

  assert.ok(nearestCity);
  assert.equal(nearestCity?.city, "New Delhi");
  assert.ok((nearestCity?.distanceKm ?? 999) < 10);
});

test("sorts events by distance when a map selection is active", () => {
  const results = buildExploreResults(sampleEvents, {
    selectedCity: "all",
    selectedLocation: {
      label: "Around Delhi",
      lat: 28.61,
      lng: 77.2,
      source: "map",
      city: "New Delhi",
    },
  });

  assert.equal(results[0].event.id, "delhi");
  assert.ok((results[0].distanceKm ?? 999) < (results[1].distanceKm ?? 0));
});

test("filters by city when a city filter is selected", () => {
  const results = buildExploreResults(sampleEvents, {
    selectedCity: "Mumbai",
    selectedLocation: null,
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].event.city, "Mumbai");
});

test("formats distance labels for nearby and far results", () => {
  assert.equal(formatDistanceLabel(0.4), "Less than 1 km away");
  assert.equal(formatDistanceLabel(3.2), "3.2 km away");
  assert.equal(formatDistanceLabel(44.7), "45 km away");
  assert.equal(formatDistanceLabel(null), null);
});

import type { EventRecord, MapSelection } from "../types";
import {
  INDIA_CITY_LOCATIONS,
  calculateDistanceKm,
  getCityLocation,
  getEventCoordinates,
  type CoordinatePoint,
  type IndiaCityLocation,
} from "./india-locations.ts";

export interface ExploreResultItem {
  event: EventRecord;
  distanceKm: number | null;
}

interface BuildExploreResultsOptions {
  selectedCity: string;
  selectedLocation: MapSelection | null;
}

export function createCitySelection(city: string): MapSelection | null {
  const cityLocation = getCityLocation(city);

  if (!cityLocation) {
    return null;
  }

  return {
    label: cityLocation.city,
    lat: cityLocation.lat,
    lng: cityLocation.lng,
    source: "city",
    city: cityLocation.city,
  };
}

export function findNearestIndiaCity(
  point: CoordinatePoint,
): (IndiaCityLocation & { distanceKm: number }) | null {
  if (!Number.isFinite(point.lat) || !Number.isFinite(point.lng)) {
    return null;
  }

  let closestLocation: (IndiaCityLocation & { distanceKm: number }) | null = null;

  for (const location of INDIA_CITY_LOCATIONS) {
    const distanceKm = calculateDistanceKm(point, location);

    if (!closestLocation || distanceKm < closestLocation.distanceKm) {
      closestLocation = {
        ...location,
        distanceKm,
      };
    }
  }

  return closestLocation;
}

export function buildExploreResults(
  events: EventRecord[],
  { selectedCity, selectedLocation }: BuildExploreResultsOptions,
) {
  const normalizedCity = selectedCity.trim().toLowerCase();

  return events
    .map((event) => {
      const eventCoordinates = selectedLocation ? getEventCoordinates(event) : null;
      const distanceKm =
        selectedLocation && eventCoordinates
          ? calculateDistanceKm(selectedLocation, eventCoordinates)
          : null;

      return {
        event,
        distanceKm,
      } satisfies ExploreResultItem;
    })
    .filter(({ event }) => {
      if (!normalizedCity || normalizedCity === "all") {
        return true;
      }

      return event.city.trim().toLowerCase() === normalizedCity;
    })
    .sort((left, right) => {
      if (!selectedLocation) {
        return 0;
      }

      if (left.distanceKm === null && right.distanceKm === null) {
        return 0;
      }

      if (left.distanceKm === null) {
        return 1;
      }

      if (right.distanceKm === null) {
        return -1;
      }

      return left.distanceKm - right.distanceKm;
    });
}

export function formatDistanceLabel(distanceKm: number | null) {
  if (distanceKm === null) {
    return null;
  }

  if (distanceKm < 1) {
    return "Less than 1 km away";
  }

  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km away`;
  }

  return `${Math.round(distanceKm)} km away`;
}

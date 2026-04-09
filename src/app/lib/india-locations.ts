import type { EventRecord } from "../types";

export interface IndiaCityLocation {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export interface CoordinatePoint {
  lat: number;
  lng: number;
}

export const INDIA_CITY_LOCATIONS: IndiaCityLocation[] = [
  { city: "New Delhi", state: "Delhi", lat: 28.6139, lng: 77.209 },
  { city: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777 },
  { city: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { city: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867 },
  { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { city: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { city: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { city: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  {
    city: "Thiruvananthapuram",
    state: "Kerala",
    lat: 8.5241,
    lng: 76.9366,
  },
  { city: "Gandhinagar", state: "Gujarat", lat: 23.2156, lng: 72.6369 },
  { city: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { city: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245 },
  { city: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
  { city: "Dispur", state: "Assam", lat: 26.1445, lng: 91.7362 },
  { city: "Ranchi", state: "Jharkhand", lat: 23.3441, lng: 85.3096 },
  { city: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296 },
  { city: "Amaravati", state: "Andhra Pradesh", lat: 16.5417, lng: 80.515 },
  { city: "Panaji", state: "Goa", lat: 15.4909, lng: 73.8278 },
  { city: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lng: 77.1734 },
  {
    city: "Srinagar",
    state: "Jammu and Kashmir",
    lat: 34.0837,
    lng: 74.7973,
  },
  { city: "Jammu", state: "Jammu and Kashmir", lat: 32.7266, lng: 74.857 },
  { city: "Gangtok", state: "Sikkim", lat: 27.3389, lng: 88.6065 },
  { city: "Agartala", state: "Tripura", lat: 23.8315, lng: 91.2868 },
  { city: "Aizawl", state: "Mizoram", lat: 23.7271, lng: 92.7176 },
  { city: "Imphal", state: "Manipur", lat: 24.817, lng: 93.9368 },
  { city: "Shillong", state: "Meghalaya", lat: 25.5788, lng: 91.8933 },
  { city: "Kohima", state: "Nagaland", lat: 25.6751, lng: 94.1086 },
  { city: "Itanagar", state: "Arunachal Pradesh", lat: 27.0844, lng: 93.6053 },
];

export const INDIA_MAP_BOUNDS = {
  minLat: 6.5,
  maxLat: 37.5,
  minLng: 67.5,
  maxLng: 97.5,
};

const INDIA_MAP_UI_BOUNDS = {
  minXPercent: 13,
  maxXPercent: 87,
  minYPercent: 10.5,
  maxYPercent: 88.5,
};

const cityLookup = new Map(
  INDIA_CITY_LOCATIONS.map((location) => [location.city.toLowerCase(), location]),
);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getCityLocation(city?: string) {
  if (!city) {
    return null;
  }

  return cityLookup.get(city.toLowerCase()) ?? null;
}

export function projectToIndiaMap(lat: number, lng: number) {
  const xRatio =
    (lng - INDIA_MAP_BOUNDS.minLng) /
    (INDIA_MAP_BOUNDS.maxLng - INDIA_MAP_BOUNDS.minLng);
  const yRatio =
    (INDIA_MAP_BOUNDS.maxLat - lat) /
    (INDIA_MAP_BOUNDS.maxLat - INDIA_MAP_BOUNDS.minLat);

  return {
    x: clamp(
      INDIA_MAP_UI_BOUNDS.minXPercent +
        xRatio * (INDIA_MAP_UI_BOUNDS.maxXPercent - INDIA_MAP_UI_BOUNDS.minXPercent),
      INDIA_MAP_UI_BOUNDS.minXPercent,
      INDIA_MAP_UI_BOUNDS.maxXPercent,
    ),
    y: clamp(
      INDIA_MAP_UI_BOUNDS.minYPercent +
        yRatio * (INDIA_MAP_UI_BOUNDS.maxYPercent - INDIA_MAP_UI_BOUNDS.minYPercent),
      INDIA_MAP_UI_BOUNDS.minYPercent,
      INDIA_MAP_UI_BOUNDS.maxYPercent,
    ),
  };
}

export function projectFromIndiaMap(xPercent: number, yPercent: number): CoordinatePoint {
  const normalizedX =
    (clamp(xPercent, INDIA_MAP_UI_BOUNDS.minXPercent, INDIA_MAP_UI_BOUNDS.maxXPercent) -
      INDIA_MAP_UI_BOUNDS.minXPercent) /
    (INDIA_MAP_UI_BOUNDS.maxXPercent - INDIA_MAP_UI_BOUNDS.minXPercent);
  const normalizedY =
    (clamp(yPercent, INDIA_MAP_UI_BOUNDS.minYPercent, INDIA_MAP_UI_BOUNDS.maxYPercent) -
      INDIA_MAP_UI_BOUNDS.minYPercent) /
    (INDIA_MAP_UI_BOUNDS.maxYPercent - INDIA_MAP_UI_BOUNDS.minYPercent);

  const lat =
    INDIA_MAP_BOUNDS.maxLat -
    normalizedY *
      (INDIA_MAP_BOUNDS.maxLat - INDIA_MAP_BOUNDS.minLat);
  const lng =
    INDIA_MAP_BOUNDS.minLng +
    normalizedX *
      (INDIA_MAP_BOUNDS.maxLng - INDIA_MAP_BOUNDS.minLng);

  return { lat, lng };
}

export function getEventCoordinates(event: Pick<EventRecord, "city" | "lat" | "lng">) {
  if (typeof event.lat === "number" && typeof event.lng === "number") {
    return {
      lat: event.lat,
      lng: event.lng,
    };
  }

  const cityLocation = getCityLocation(event.city);

  if (!cityLocation) {
    return null;
  }

  return {
    lat: cityLocation.lat,
    lng: cityLocation.lng,
  };
}

export function calculateDistanceKm(from: CoordinatePoint, to: CoordinatePoint) {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const haversine =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const angularDistance =
    2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return earthRadiusKm * angularDistance;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

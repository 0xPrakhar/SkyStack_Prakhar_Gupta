import { useMemo, type MouseEvent } from "react";
import { motion } from "motion/react";
import { Compass, LocateFixed, MapPin, Target } from "lucide-react";
import type { EventRecord, MapSelection } from "../types";
import {
  INDIA_CITY_LOCATIONS,
  projectFromIndiaMap,
  projectToIndiaMap,
} from "../lib/india-locations";

interface IndiaEventMapProps {
  events: EventRecord[];
  selectedCategory: string;
  selectedCity: string;
  selectedLocation: MapSelection | null;
  onCitySelect: (city: string) => void;
  onMapSelect: (selection: MapSelection) => void;
  onUseCurrentLocation: () => void;
  onReset: () => void;
  isLocating: boolean;
}

export function IndiaEventMap({
  events,
  selectedCategory,
  selectedCity,
  selectedLocation,
  onCitySelect,
  onMapSelect,
  onUseCurrentLocation,
  onReset,
  isLocating,
}: IndiaEventMapProps) {
  const eventCountsByCity = useMemo(
    () =>
      events.reduce<Record<string, number>>((counts, event) => {
        if (selectedCategory !== "all" && event.categoryId !== selectedCategory) {
          return counts;
        }

        counts[event.city] = (counts[event.city] ?? 0) + 1;
        return counts;
      }, {}),
    [events, selectedCategory],
  );

  const mappedCities = useMemo(
    () =>
      INDIA_CITY_LOCATIONS.filter((location) => (eventCountsByCity[location.city] ?? 0) > 0),
    [eventCountsByCity],
  );
  const selectedProjection = useMemo(
    () =>
      selectedLocation
        ? projectToIndiaMap(selectedLocation.lat, selectedLocation.lng)
        : null,
    [selectedLocation],
  );
  const mapConnections = useMemo(
    () => buildMapConnections(mappedCities),
    [mappedCities],
  );

  function handleMapClick(event: MouseEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const xPercent = ((event.clientX - bounds.left) / bounds.width) * 100;
    const yPercent = ((event.clientY - bounds.top) / bounds.height) * 100;
    const coordinates = projectFromIndiaMap(xPercent, yPercent);

    onMapSelect({
      label: "Picked on India map",
      lat: coordinates.lat,
      lng: coordinates.lng,
      source: "map",
    });
  }

  return (
    <div className="w-full lg:w-[40%] bg-zinc-950 border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden flex-col flex">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_8%,rgba(138,151,255,0.24),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(77,104,255,0.18),transparent_30%),linear-gradient(180deg,rgba(12,8,38,0.94)_0%,rgba(12,8,36,0.98)_100%)]" />

      <div className="relative z-10 p-6 border-b border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-300">
              <Compass className="w-3.5 h-3.5" />
              India Map
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Pick a location</h2>
            <p className="mt-2 text-sm text-slate-400">
              Click a city or anywhere on the map to see what is closest.
            </p>
          </div>

          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white hover:text-black transition-colors disabled:opacity-60"
          >
            <LocateFixed className="w-4 h-4" />
            {isLocating ? "Locating..." : "Use my location"}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            Reset view
          </button>
          <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-300">
            {mappedCities.length} mapped cities
          </div>
          {selectedLocation && (
            <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200">
              {selectedLocation.label}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex-1 px-6 py-8">
        <div className="relative mx-auto aspect-square w-full max-w-[32rem] overflow-hidden rounded-[2rem] border border-indigo-200/10 bg-[#0f0a2f] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <img
            src="/india-map-reference.jpg"
            alt="India map network reference"
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,164,255,0.18),transparent_28%),linear-gradient(180deg,rgba(10,8,34,0.18)_0%,rgba(10,8,34,0.42)_100%)]" />

          <svg
            viewBox="0 0 100 100"
            className="relative z-10 h-full w-full cursor-crosshair"
            onClick={handleMapClick}
            role="presentation"
          >
            <defs>
              <filter id="node-glow" x="-200%" y="-200%" width="400%" height="400%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.1" floodColor="#d9e2ff" />
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#8ea3ff" />
              </filter>
              <filter id="selection-glow" x="-200%" y="-200%" width="400%" height="400%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#b7ffde" />
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#4ade80" />
              </filter>
            </defs>

            {mapConnections.map((connection) => {
              const fromProjection = projectToIndiaMap(connection.from.lat, connection.from.lng);
              const toProjection = projectToIndiaMap(connection.to.lat, connection.to.lng);
              const isHighlighted =
                selectedCity === connection.from.city ||
                selectedCity === connection.to.city ||
                selectedLocation?.city === connection.from.city ||
                selectedLocation?.city === connection.to.city;

              return (
                <line
                  key={`${connection.from.city}-${connection.to.city}`}
                  x1={fromProjection.x}
                  y1={fromProjection.y}
                  x2={toProjection.x}
                  y2={toProjection.y}
                  stroke={isHighlighted ? "rgba(216,255,236,0.68)" : "rgba(152,173,255,0.36)"}
                  strokeWidth={isHighlighted ? 0.46 : 0.24}
                  strokeLinecap="round"
                />
              );
            })}

            {mappedCities.map((location) => {
              const projection = projectToIndiaMap(location.lat, location.lng);
              const isSelected =
                selectedCity === location.city || selectedLocation?.city === location.city;
              const eventCount = eventCountsByCity[location.city] ?? 0;

              return (
                <g
                  key={location.city}
                  transform={`translate(${projection.x}, ${projection.y})`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onCitySelect(location.city);
                  }}
                  className="cursor-pointer"
                >
                  <circle
                    r={isSelected ? 5.3 : 4.3}
                    fill={isSelected ? "rgba(183,255,222,0.24)" : "rgba(217,226,255,0.12)"}
                    filter={isSelected ? "url(#selection-glow)" : "url(#node-glow)"}
                  />
                  <circle
                    r={isSelected ? 2.4 : 1.9}
                    fill={isSelected ? "#dcfce7" : "#eef2ff"}
                    stroke={isSelected ? "#6ee7b7" : "rgba(191,219,254,0.72)"}
                    strokeWidth="0.55"
                  />
                  <circle
                    r={Math.min(7.8, 3.2 + eventCount * 0.62)}
                    fill="none"
                    stroke={isSelected ? "rgba(167,243,208,0.72)" : "rgba(191,219,254,0.26)"}
                    strokeWidth="0.36"
                  />
                </g>
              );
            })}
          </svg>

          {mappedCities.length === 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
              <div className="max-w-sm rounded-[1.5rem] border border-dashed border-white/15 bg-[#120d37]/90 px-5 py-6">
                <p className="text-sm font-semibold text-white">No map results yet</p>
                <p className="mt-2 text-sm text-slate-400">
                  Adjust the search or category filters to bring cities back onto the map.
                </p>
              </div>
            </div>
          )}

          {mappedCities.map((location) => {
            const projection = projectToIndiaMap(location.lat, location.lng);
            const isSelected =
              selectedCity === location.city || selectedLocation?.city === location.city;

            return (
              <button
                key={`${location.city}-label`}
                type="button"
                onClick={() => onCitySelect(location.city)}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-all ${
                  isSelected
                    ? "z-20"
                    : "z-10"
                }`}
                style={{
                  left: `${projection.x}%`,
                  top: `${projection.y}%`,
                }}
                aria-label={location.city}
              >
                <span
                  className={`pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    isSelected
                      ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-100 opacity-100"
                      : "border-indigo-200/15 bg-[#130d38]/90 text-indigo-100 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {location.city}
                </span>
              </button>
            );
          })}

          {selectedProjection && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${selectedProjection.x}%`,
                top: `${selectedProjection.y}%`,
              }}
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full border border-emerald-300/60 animate-ping" />
                <div className="absolute -inset-2 rounded-full border border-emerald-200/40" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-300 text-black shadow-[0_0_30px_rgba(74,222,128,0.65)]">
                  {selectedLocation?.source === "geolocation" ? (
                    <LocateFixed className="w-5 h-5" />
                  ) : selectedLocation?.source === "city" ? (
                    <MapPin className="w-5 h-5" />
                  ) : (
                    <Target className="w-5 h-5" />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-indigo-200/10 bg-[#0f0a2f]/80 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Current Focus
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {selectedLocation?.label ?? "All India"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] px-3 py-2 text-right">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                City filter
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {selectedCity === "All" ? "Nationwide" : selectedCity}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Click the map or a city label to update the results on the right.
          </p>
        </div>
      </div>
    </div>
  );
}

function buildMapConnections(
  locations: Array<{ city: string; lat: number; lng: number }>,
) {
  const connectionKeys = new Set<string>();
  const connections: Array<{
    from: { city: string; lat: number; lng: number };
    to: { city: string; lat: number; lng: number };
  }> = [];

  for (const location of locations) {
    const nearestNeighbors = locations
      .filter((candidate) => candidate.city !== location.city)
      .sort(
        (left, right) =>
          getApproxDistance(location, left) - getApproxDistance(location, right),
      )
      .slice(0, 3);

    for (const neighbor of nearestNeighbors) {
      const key = [location.city, neighbor.city].sort().join(":");

      if (connectionKeys.has(key)) {
        continue;
      }

      connectionKeys.add(key);
      connections.push({
        from: location,
        to: neighbor,
      });
    }
  }

  return connections;
}

function getApproxDistance(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  return (from.lat - to.lat) ** 2 + (from.lng - to.lng) ** 2;
}

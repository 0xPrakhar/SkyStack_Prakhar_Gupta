import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  Calendar,
  Crosshair,
  LocateFixed,
  MapPin,
  Search,
} from "lucide-react";
import { CATEGORIES, CITIES } from "../data";
import { EventCard } from "../components/EventCard";
import { IndiaEventMap } from "../components/IndiaEventMap";
import { useEvents } from "../context/EventsContext";
import { getApiError } from "../lib/api";
import {
  buildExploreResults,
  createCitySelection,
  findNearestIndiaCity,
  formatDistanceLabel,
} from "../lib/explore-map";
import type { EventRecord, MapSelection } from "../types";

const ALL_CITIES = "all";
const ALL_CATEGORIES = "all";

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<string>(ALL_CITIES);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableEvents, setAvailableEvents] = useState<EventRecord[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  const [searchError, setSearchError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<MapSelection | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapMessage, setMapMessage] = useState("");
  const [hasHydratedFromUrl, setHasHydratedFromUrl] = useState(false);
  const { fetchEvents } = useEvents();

  useEffect(() => {
    const nextCity = searchParams.get("city") ?? ALL_CITIES;
    const nextCategory = searchParams.get("categoryId") ?? ALL_CATEGORIES;
    const nextSearch = searchParams.get("search") ?? "";

    setSelectedCity(nextCity);
    setSelectedCategory(nextCategory);
    setSearchTerm(nextSearch);
    setSelectedLocation((currentSelection) => {
      if (nextCity !== ALL_CITIES) {
        return createCitySelection(nextCity);
      }

      if (currentSelection?.source === "city") {
        return null;
      }

      return currentSelection;
    });
    setHasHydratedFromUrl(true);
  }, [searchParams]);

  useEffect(() => {
    if (!hasHydratedFromUrl) {
      return;
    }

    const nextSearchParams = new URLSearchParams();
    const trimmedSearch = searchTerm.trim();
    const shouldPersistCityFilter =
      selectedCity !== ALL_CITIES && selectedLocation?.source !== "map" && selectedLocation?.source !== "geolocation";

    if (trimmedSearch) {
      nextSearchParams.set("search", trimmedSearch);
    }

    if (selectedCategory !== ALL_CATEGORIES) {
      nextSearchParams.set("categoryId", selectedCategory);
    }

    if (shouldPersistCityFilter) {
      nextSearchParams.set("city", selectedCity);
    }

    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [
    hasHydratedFromUrl,
    searchParams,
    searchTerm,
    selectedCategory,
    selectedCity,
    selectedLocation?.source,
    setSearchParams,
  ]);

  useEffect(() => {
    let isMounted = true;

    async function loadEventsForMap() {
      setIsSearching(true);
      setSearchError("");

      try {
        const events = await fetchEvents({
          search: searchTerm.trim() || undefined,
          categoryId:
            selectedCategory === ALL_CATEGORIES ? undefined : selectedCategory,
        });

        if (isMounted) {
          setAvailableEvents(events);
        }
      } catch (error) {
        if (isMounted) {
          setSearchError(getApiError(error, "Unable to load events right now."));
          setAvailableEvents([]);
        }
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    }

    loadEventsForMap();

    return () => {
      isMounted = false;
    };
  }, [fetchEvents, searchTerm, selectedCategory]);

  const visibleResults = useMemo(
    () =>
      buildExploreResults(availableEvents, {
        selectedCity,
        selectedLocation,
      }),
    [availableEvents, selectedCity, selectedLocation],
  );
  const selectedCategoryLabel =
    CATEGORIES.find((category) => category.id === selectedCategory)?.name ?? "All Events";
  const selectedCityLabel = selectedCity === ALL_CITIES ? "All Cities" : selectedCity;
  const visibleEvents = visibleResults.map((result) => result.event);

  function handleCitySelect(city: string) {
    setSelectedCity(city);
    setSelectedLocation(createCitySelection(city));
    setMapMessage("");
  }

  function handleMapSelect(selection: MapSelection) {
    const nearestCity = findNearestIndiaCity(selection);
    const nextLabel =
      nearestCity && nearestCity.distanceKm <= 180
        ? `Around ${nearestCity.city}`
        : "Picked on India map";

    setSelectedCity(ALL_CITIES);
    setSelectedLocation({
      ...selection,
      label: nextLabel,
      city: nearestCity?.city,
    });
    setMapMessage("Showing the closest events to your selected map location.");
  }

  function handleReset() {
    setSelectedCity(ALL_CITIES);
    setSelectedLocation(null);
    setMapMessage("");
  }

  function handleClearFilters() {
    setSearchTerm("");
    setSelectedCity(ALL_CITIES);
    setSelectedCategory(ALL_CATEGORIES);
    setSelectedLocation(null);
    setMapMessage("");
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setMapMessage("Geolocation is not supported in this browser.");
      return;
    }

    setIsLocating(true);
    setMapMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const nearestCity = findNearestIndiaCity(nextPoint);

        setSelectedCity(ALL_CITIES);
        setSelectedLocation({
          label: nearestCity ? `Near ${nearestCity.city}` : "Your location",
          lat: nextPoint.lat,
          lng: nextPoint.lng,
          source: "geolocation",
          city: nearestCity?.city,
        });
        setMapMessage(
          nearestCity
            ? `Showing the closest events near ${nearestCity.city}.`
            : "Showing the closest events near your current location.",
        );
        setIsLocating(false);
      },
      (error) => {
        const nextMessage =
          error.code === error.PERMISSION_DENIED
            ? "Location access was blocked. You can still pick a city or click the map."
            : "We could not determine your location right now.";

        setMapMessage(nextMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col bg-black lg:flex-row">
      <IndiaEventMap
        events={availableEvents}
        selectedCategory={selectedCategory}
        selectedCity={selectedCity}
        selectedLocation={selectedLocation}
        onCitySelect={handleCitySelect}
        onMapSelect={handleMapSelect}
        onUseCurrentLocation={handleUseCurrentLocation}
        onReset={handleReset}
        isLocating={isLocating}
      />

      <div className="flex-1 bg-black">
        <div className="sticky top-[72px] z-20 border-b border-white/10 bg-black/90 px-4 py-5 backdrop-blur-xl md:px-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Explore events</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Search across cities, then refine with the map to find what is closest.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    Results
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {isSearching ? "..." : visibleResults.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    Category
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">{selectedCategoryLabel}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    City Filter
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">{selectedCityLabel}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 xl:grid-cols-[1.2fr_0.7fr_0.7fr_auto]">
              <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search events, cities, or venues..."
                  className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                />
              </label>

              <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                <MapPin className="h-4 w-4 text-slate-500" />
                <select
                  value={selectedCity}
                  onChange={(event) => {
                    const nextCity = event.target.value;
                    setSelectedCity(nextCity);
                    setSelectedLocation(
                      nextCity === ALL_CITIES ? null : createCitySelection(nextCity),
                    );
                    setMapMessage("");
                  }}
                  className="w-full cursor-pointer bg-transparent text-white outline-none"
                >
                  <option value={ALL_CITIES} className="bg-black text-white">
                    All Cities
                  </option>
                  {CITIES.map((city) => (
                    <option key={city} value={city} className="bg-black text-white">
                      {city}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-500" />
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="w-full cursor-pointer bg-transparent text-white outline-none"
                >
                  {CATEGORIES.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-black text-white"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Clear filters
              </button>
            </div>

            {(mapMessage || searchError) && (
              <div
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
                  searchError
                    ? "border-red-500/30 bg-red-500/10 text-red-100"
                    : "border-white/10 bg-white/[0.03] text-slate-300"
                }`}
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p>{searchError || mapMessage}</p>
                  {searchError && (
                    <button
                      type="button"
                      onClick={() => setSearchError("")}
                      className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                <Crosshair className="h-3.5 w-3.5" />
                {selectedLocation
                  ? `Map focus: ${selectedLocation.label}`
                  : "Map focus: Nationwide"}
              </span>
              {selectedLocation?.source === "geolocation" && (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-emerald-100">
                  <LocateFixed className="h-3.5 w-3.5" />
                  Using current location
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-6 md:px-6">
          <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {isSearching && (
                <div className="col-span-full flex min-h-64 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] text-slate-400">
                  Loading map results...
                </div>
              )}

              {!isSearching &&
                !searchError &&
                visibleResults.map((result) => {
                  const distanceLabel = formatDistanceLabel(result.distanceKm);

                  return (
                    <motion.div
                      key={result.event.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96, y: 18 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 18 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3"
                    >
                      {distanceLabel && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          {distanceLabel}
                        </div>
                      )}
                      <EventCard {...result.event} />
                    </motion.div>
                  );
                })}

              {!isSearching && !searchError && visibleEvents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex min-h-72 flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] px-6 text-center"
                >
                  <Search className="h-10 w-10 text-slate-600" />
                  <p className="mt-5 text-xl font-semibold text-white">No events found</p>
                  <p className="mt-2 max-w-xl text-sm text-slate-400">
                    Try a broader search, clear the city filter, or click a different region on
                    the map.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-slate-200"
                  >
                    Reset search and map focus
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

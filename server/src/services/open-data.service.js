import { HttpError } from "../utils/http-error.js";

const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_CACHE_TTL_MS = 15 * 60 * 1000;
const OPEN_METEO_TIMEOUT_MS = 8000;
const WEATHER_CODE_LABELS = new Map([
  [0, "Clear sky"],
  [1, "Mainly clear"],
  [2, "Partly cloudy"],
  [3, "Overcast"],
  [45, "Fog"],
  [48, "Depositing rime fog"],
  [51, "Light drizzle"],
  [53, "Moderate drizzle"],
  [55, "Dense drizzle"],
  [61, "Slight rain"],
  [63, "Moderate rain"],
  [65, "Heavy rain"],
  [80, "Slight rain showers"],
  [81, "Moderate rain showers"],
  [82, "Violent rain showers"],
  [95, "Thunderstorm"],
]);
const weatherCache = new Map();

function buildCacheKey(latitude, longitude) {
  return `${latitude.toFixed(2)}:${longitude.toFixed(2)}`;
}

export async function getOpenWeather({ latitude, longitude }) {
  const cacheKey = buildCacheKey(latitude, longitude);
  const cachedResult = weatherCache.get(cacheKey);

  if (cachedResult && cachedResult.expiresAt > Date.now()) {
    return cachedResult.value;
  }

  const url = new URL(OPEN_METEO_BASE_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
  );
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
  );
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", "auto");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPEN_METEO_TIMEOUT_MS);
  let response;

  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new HttpError(504, "Open weather data timed out.");
    }

    throw new HttpError(502, "Open weather data is unavailable right now.");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new HttpError(502, "Open weather data is unavailable right now.");
  }

  const data = await response.json();
  const currentCode = Number(data.current?.weather_code);
  const weather = {
    provider: "Open-Meteo",
    current: {
      temperatureC: data.current?.temperature_2m,
      humidityPercent: data.current?.relative_humidity_2m,
      precipitationMm: data.current?.precipitation,
      windSpeedKmh: data.current?.wind_speed_10m,
      summary: WEATHER_CODE_LABELS.get(currentCode) ?? "Weather update",
      observedAt: data.current?.time,
    },
    daily: Array.isArray(data.daily?.time)
      ? data.daily.time.map((date, index) => {
          const code = Number(data.daily.weather_code?.[index]);

          return {
            date,
            minTemperatureC: data.daily.temperature_2m_min?.[index],
            maxTemperatureC: data.daily.temperature_2m_max?.[index],
            precipitationProbabilityPercent:
              data.daily.precipitation_probability_max?.[index],
            summary: WEATHER_CODE_LABELS.get(code) ?? "Forecast",
          };
        })
      : [],
  };

  weatherCache.set(cacheKey, {
    expiresAt: Date.now() + OPEN_METEO_CACHE_TTL_MS,
    value: weather,
  });

  return weather;
}

function sanitizeString(value) {
  return value
    .replace(/[<>]/g, "")
    .replace(/\0/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeValue(value) {
  if (typeof value === "string") {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, sanitizeValue(entry)]),
    );
  }

  return value;
}

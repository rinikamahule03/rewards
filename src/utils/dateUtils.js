/**
 * Return month, year, and a numeric sort key for a given date input.
 *
 * - Accepts input as a Date instance, an ISO/date string, or a numeric timestamp.
 * - month is the localized month name (e.g. "January") using the runtime's default locale.
 * - year is the full numeric year (e.g. 2024).
 * - sortKey is a numeric value useful for sorting months chronologically:
 *     sortKey = year * 100 + monthIndex
 *   where monthIndex is zero-based (0 = January).
 *
 * NOTE:
 * - The function relies on the environment timezone when constructing the Date object.
 *   For consistent cross-timezone behavior, pass UTC-normalized date strings (e.g. "2024-02-01T00:00:00Z")
 *   or handle timezone at the data ingestion layer.
 *
 * @param {string|number|Date} date - A date value (ISO date string, timestamp, or Date object).
 * @returns {{ month: string, year: number, sortKey: number }} An object with:
 *   - month: localized month name (string)
 *   - year: numeric year (number)
 *   - sortKey: numeric key for chronological sorting (number)
 *
 * @example
 * getMonthYearKey("2024-02-05")
 * // -> { month: "February", year: 2024, sortKey: 202402 }
 *
 * @example
 * getMonthYearKey(new Date(2023, 0, 12)) // January 12, 2023
 * // -> { month: "January", year: 2023, sortKey: 202301 }
 */
export const getMonthYearKey = (date) => {
  const d = new Date(date);
  return {
    month: d.toLocaleString("default", { month: "long" }),
    year: d.getFullYear(),
    sortKey: d.getFullYear() * 100 + d.getMonth()
  };
};

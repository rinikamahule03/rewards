/**
 * Return month, year, and sortKey for sorting
 */
export const getMonthYearKey = (date) => {
  const d = new Date(date);
  return {
    month: d.toLocaleString("default", { month: "long" }),
    year: d.getFullYear(),
    sortKey: d.getFullYear() * 100 + d.getMonth()
  };
};

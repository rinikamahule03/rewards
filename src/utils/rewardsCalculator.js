import { getMonthYearKey } from "./dateUtils";

/**
 * Calculate reward points for a single transaction amount.
 *
 * Rules:
 * - 2 points for every whole dollar spent above $100
 * - 1 point for every whole dollar spent between $50 and $100 (inclusive of 51..100)
 * - cents are ignored (floor to whole dollars)
 *
 * @param {number} amount - transaction amount (can be decimal)
 * @returns {number} reward points (integer)
 *
 * @example
 * calculateRewardPoints(120.99) // -> 40  (2*(120-100) = 40)
 * calculateRewardPoints(75.5)   // -> 25  (1*(75-50) = 25)
 */
export const calculateRewardPoints = (amount) => {
  const dollars = Math.floor(amount); // decimal safe
  return Math.max(dollars - 100, 0) * 2 + Math.max(Math.min(dollars, 100) - 50, 0);
};

/**
 * Aggregate transactions into per-customer monthly summaries.
 *
 * For each customer the result contains:
 * {
 *   customerId: string,
 *   name: string,
 *   monthly: [
 *     {
 *       month: "January",
 *       year: 2024,
 *       sortKey: 202401,            // numeric key useful for chronological sorting
 *       rewardPoints: 120,         // aggregated reward points for that month
 *       amountSpent: "$120.50",    // total for that month formatted to 2 decimals with $
 *       transactions: [ ... ]      // original transactions for that month
 *     },
 *     ...
 *   ]
 * }
 *
 * Behavior:
 * - Groups by customerId if present, otherwise customerName, else "__unknown__"
 * - Groups by month+year (derived from tx.date using getMonthYearKey)
 * - Rounds/format amountSpent to "$<number>.00" string
 *
 * @param {Array<Object>} transactions - list of transaction objects. Expected shape:
 *   { transactionId?, customerId?, customerName?, date, amount }
 * @returns {Array<Object>} list of per-customer monthly summaries
 *
 * @example
 * aggregateMonthlyRewards([{ customerId: "C1", customerName: "A", date: "2024-02-05", amount: 120 }])
 * // -> [{ customerId: "C1", name: "A", monthly: [{ month: "February", year: 2024, rewardPoints: 40, amountSpent: "$120.00", transactions: [...] }] }]
 */
  export const aggregateMonthlyRewards = (transactions) => {
  // Build a map per customer, then a months map per customer to collect transactions
  const customers = transactions.reduce((acc, tx) => {
    const { month, year, sortKey } = getMonthYearKey(tx.date);
    const points = calculateRewardPoints(Number(tx.amount) || 0);
    const amount = Number(tx.amount) || 0;
    const customerKey = tx.customerId || tx.customerName || "__unknown__";

    acc[customerKey] = acc[customerKey] || {
      customerId: tx.customerId || "",
      name: tx.customerName || "",
      months: Object.create(null)
    };

    const mKey = `${year}-${month}`;
    const months = acc[customerKey].months;

    if (!months[mKey]) {
      months[mKey] = {
        month,
        year,
        sortKey,
        rewardPoints: 0,
        amountSpent: 0,
        transactions: []
      };
    }

    months[mKey].transactions.push(tx);
    months[mKey].rewardPoints += points;
    months[mKey].amountSpent += amount;

    return acc;
  }, Object.create(null));

  // Convert months map to a sorted array and return per-customer objects.
  // Each customer includes:
  // - monthly: array of { month, year, sortKey, rewardPoints, amountSpent, transactions }
  // - monthYearList: array of "Month Year" strings (separate array as requested)
  return Object.values(customers).map((c) => {
    const monthly = Object.values(c.months)
      .sort((a, b) => a.sortKey - b.sortKey)
      .map((m) => ({
        ...m,
        // round amountSpent to 2 decimals (number)
        amountSpent: `$${m.amountSpent.toFixed(2)}`
      }));

    return {
      customerId: c.customerId,
      name: c.name,
      monthly,
    };
  });
};

/**
 * Build total rewards per customer across all transactions.
 *
 * Output format:
 * [
 *   {
 *     customerId: string,
 *     customerName: string,
 *     amountSpent: "$123.45",    // total across all transactions formatted to 2 decimals
 *     rewardPoints: 150
 *   },
 *   ...
 * ]
 *
 * @param {Array<Object>} transactions - list of transaction objects
 * @returns {Array<Object>} totals per customer
 *
 * @example
 * buildTotalRewards([{ customerId: "C1", customerName: "A", amount: 120 }])
 * // -> [{ customerId: "C1", customerName: "A", amountSpent: "$120.00", rewardPoints: 40 }]
 */
export const buildTotalRewards = (transactions) => {
  const acc = transactions.reduce((map, tx) => {
    const points = calculateRewardPoints(tx.amount);
    const key = tx.customerId;

    if (!map[key]) {
      map[key] = {
        customerId: tx.customerId || "",
        customerName: tx.customerName || "",
        amountSpent: 0,
        rewardPoints: 0
      };
    }

    map[key].rewardPoints += points;
    map[key].amountSpent += tx.amount;
    return map;
  }, Object.create(null));

  // return an array of { customerId, customerName, rewardPoints }
  return Object.values(acc).map(c => ({
    ...c,
    amountSpent: `$${c.amountSpent.toFixed(2)}` // To always keep 2 decimals
  }));
};

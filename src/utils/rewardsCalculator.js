import { getMonthYearKey } from "./dateUtils";

/**
 * Calculate reward points.
 * - 2 points for every dollar above 100
 * - 1 point for every dollar between 50 and 100
 * - Ignore cents (floor)
 */
export const calculateRewardPoints = (amount) => {
  const dollars = Math.floor(amount); // decimal safe
  return Math.max(dollars - 100, 0) * 2 + Math.max(Math.min(dollars, 100) - 50, 0);
};

/**
 * Aggregate monthly rewards by customer
 */

export const aggregateMonthlyRewards = (transactions) =>
  transactions.reduce((acc, tx) => {
    const { month, year, sortKey } = getMonthYearKey(tx.date);
    const points = calculateRewardPoints(tx.amount);
    const key = `${tx.customerId}-${year}-${month}`;

    acc[key] = acc[key] || {
      customerId: tx.customerId,
      name: tx.customerName,
      month,
      year,
      sortKey,
      rewardPoints: 0
    };

    acc[key].rewardPoints += points;
    return acc;
  }, {});

//   export const aggregateMonthlyRewards = (transactions) => {
//   // Build a map per customer, then a months map per customer to collect transactions
//   const customers = transactions.reduce((acc, tx) => {
//     const { month, year, sortKey } = getMonthYearKey(tx.date);
//     const points = calculateRewardPoints(tx.amount || 0);
//     const customerKey = tx.customerId || tx.customerName || "__unknown__";

//     acc[customerKey] = acc[customerKey] || {
//       customerId: tx.customerId || "",
//       name: tx.customerName || "",
//       months: Object.create(null)
//     };

//     const mKey = `${year}-${month}`;
//     const months = acc[customerKey].months;

//     if (!months[mKey]) {
//       months[mKey] = {
//         month,
//         year,
//         sortKey,
//         rewardPoints: 0,
//         transactions: []
//       };
//     }

//     months[mKey].transactions.push(tx);
//     months[mKey].rewardPoints += points;

//     return acc;
//   }, Object.create(null));

//   // Convert months map to an array (sorted by sortKey) and return per-customer objects
//   return Object.values(customers).map((c) => ({
//     customerId: c.customerId,
//     name: c.name,
//     monthly: Object.values(c.months).sort((a, b) => a.sortKey - b.sortKey)
//   }));
// };


/**
 * Aggregate total rewards by customer
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

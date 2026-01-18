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

/**
 * Aggregate total rewards by customer
 */
export const buildTotalRewards = (transactions) =>
  transactions.reduce((acc, tx) => {
    const points = calculateRewardPoints(tx.amount);
    acc[tx.customerName] = (acc[tx.customerName] || 0) + points;
    return acc;
  }, Object.create(null));

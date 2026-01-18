import { aggregateMonthlyRewards, buildTotalRewards, calculateRewardPoints } from "../utils/rewardsCalculator";

// Sample transactions dataset (multi-year, decimals)
const transactions = [
  { transactionId: "T1", customerId: "C1", customerName: "Mark", date: "2023-12-15", product: "Laptop", amount: 120.2 },
  { transactionId: "T2", customerId: "C1", customerName: "Mark", date: "2024-01-10", product: "Mouse", amount: 75.5 },
  { transactionId: "T3", customerId: "C1", customerName: "Mark", date: "2024-02-05", product: "Monitor", amount: 200 },
  { transactionId: "T4", customerId: "C2", customerName: "Lisa", date: "2023-12-20", product: "Notebook", amount: 45.8 },
  { transactionId: "T5", customerId: "C2", customerName: "Lisa", date: "2024-01-14", product: "Keyboard", amount: 110.4 },
  { transactionId: "T6", customerId: "C2", customerName: "Lisa", date: "2024-02-01", product: "Desk Lamp", amount: 90 }
];

describe("Reward aggregation tests", () => {

  test("calculateRewardPoints works for decimals", () => {
    expect(calculateRewardPoints(100.2)).toBe(50);
    expect(calculateRewardPoints(100.9)).toBe(50);
    expect(calculateRewardPoints(120.7)).toBe(90);
    expect(calculateRewardPoints(45.8)).toBe(0);
  });

  test("aggregateMonthlyRewards aggregates correctly", () => {
    const monthlyMap = aggregateMonthlyRewards(transactions);
    const results = Object.values(monthlyMap);

    // Expect 6 transaction entries grouped into 4 months (C1 & C2 in Dec, Jan, Feb)
    expect(results.length).toBe(6); // C1-Dec, C1-Jan, C1-Feb, C2-Dec, C2-Jan, C2-Feb => 6
    const markDec = results.find(r => r.customerId === "C1" && r.month === "December" && r.year === 2023);
    const markJan = results.find(r => r.customerId === "C1" && r.month === "January" && r.year === 2024);
    const markFeb = results.find(r => r.customerId === "C1" && r.month === "February" && r.year === 2024);

    expect(markDec.rewardPoints).toBe(90);
    expect(markJan.rewardPoints).toBe(25);
    expect(markFeb.rewardPoints).toBe(250);
  });

  test("buildTotalRewards aggregates correctly", () => {
    const total = buildTotalRewards(transactions);
    expect(total["Mark"]).toBe(90 + 25 + 250); // 365
    expect(total["Lisa"]).toBe(0 + 70 + 40); // 110
  });

});

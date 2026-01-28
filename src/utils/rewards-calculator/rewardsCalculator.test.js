import { calculateRewardPoints, aggregateMonthlyRewards, buildTotalRewards, priceSortComparator } from "./rewardsCalculator";

describe("calculateRewardPoints - expected numeric behavior", () => {
  test("handles typical buckets and floors cents", () => {
    expect(calculateRewardPoints(120.99)).toBe(90); // floor to 120 -> (20*2) + (50) = 90
    expect(calculateRewardPoints(75.5)).toBe(25);  // floor to 75 -> (0*2) + (25) = 25
    expect(calculateRewardPoints(49.99)).toBe(0);  // below 50 -> 0
    expect(calculateRewardPoints(50)).toBe(0);     // exactly 50 -> 0
    expect(calculateRewardPoints(51)).toBe(1);     // 1 dollar above 50 -> 1
    expect(calculateRewardPoints(100)).toBe(50);   // exactly 100 -> 50
  });

  test("treats non-finite and non-positive values as zero", () => {
    expect(calculateRewardPoints(NaN)).toBe(0);
    expect(calculateRewardPoints(Infinity)).toBe(0);
    expect(calculateRewardPoints(-10)).toBe(0);
    expect(calculateRewardPoints(0)).toBe(0);
  });

  test("calculateRewardPoints handles non-positive and invalid values", () => {
    expect(calculateRewardPoints(0)).toBe(0);
    expect(calculateRewardPoints(-5)).toBe(0);
    expect(calculateRewardPoints(NaN)).toBe(0);
    expect(calculateRewardPoints(Infinity)).toBe(0);
  });
});

describe("aggregateMonthlyRewards", () => {
  const transactions = [
    { transactionId: "t1", customerId: "C1", customerName: "Alice", date: "2024-01-15", amount: 120.75 },
    { transactionId: "t2", customerId: "C1", customerName: "Alice", date: "2024-01-20", amount: 30 },
    { transactionId: "t3", customerId: "C1", customerName: "Alice", date: "2024-02-05", amount: 75 },
    { transactionId: "t4", customerId: "C2", customerName: "Bob",   date: "2024-01-10", amount: 200 },
    { transactionId: "t5", customerName: "Charlie", date: "2024-01-12", amount: 60 }
  ];

  test("aggregates transactions by customer and month with correct points and formatted amounts", () => {
    const result = aggregateMonthlyRewards(transactions);
    // should have one entry per customer key: C1, C2, "Charlie"
    expect(result.length).toBe(3);

    const c1 = result.find(r => r.customerId === "C1");
    expect(c1).toBeDefined();
    expect(c1.name).toBe("Alice");
    // C1 has Jan and Feb entries
    expect(c1.monthly.length).toBe(2);

    const jan = c1.monthly.find(m => m.month === "January" && m.year === 2024);
    expect(jan).toBeDefined();
    // t1 -> 120 => 90 points, t2 -> 30 => 0 points, total 90
    expect(jan.rewardPoints).toBe(90);
    expect(jan.amountSpent).toBe("$150.75");
    expect(jan.transactions.map(t => t.transactionId)).toEqual(expect.arrayContaining(["t1", "t2"]));

    const feb = c1.monthly.find(m => m.month === "February" && m.year === 2024);
    expect(feb).toBeDefined();
    // t3 -> 75 => 25 points
    expect(feb.rewardPoints).toBe(25);
    expect(feb.amountSpent).toBe("$75.00");

    const c2 = result.find(r => r.customerId === "C2");
    expect(c2).toBeDefined();
    const c2Jan = c2.monthly.find(m => m.month === "January" && m.year === 2024);
    // t4 -> 200 => (200-100)*2 + (100-50) = 200 + 50 = 250
    expect(c2Jan.rewardPoints).toBe(250);
    expect(c2Jan.amountSpent).toBe("$200.00");

    const charlie = result.find(r => r.name === "Charlie" || r.customerId === "");
    expect(charlie).toBeDefined();
    const charlieJan = charlie.monthly.find(m => m.month === "January" && m.year === 2024);
    expect(charlieJan.rewardPoints).toBe(10);
    expect(charlieJan.amountSpent).toBe("$60.00");
  });

  test("returns empty array when given no transactions", () => {
    expect(aggregateMonthlyRewards([])).toEqual([]);
  });
});

describe("buildTotalRewards", () => {
  const transactions = [
    { transactionId: "t1", customerId: "C1", customerName: "Alice", date: "2024-01-15", amount: 120.75 },
    { transactionId: "t2", customerId: "C1", customerName: "Alice", date: "2024-01-20", amount: 30 },
    { transactionId: "t3", customerId: "C1", customerName: "Alice", date: "2024-02-05", amount: 75 },
    { transactionId: "t4", customerId: "C2", customerName: "Bob",   date: "2024-01-10", amount: 200 },
    { transactionId: "t5",                    customerName: "Charlie", date: "2024-01-12", amount: 60 }
  ];

  test("computes total amountSpent and rewardPoints per customerId (groups missing ids under empty id)", () => {
    const totals = buildTotalRewards(transactions);
    // C1 totals
    const c1 = totals.find(t => t.customerId === "C1");
    expect(c1).toBeDefined();
    // total amount 120.75 + 30 + 75 = 225.75
    expect(c1.amountSpent).toBe("$225.75");
    // points 90 + 0 + 25 = 115
    expect(c1.rewardPoints).toBe(115);

    const c2 = totals.find(t => t.customerId === "C2");
    expect(c2).toBeDefined();
    expect(c2.amountSpent).toBe("$200.00");
    expect(c2.rewardPoints).toBe(250);

    // the transaction with no customerId will be grouped under an empty id (customerId === "")
    const anon = totals.find(t => t.customerName === "Charlie");
    expect(anon).toBeDefined();
    expect(anon.amountSpent).toBe("$60.00");
    expect(anon.rewardPoints).toBe(10);
  });

  test("returns empty array when given no transactions", () => {
    expect(buildTotalRewards([])).toEqual([]);
  });
});

describe("priceSortComparator", () => {
  test("parses strings with $, commas and whitespace correctly", () => {
    expect(priceSortComparator(" $1,234.56 ", "1000")).toBeCloseTo(234.56);
  });

  test("handles numeric inputs", () => {
    expect(priceSortComparator(10, 20)).toBe(-10);
    expect(priceSortComparator(20, 10)).toBe(10);
  });

  test("treats non-numeric strings and missing values as 0", () => {
    expect(priceSortComparator("abc", "$5")).toBe(-5);
    expect(priceSortComparator(null, undefined)).toBe(0);
    expect(priceSortComparator("   ", 2)).toBe(-2);
  });

  test("works as comparator for Array.prototype.sort (ascending)", () => {
    const arr = ["$1,200.00", "$50", "300", null, "$0.50"];
    const expected = [null, "$0.50", "$50", "300", "$1,200.00"];
    arr.sort(priceSortComparator);
    expect(arr).toEqual(expected);
  });
});
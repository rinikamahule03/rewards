import { calculateRewardPoints } from "../utils/rewardsCalculator";

test("calculates fractional amounts correctly", () => {
  expect(calculateRewardPoints(100.2)).toBe(50);
  expect(calculateRewardPoints(100.9)).toBe(50);
  expect(calculateRewardPoints(120.7)).toBe(90);
});

test("calculates points below 50", () => {
  expect(calculateRewardPoints(40)).toBe(0);
});

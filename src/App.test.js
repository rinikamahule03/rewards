import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./hooks/useRewardsData", () => ({
  useRewardsData: jest.fn(),
}));

const { useRewardsData } = require("./hooks/useRewardsData");

afterEach(() => {
  jest.resetAllMocks();
});

test("displays error message when useRewardsData returns an error", () => {
  useRewardsData.mockReturnValue({
    loading: false,
    error: new Error("Fetch failed"),
    transactions: [],
    monthlyRewards: [],
    totalRewards: [],
  });

  render(<App />);

  expect(screen.getByText(/Error: Fetch failed/)).toBeInTheDocument();
});

test("renders Loader when loading is true", () => {
  useRewardsData.mockReturnValue({
    loading: true,
    error: null,
    transactions: [],
    monthlyRewards: [],
    totalRewards: [],
  });

  render(<App />);

  expect(screen.getByText("Loading data...")).toBeInTheDocument();
});

test("renders Monthly, Total and Transactions tables when data is available", () => {
  useRewardsData.mockReturnValue({
    loading: false,
    error: null,
    transactions: [
      { transactionId: "T1", customerName: "Mark", date: "2024-01-01", amount: 120 },
    ],
    monthlyRewards: [
      { customerId: "C1", customerName: "Mark", month: "January", year: 2024, rewardPoints: 90 },
    ],
    totalRewards: [{ name: "Mark", rewardPoints: 90 }],
  });

  render(<App />);

  expect(screen.getByText("Customer Rewards Dashboard")).toBeInTheDocument();
  expect(screen.getByText("User monthly rewards")).toBeInTheDocument();
  expect(screen.getByText("Total rewards")).toBeInTheDocument();
  expect(screen.getByText("Transactions")).toBeInTheDocument();
});
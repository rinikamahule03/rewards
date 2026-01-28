import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

// mock the hook and child components before importing the component under test
jest.mock("../../hooks/useRewardsData", () => ({
  useRewardsData: jest.fn()
}));

jest.mock("../../components/loader/Loader", () => () => <div data-testid="loader" />);
jest.mock("../../components/transactions-table/TransactionsTable", () => ({ transactions }) => (
  <div data-testid="transactions-table">{JSON.stringify(transactions)}</div>
));
jest.mock("../../components/monthly-rewards-table/MonthlyRewardsTable", () => ({ monthlyRewards }) => (
  <div data-testid="monthly-table">{JSON.stringify(monthlyRewards)}</div>
));
jest.mock("../../components/total-rewards-table/TotalRewardsTable", () => ({ totalRewards }) => (
  <div data-testid="total-table">{JSON.stringify(totalRewards)}</div>
));
jest.mock("../../components/error/ErrorPage", () => ({ error }) => (
  <div data-testid="error-page">{String(error)}</div>
));

import { useRewardsData } from "../../hooks/useRewardsData";
import RewardsDashboard from "./RewardsDashboard";

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

test("shows loader while loading", () => {
  useRewardsData.mockReturnValue({
    loading: true,
    error: null,
    transactions: [],
    monthlyRewards: [],
    totalRewards: []
  });

  render(<RewardsDashboard />);

  expect(screen.getByTestId("loader")).toBeInTheDocument();
  expect(screen.queryByTestId("error-page")).not.toBeInTheDocument();
  expect(screen.queryByTestId("monthly-table")).not.toBeInTheDocument();
});

test("shows error page when hook returns error", () => {
  useRewardsData.mockReturnValue({
    loading: false,
    error: "Failed to load",
    transactions: [],
    monthlyRewards: [],
    totalRewards: []
  });

  render(<RewardsDashboard />);

  expect(screen.getByTestId("error-page")).toBeInTheDocument();
  expect(screen.getByTestId("error-page")).toHaveTextContent("Failed to load");
  expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  expect(screen.queryByTestId("monthly-table")).not.toBeInTheDocument();
});

test("renders dashboard title and child tables when data loaded", () => {
  const mockTransactions = [{ transactionId: "t1" }];
  const mockMonthly = [{ month: "January", year: 2024 }];
  const mockTotal = [{ customerId: "C1", rewardPoints: 10 }];

  useRewardsData.mockReturnValue({
    loading: false,
    error: null,
    transactions: mockTransactions,
    monthlyRewards: mockMonthly,
    totalRewards: mockTotal
  });

  render(<RewardsDashboard />);

  expect(screen.getByText("Customer Rewards Dashboard")).toBeInTheDocument();

  const monthly = screen.getByTestId("monthly-table");
  const total = screen.getByTestId("total-table");
  const transactions = screen.getByTestId("transactions-table");

  expect(monthly).toBeInTheDocument();
  expect(monthly).toHaveTextContent(JSON.stringify(mockMonthly));

  expect(total).toBeInTheDocument();
  expect(total).toHaveTextContent(JSON.stringify(mockTotal));

  expect(transactions).toBeInTheDocument();
  expect(transactions).toHaveTextContent(JSON.stringify(mockTransactions));
});
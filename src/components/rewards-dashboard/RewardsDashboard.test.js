import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { useRewardsData } from "../../hooks/useRewardsData";
import RewardsDashboard from "./RewardsDashboard";

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

// Mock DateFilter so tests can control apply/clear behavior
jest.mock("../date-filter/DateFilter", () => (props) => {
  // apply button will call onApply with a mid-February range by default
  return (
    <div data-testid="mock-datefilter">
      <button
        data-testid="mock-datefilter-apply"
        onClick={() =>
          props.onApply && props.onApply(new Date("2024-02-01"), new Date("2024-02-28"))
        }
      >
        Apply
      </button>
      <button
        data-testid="mock-datefilter-apply-invalid"
        onClick={() =>
          props.onApply && props.onApply(new Date("2024-03-10"), new Date("2024-03-01"))
        }
      >
        Apply Invalid
      </button>
      <button data-testid="mock-datefilter-clear" onClick={() => props.onClear && props.onClear()}>
        Clear
      </button>
    </div>
  );
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

test("shows loader while loading", () => {
  useRewardsData.mockReturnValue({
    loading: true,
    error: null,
    transactions: []
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
    transactions: []
  });

  render(<RewardsDashboard />);

  expect(screen.getByTestId("error-page")).toBeInTheDocument();
  expect(screen.getByTestId("error-page")).toHaveTextContent("Failed to load");
  expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  expect(screen.queryByTestId("monthly-table")).not.toBeInTheDocument();
});

test("renders dashboard title and child tables when data loaded", () => {
  const mockTransactions = [{ transactionId: "t1", date: "2024-01-01" }];
  useRewardsData.mockReturnValue({
    loading: false,
    error: null,
    transactions: mockTransactions
  });

  render(<RewardsDashboard />);

  expect(screen.getByText("Customer Rewards Dashboard")).toBeInTheDocument();

  const monthly = screen.getByTestId("monthly-table");
  const total = screen.getByTestId("total-table");
  const transactions = screen.getByTestId("transactions-table");

  expect(monthly).toBeInTheDocument();
  expect(total).toBeInTheDocument();
  expect(transactions).toBeInTheDocument();
});

test("date filter apply reduces transactions displayed and child tables receive filtered data", () => {
  const txs = [
    { transactionId: "A", date: "2024-01-10", amount: 50 },
    { transactionId: "B", date: "2024-02-05", amount: 120 },
    { transactionId: "C", date: "2024-03-12", amount: 80 }
  ];
  useRewardsData.mockReturnValue({
    loading: false,
    error: null,
    transactions: txs
  });

  render(<RewardsDashboard />);

  // initially all transactions shown
  expect(screen.getByText(/Showing 3 \/ 3 transactions/)).toBeInTheDocument();
  const initialTransactionsJson = screen.getByTestId("transactions-table").textContent;
  expect(initialTransactionsJson).toContain('"transactionId":"A"');
  expect(initialTransactionsJson).toContain('"transactionId":"B"');
  expect(initialTransactionsJson).toContain('"transactionId":"C"');

  // Apply date filter (mock DateFilter applies 2024-02-01 to 2024-02-28)
  fireEvent.click(screen.getByTestId("mock-datefilter-apply"));

  // After applying, only transaction B should remain
  expect(screen.getByText(/Showing 1 \/ 3 transactions/)).toBeInTheDocument();
  const filteredTransactionsJson = screen.getByTestId("transactions-table").textContent;
  expect(filteredTransactionsJson).toContain('"transactionId":"B"');
  expect(filteredTransactionsJson).not.toContain('"transactionId":"A"');
  expect(filteredTransactionsJson).not.toContain('"transactionId":"C"');
});

test("date filter invalid range is ignored by RewardsDashboard (no change)", () => {
  const txs = [
    { transactionId: "A", date: "2024-01-10", amount: 50 },
    { transactionId: "B", date: "2024-02-05", amount: 120 }
  ];
  useRewardsData.mockReturnValue({
    loading: false,
    error: null,
    transactions: txs
  });

  render(<RewardsDashboard />);

  // initial state contains both
  expect(screen.getByText(/Showing 2 \/ 2 transactions/)).toBeInTheDocument();

  // Trigger apply with invalid range (start > end) - mock button
  fireEvent.click(screen.getByTestId("mock-datefilter-apply-invalid"));

  // Because RewardsDashboard ignores invalid ranges, the counts should remain unchanged
  expect(screen.getByText(/Showing 2 \/ 2 transactions/)).toBeInTheDocument();
  const transactionsJson = screen.getByTestId("transactions-table").textContent;
  expect(transactionsJson).toContain('"transactionId":"A"');
  expect(transactionsJson).toContain('"transactionId":"B"');
});
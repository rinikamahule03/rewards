import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import TransactionsTable from "./TransactionsTable";

// Mock the generic Table component used by TransactionsTable
jest.mock("../table/Table", () => (props) => {
  return (
    <div
      data-testid="mock-table"
      data-columns={JSON.stringify(props.columns)}
      data-rows={JSON.stringify(props.data)}
      data-page-size={String((props.rowsPerPageOptions && props.rowsPerPageOptions[0]) || (props.data && props.data.length) || "")}
      data-page-size-options={JSON.stringify(props.rowsPerPageOptions)}
      data-title={props.title}
      data-no-data={props.noDataText}
    />
  );
});

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

test("renders Table and forwards rowsPerPageOptions and data", () => {
  const sample = [
    { transactionId: "T1", customerName: "Alice", date: "2023-01-01", product: "Mouse", amount: 45 }
  ];

  render(<TransactionsTable transactions={sample} />);

  const table = screen.getByTestId("mock-table");
  expect(table).toBeInTheDocument();

  // rows forwarded
  expect(table.getAttribute("data-rows")).toBe(JSON.stringify(sample));

  // page size options forwarded (ROW_OPTIONS expected [5,10,25])
  const pageSizeOptions = JSON.parse(table.getAttribute("data-page-size-options"));
  expect(Array.isArray(pageSizeOptions)).toBe(true);
  expect(pageSizeOptions).toEqual(expect.arrayContaining([5, 10, 25]));

  // default page size should be first option (5)
  expect(table.getAttribute("data-page-size")).toBe("5");
});

test("passes expected columns (transactionId, customerName, purchaseDate, product, amount, rewardPoints)", () => {
  render(<TransactionsTable transactions={[]} />);

  const table = screen.getByTestId("mock-table");
  const cols = JSON.parse(table.getAttribute("data-columns") || "[]");

  const fields = cols.map((c) => c.field).filter(Boolean);
  expect(fields).toEqual(
    expect.arrayContaining([
      "transactionId",
      "customerName",
      "purchaseDate",
      "product",
      "amount",
      "rewardPoints"
    ])
  );
});

test("forwards empty array without crashing and provides title/no-data attributes", () => {
  render(<TransactionsTable transactions={[]} />);

  const table = screen.getByTestId("mock-table");
  expect(table).toBeInTheDocument();

  // Ensure data is an empty array when no items
  expect(JSON.parse(table.getAttribute("data-rows") || "null")).toEqual([]);

  // Title and no-data attributes exist
  expect(table.getAttribute("data-title")).toBeTruthy();
  expect(table.getAttribute("data-no-data")).toBeTruthy();
});
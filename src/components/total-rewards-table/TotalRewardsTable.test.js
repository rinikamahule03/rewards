import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import TotalRewardsTable from "./TotalRewardsTable";

// Mock the generic Table component used by TotalRewardsTable
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
    { customerId: "C1", customerName: "Alice", amountSpent: 120.5, rewardPoints: 90 }
  ];

  render(<TotalRewardsTable totalRewards={sample} />);

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

test("passes expected columns (customerId, customerName, amountSpent, rewardPoints)", () => {
  render(<TotalRewardsTable totalRewards={[]} />);

  const table = screen.getByTestId("mock-table");
  const cols = JSON.parse(table.getAttribute("data-columns") || "[]");

  const fields = cols.map((c) => c.field).filter(Boolean);
  expect(fields).toEqual(
    expect.arrayContaining(["customerId", "customerName", "amountSpent", "rewardPoints"])
  );
});

test("forwards empty array without crashing and provides title/no-data attributes", () => {
  render(<TotalRewardsTable totalRewards={[]} />);

  const table = screen.getByTestId("mock-table");
  expect(table).toBeInTheDocument();

  // Ensure data is an empty array when no items
  expect(JSON.parse(table.getAttribute("data-rows") || "null")).toEqual([]);

  // Title and no-data attributes exist (content not strictly asserted to avoid coupling)
  expect(table.getAttribute("data-title")).toBeTruthy();
  expect(table.getAttribute("data-no-data")).toBeTruthy();
});
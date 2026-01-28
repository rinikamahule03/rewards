import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import MonthlyRewardsTable from "./MonthlyRewardsTable";

// Mock the Table component used by MonthlyRewardsTable to inspect props passed into it
jest.mock("../table/Table", () => (props) => {
  return (
    <div data-testid="mock-table">
      <div data-testid="table-title">{props.title}</div>
      <div data-testid="table-no-data">{props.noDataText}</div>
      <div data-testid="table-rowsperpage">{JSON.stringify(props.rowsPerPageOptions)}</div>

      <div data-testid="table-columns">
        {Array.isArray(props.columns) &&
          props.columns.map((c) => (
            <div
              key={c.field}
              data-field={c.field}
              data-has-render={typeof c.renderCell === "function" ? "true" : "false"}
            >
              {c.headerName}
            </div>
          ))}
      </div>

      <div data-testid="table-data">
        {Array.isArray(props.data) &&
          props.data.map((r, idx) => (
            <div
              key={idx}
              data-customerid={r.customerId}
              data-name={r.name}
              data-months={JSON.stringify(r.monthly || [])}
            />
          ))}
      </div>
    </div>
  );
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

test("renders Table with title and noDataText when monthlyRewards empty", () => {
  render(<MonthlyRewardsTable monthlyRewards={[]} />);

  expect(screen.getByTestId("mock-table")).toBeInTheDocument();
  expect(screen.getByTestId("table-title")).toHaveTextContent("User monthly rewards");
  expect(screen.getByTestId("table-no-data")).toHaveTextContent("No monthly rewards data available.");
  // rowsPerPageOptions should be present
  expect(screen.getByTestId("table-rowsperpage")).toHaveTextContent(JSON.stringify([5, 10, 25]));
});

test("passes columns with renderCell functions for monthly, amountSpent and rewardPoints", () => {
  const sample = [
    {
      customerId: "C1",
      name: "Alice",
      monthly: [
        { month: "January", year: 2024, amountSpent: "$120.00", rewardPoints: 40 },
        { month: "February", year: 2024, amountSpent: "$75.00", rewardPoints: 25 }
      ]
    }
  ];

  render(<MonthlyRewardsTable monthlyRewards={sample} />);

  const columns = screen.getByTestId("table-columns");
  // should include three custom render columns and the basic id/name columns
  expect(columns).toBeInTheDocument();

  // check that fields exist and renderCell flagged true for the per-month columns
  expect(columns.querySelector('[data-field="monthly"]')).toBeInTheDocument();
  expect(columns.querySelector('[data-field="monthly"]').getAttribute("data-has-render")).toBe("true");

  expect(columns.querySelector('[data-field="amountSpent"]')).toBeInTheDocument();
  expect(columns.querySelector('[data-field="amountSpent"]').getAttribute("data-has-render")).toBe("true");

  expect(columns.querySelector('[data-field="rewardPoints"]')).toBeInTheDocument();
  expect(columns.querySelector('[data-field="rewardPoints"]').getAttribute("data-has-render")).toBe("true");
});

test("forwards data rows and monthly array content to Table", () => {
  const sample = [
    {
      customerId: "C9",
      name: "Bob",
      monthly: [
        { month: "March", year: 2024, amountSpent: "$60.00", rewardPoints: 10 },
      ]
    }
  ];

  render(<MonthlyRewardsTable monthlyRewards={sample} />);

  const rowContainer = screen.getByTestId("table-data");
  expect(rowContainer).toBeInTheDocument();

  // row element should contain customerId and name attributes
  const rowEl = rowContainer.querySelector('[data-customerid="C9"]');
  expect(rowEl).toBeInTheDocument();
  expect(rowEl.getAttribute("data-name")).toBe("Bob");

  // monthly array forwarded; check the month string presence inside data-months
  const monthsJson = rowEl.getAttribute("data-months");
  expect(monthsJson).toContain("March");
  expect(monthsJson).toContain("$60.00");
  expect(monthsJson).toContain("10");
});
import React from "react";
import { render, screen } from "@testing-library/react";
import Table from "./Table";

// Mock MUI DataGrid so tests don't depend on heavy implementation/style
jest.mock("@mui/x-data-grid", () => ({
  DataGrid: (props) => {
    const computedRowId =
      typeof props.getRowId === "function" && Array.isArray(props.rows) && props.rows.length
        ? String(props.getRowId(props.rows[0]))
        : "";
    const pageSize = props.initialState?.pagination?.paginationModel?.pageSize ?? "";
    return (
      <div
        data-testid="mock-datagrid"
        data-rows={JSON.stringify(props.rows)}
        data-columns={JSON.stringify(props.columns)}
        data-page-size={String(pageSize)}
        data-computed-row-id={computedRowId}
        data-page-size-options={JSON.stringify(props.pageSizeOptions)}
      />
    );
  },
}));

describe("Table component", () => {
  test("shows noDataText when rows empty", () => {
    render(<Table title="Test" data={[]} noDataText="No items available." />);
    expect(screen.getByText("No items available.")).toBeInTheDocument();
  });

  test("renders DataGrid with rows, columns, uses transactionId for getRowId and honors rowsPerPageOptions", () => {
    const columns = [
      { headerName: "Transaction ID", field: "transactionId" },
      { headerName: "Customer", field: "customerName" },
    ];
    const data = [{ transactionId: "TX1", customerId: "C1", customerName: "John Doe" }];

    render(<Table title="Transactions" columns={columns} data={data} rowsPerPageOptions={[5, 10]} />);

    const dg = screen.getByTestId("mock-datagrid");
    expect(dg).toBeInTheDocument();
    expect(dg.dataset.rows).toBe(JSON.stringify(data));
    expect(dg.dataset.columns).toBe(JSON.stringify(columns));
    expect(dg.dataset.computedRowId).toBe("TX1"); // transactionId preferred
    expect(dg.dataset.pageSize).toBe("5"); // first rowsPerPageOptions value
    expect(dg.dataset.pageSizeOptions).toBe(JSON.stringify([5, 10]));
  });

  test("falls back to customerId when transactionId missing and uses data.length as pageSize when no rowsPerPageOptions", () => {
    const columns = [{ headerName: "Customer", field: "customerId" }];
    const data = [
      { customerId: "C2", customerName: "Jane" },
      { customerId: "C3", customerName: "Alex" },
    ];

    render(<Table title="Customers" columns={columns} data={data} />);

    const dg = screen.getByTestId("mock-datagrid");
    expect(dg.dataset.computedRowId).toBe("C2"); // fallback to customerId
    expect(dg.dataset.pageSize).toBe(String(data.length)); // page size defaults to data.length
  });
});
import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import DateFilter from './DateFilter';

// Mock LocalizationProvider to just render children
jest.mock("@mui/x-date-pickers/LocalizationProvider", () => ({
  LocalizationProvider: ({ children }) => <div>{children}</div>,
}));

// mock Adapter to avoid importing date-fns ESM files during tests
jest.mock("@mui/x-date-pickers/AdapterDateFns", () => ({
  AdapterDateFns: function AdapterDateFns() {
    return null;
  }
}));

// Mock DatePicker to call renderInput and expose a pick button that triggers onChange.
// The button behavior is controlled by globalThis.__DATE_PICKER_MODE:
// - "valid": Start -> 2024-01-01, End -> 2024-01-05
// - "invalid": Start -> 2024-01-10, End -> 2024-01-05 (start > end)
jest.mock("@mui/x-date-pickers/DatePicker", () => {
  return {
    DatePicker: ({ label, value, onChange, renderInput }) => {
      const params = { inputProps: { "data-label": label }, helperText: "", error: false };
      const id = `pick-${label.replace(/\s+/g, "-")}`;
      const handleClick = () => {
        // Use globalThis to avoid errors in environments where `window` is undefined.
        const mode =
          (typeof globalThis !== "undefined" && globalThis.__DATE_PICKER_MODE) || "valid";
        if (mode === "valid") {
          if (label.toLowerCase().includes("start")) onChange(new Date("2024-01-01"));
          else onChange(new Date("2024-01-05"));
        } else {
          if (label.toLowerCase().includes("start")) onChange(new Date("2024-01-10"));
          else onChange(new Date("2024-01-05"));
        }
      };
      return (
        <div data-testid={`mock-datepicker-${label.replace(/\s+/g, "-")}`}>
          {renderInput(params)}
          <button data-testid={id} onClick={handleClick}>
            Pick {label}
          </button>
        </div>
      );
    },
  };
});

afterEach(() => {
  cleanup();
  delete globalThis.__DATE_PICKER_MODE;
  jest.clearAllMocks();
});

test("initially Filter enabled and Apply called with nulls when no dates set", () => {
  const onApply = jest.fn();
  const onClear = jest.fn();

  render(<DateFilter onApply={onApply} onClear={onClear} />);

  const applyBtn = screen.getByTestId("datefilter-apply");
  const clearBtn = screen.getByTestId("datefilter-clear");

  expect(applyBtn).toBeEnabled();
  expect(clearBtn).toBeEnabled();

  fireEvent.click(applyBtn);
  expect(onApply).toHaveBeenCalledTimes(1);
  // initial apply sends nulls
  expect(onApply).toHaveBeenCalledWith(null, null);
});

test("invalid range disables Filter and shows helper text; Apply does nothing", () => {
  globalThis.__DATE_PICKER_MODE = "invalid";
  const onApply = jest.fn();
  const onClear = jest.fn();

  render(<DateFilter onApply={onApply} onClear={onClear} />);

  // pick start (will set 2024-01-10) and end (2024-01-05) -> invalid
  const startPick = screen.getByTestId("pick-Start-date");
  const endPick = screen.getByTestId("pick-End-date");

  fireEvent.click(startPick);
  fireEvent.click(endPick);

  // helper text should be visible
  expect(
    screen.getByText("Start date must be before or equal to end date")
  ).toBeInTheDocument();

  const applyBtn = screen.getByTestId("datefilter-apply");
  expect(applyBtn).toBeDisabled();

  fireEvent.click(applyBtn);
  expect(onApply).not.toHaveBeenCalled();

  // clear should call onClear
  const clearBtn = screen.getByTestId("datefilter-clear");
  fireEvent.click(clearBtn);
  expect(onClear).toHaveBeenCalledTimes(1);
});

test("valid range enables Filter and onApply receives correct Date objects", () => {
  globalThis.__DATE_PICKER_MODE = "valid";
  const onApply = jest.fn();
  render(<DateFilter onApply={onApply} />);

  const startPick = screen.getByTestId("pick-Start-date");
  const endPick = screen.getByTestId("pick-End-date");

  fireEvent.click(startPick); // sets 2024-01-01
  fireEvent.click(endPick); // sets 2024-01-05

  // no helper text for invalid range
  expect(
    screen.queryByText("Start date must be before or equal to end date")
  ).not.toBeInTheDocument();

  const applyBtn = screen.getByTestId("datefilter-apply");
  expect(applyBtn).toBeEnabled();

  fireEvent.click(applyBtn);
  expect(onApply).toHaveBeenCalledTimes(1);

  const [s, e] = onApply.mock.calls[0][0] ? [onApply.mock.calls[0][0], onApply.mock.calls[0][1]] : onApply.mock.calls[0];
  // But onApply is called with (startDate, endDate) directly — verify via the recorded args:
  const args = onApply.mock.calls[0];
  const startArg = args[0];
  const endArg = args[1];

  expect(startArg).toBeInstanceOf(Date);
  expect(endArg).toBeInstanceOf(Date);
  expect(startArg <= endArg).toBe(true);
  // verify specific dates chosen by mock
  expect(startArg.toISOString().startsWith("2024-01-01")).toBe(true);
  expect(endArg.toISOString().startsWith("2024-01-05")).toBe(true);
});
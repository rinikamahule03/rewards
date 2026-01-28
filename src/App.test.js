import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock children to keep tests focused and avoid rendering full implementations
jest.mock("./components/rewards-dashboard/RewardsDashboard", () => () => (
  <div data-testid="rewards-dashboard">RewardsDashboard</div>
));
jest.mock("./components/error/ErrorBoundary", () => ({ children }) => (
  <div data-testid="error-boundary">{children}</div>
));

test("renders RewardsDashboard inside ErrorBoundary", () => {
  render(<App />);

  expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
  expect(screen.getByTestId("rewards-dashboard")).toBeInTheDocument();
});
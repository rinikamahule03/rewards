import React from "react";
import RewardsDashboard from "./components/rewards-dashboard/RewardsDashboard";
import ErrorBoundary from "./components/error/ErrorBoundary";

const App = () => {
  return (
    <>
      <ErrorBoundary>
        <RewardsDashboard />
      </ErrorBoundary>
    </>
  );
};

export default App;

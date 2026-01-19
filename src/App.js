import React from "react";
import { useRewardsData } from "./hooks/useRewardsData";
import Loader from "./components/Loader";
import TransactionsTable from "./components/TransactionsTable";
import MonthlyRewardsTable from "./components/MonthlyRewardsTable";
import TotalRewardsTable from "./components/TotalRewardsTable";
import "./App.css";

const App = () => {
  const { loading, error, transactions, monthlyRewards, totalRewards } = useRewardsData();

  if (loading) return <Loader />;
  if (error) return <div className="error-container"><h1 className="error-title">Ooops!</h1><p className="error-message">Error: {error.message}</p></div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customer Rewards Dashboard</h1>
      <MonthlyRewardsTable monthlyRewards={monthlyRewards} />
      <TotalRewardsTable totalRewards={totalRewards} />
      <TransactionsTable transactions={transactions} />
    </div>
  );
};

export default App;

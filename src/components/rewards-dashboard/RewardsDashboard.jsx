import React from "react";
import { useRewardsData } from "../../hooks/useRewardsData";
import Loader from "../../components/loader/Loader";
import TransactionsTable from "../transactions-table/TransactionsTable";
import MonthlyRewardsTable from "../monthly-rewards-table/MonthlyRewardsTable";
import TotalRewardsTable from "../total-rewards-table/TotalRewardsTable";
import ErrorPage from "../../components/error/ErrorPage";
import "./RewardsDashboard.css";

const RewardsDashboard = () => {
  const { loading, error, transactions, monthlyRewards, totalRewards } = useRewardsData();

  if (loading) return <Loader />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div className="page-container">
      <h1 className="dashboard-title">Customer Rewards Dashboard</h1>
      <MonthlyRewardsTable monthlyRewards={monthlyRewards} />
      <TotalRewardsTable totalRewards={totalRewards} />
      <TransactionsTable transactions={transactions} />
    </div>
  );
};

export default RewardsDashboard;

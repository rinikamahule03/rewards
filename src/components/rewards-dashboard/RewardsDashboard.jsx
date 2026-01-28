import React, { useState, useMemo } from "react";
import { useRewardsData } from "../../hooks/useRewardsData";
import Loader from "../../components/loader/Loader";
import TransactionsTable from "../transactions-table/TransactionsTable";
import MonthlyRewardsTable from "../monthly-rewards-table/MonthlyRewardsTable";
import TotalRewardsTable from "../total-rewards-table/TotalRewardsTable";
import ErrorPage from "../../components/error/ErrorPage";
import "./RewardsDashboard.css";

import Box from "@mui/material/Box";

// utils
import {
  aggregateMonthlyRewards,
  buildTotalRewards,
} from "../../utils/rewards-calculator/rewardsCalculator";

import DateFilter from "../date-filter/DateFilter";

const startOfDay = (d) => {
  if (!d) return null;
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return dt;
};

const endOfDay = (d) => {
  if (!d) return null;
  const dt = new Date(d);
  dt.setHours(23, 59, 59, 999);
  return dt;
};

const RewardsDashboard = () => {
  const { loading, error, transactions = [] } = useRewardsData();

  // applied filters (only updated when user clicks Filter)
  const [appliedStartDate, setAppliedStartDate] = useState(null);
  const [appliedEndDate, setAppliedEndDate] = useState(null);

  // filtered transactions based on applied date range (inclusive)
  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      if (appliedStartDate && txDate < startOfDay(appliedStartDate)) return false;
      if (appliedEndDate && txDate > endOfDay(appliedEndDate)) return false;
      return true;
    });
  }, [transactions, appliedStartDate, appliedEndDate]);

  // re-calculate aggregates from filtered transactions
  const monthlyRewards = useMemo(
    () => aggregateMonthlyRewards(filteredTransactions),
    [filteredTransactions]
  );
  const totalRewards = useMemo(
    () => buildTotalRewards(filteredTransactions),
    [filteredTransactions]
  );

  if (loading) return <Loader />;
  if (error) return <ErrorPage error={error} />;

  const handleApplyFilter = (start, end) => {
    // defensive validation (DateFilter should prevent invalid, but double-check)
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    if (s && e && s > e) {
      // ignore invalid range
      return;
    }
    setAppliedStartDate(s || null);
    setAppliedEndDate(e || null);
  };

  const handleClearFilter = () => {
    setAppliedStartDate(null);
    setAppliedEndDate(null);
  };

  return (
    <div className="page-container">
      <h1 className="dashboard-title">Customer Rewards Dashboard</h1>

      <DateFilter
        initialStart={appliedStartDate}
        initialEnd={appliedEndDate}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
      />

      <Box className="transaction-count">
        Showing {filteredTransactions.length} / {transactions.length} transactions
        {appliedStartDate || appliedEndDate ? (
          <span style={{ marginLeft: 12 }}>
            Filter:
            {appliedStartDate ? ` from ${startOfDay(appliedStartDate).toLocaleDateString()}` : ""}
            {appliedEndDate ? ` to ${endOfDay(appliedEndDate).toLocaleDateString()}` : ""}
          </span>
        ) : null}
      </Box>

      <MonthlyRewardsTable monthlyRewards={monthlyRewards} />
      <TotalRewardsTable totalRewards={totalRewards} />
      <TransactionsTable transactions={filteredTransactions} />
    </div>
  );
};

export default RewardsDashboard;

import React from "react";
import PropTypes from "prop-types";
import Table from "./table/Table";

const ROW_OPTIONS = [5, 10, 25];

const MonthlyRewardsTable = ({ monthlyRewards }) => {
  const columns = [
    { header: "Customer ID", key: "customerId" },
    { header: "Customer name", key: "name" },
    { header: "Month", key: "month" },
    { header: "Year", key: "year" },
    { header: "Reward Points", key: "rewardPoints" }
  ];

  return (
    <Table
      title="User monthly rewards"
      columns={columns}
      data={monthlyRewards}
      rowsPerPageOptions={ROW_OPTIONS}
      noDataText="No monthly rewards data available."
    />
  );
};

MonthlyRewardsTable.propTypes = {
  monthlyRewards: PropTypes.array.isRequired
};

export default MonthlyRewardsTable;
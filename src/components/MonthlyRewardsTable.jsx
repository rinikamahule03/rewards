import React from "react";
import PropTypes from "prop-types";
import Table from "./table/Table";

const ROW_OPTIONS = [5, 10, 25];

const MonthlyRewardsTable = ({ monthlyRewards }) => {
  const columns = [
    { headerName: "Customer ID", field: "customerId", flex: 1 },
    { headerName: "Customer name", field: "name", flex: 1 },
    { headerName: "Month", field: "month", flex: 1 },
    { headerName: "Year", field: "year", flex: 1 },
    { headerName: "Reward Points", field: "rewardPoints", flex: 1 }
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
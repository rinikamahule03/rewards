import React from "react";
import PropTypes from "prop-types";
import Table from "./table/Table";

const ROW_OPTIONS = [5, 10, 25];

const TotalRewardsTable = ({ totalRewards }) => {
  const columns = [
    { headerName: "Customer ID", field: "customerId", flex: 1 },
    { headerName: "Customer name", field: "customerName", flex: 1 },
    { headerName: "Total amount spent", field: "amountSpent", flex: 1 },
    { headerName: "Total reward points", field: "rewardPoints", flex: 1 }
  ];

  return (
    <Table
      title="Total rewards"
      columns={columns}
      data={totalRewards}
      rowsPerPageOptions={ROW_OPTIONS}
      noDataText="No total rewards data."
    />
  );
};

TotalRewardsTable.propTypes = {
  totalRewards: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rewardPoints: PropTypes.number.isRequired
    })
  ).isRequired
};

export default TotalRewardsTable;
import React from "react";
import PropTypes from "prop-types";
import Table from "./table/Table";

const ROW_OPTIONS = [5, 10, 25];

const TotalRewardsTable = ({ totalRewards }) => {
  const columns = [
    { header: "Customer ID", key: "customerId" },
    { header: "Customer name", key: "customerName" },
    { header: "Total amount spent", key: "amountSpent" },
    { header: "Total reward points", key: "rewardPoints" }
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
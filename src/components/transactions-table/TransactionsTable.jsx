import React from "react";
import PropTypes from "prop-types";
import { calculateRewardPoints, priceSortComparator } from "../../utils/rewards-calculator/rewardsCalculator";
import Table from "../table/Table";

const ROW_OPTIONS = [5, 10, 25];

const TransactionsTable = ({ transactions }) => {
  const columns = [
    { headerName: "Transaction ID", field: "transactionId", flex: 1 },
    { headerName: "Customer name", field: "customerName", flex: 1 },
    { headerName: "Purchase date", field: "purchaseDate", flex: 1, valueGetter: (value, tx) => new Date(tx?.date).toLocaleDateString() },
    { headerName: "Product purchased", field: "product", flex: 1 },
    { headerName: "Price", field: "amount", flex: 1, valueGetter: (value, tx) => `$${tx?.amount?.toFixed(2)}`, sortComparator: priceSortComparator },
    { headerName: "Reward points", field: "rewardPoints", flex: 1, valueGetter: (value, tx) => calculateRewardPoints(tx?.amount) }
  ];

  return (
    <Table
      title="Transactions"
      columns={columns}
      data={transactions}
      rowsPerPageOptions={ROW_OPTIONS}
      noDataText="No transactions available."
    />
  );
};

TransactionsTable.propTypes = {
  transactions: PropTypes.array.isRequired
};

export default TransactionsTable;
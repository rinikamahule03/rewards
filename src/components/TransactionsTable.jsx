import React from "react";
import PropTypes from "prop-types";
import { calculateRewardPoints } from "../utils/rewardsCalculator";
import Table from "./table/Table";

const ROW_OPTIONS = [5, 10, 25];

const TransactionsTable = ({ transactions }) => {
  const columns = [
    { header: "Transaction ID", key: "transactionId" },
    { header: "Customer name", key: "customerName" },
    { header: "Purchase date", render: (tx) => new Date(tx.date).toLocaleDateString() },
    { header: "Product purchased", key: "product" },
    { header: "Price", render: (tx) => `$${tx.amount.toFixed(2)}` },
    { header: "Reward points", render: (tx) => calculateRewardPoints(tx.amount) }
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
import React from "react";
import PropTypes from "prop-types";
import Table from "../table/Table";

const ROW_OPTIONS = [5, 10, 25];

const MonthlyRewardsTable = ({ monthlyRewards }) => {
  const columns = [
    { headerName: "Customer ID", field: "customerId", flex: 1 },
    { headerName: "Customer name", field: "name", flex: 1 },
    { headerName: "Transaction month", sortable: false, field: "monthly", flex: 1, renderCell: (params) => {
      return params?.value?.map((m, i) => <div key={i} className="row-line">
        {m?.month} {m?.year}
      </div>);
    }},
    { headerName: "Monthly amount spent", sortable: false, field: "amountSpent", flex: 1, renderCell: (params) => {
      return params?.row?.monthly?.map((m, i) => <div key={i} className="row-line">
        {m?.amountSpent}
      </div>);
    }},
    { headerName: "Monthly reward Points", sortable: false, field: "rewardPoints", flex: 1, renderCell: (params) => {
      return params?.row?.monthly?.map((m, i) => <div key={i} className="row-line">
        {m?.rewardPoints}
      </div>);
    }}
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
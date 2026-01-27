import React from "react";
import PropTypes from "prop-types";
import "./Table.css";
import { DataGrid } from '@mui/x-data-grid';

const Table = ({ title, columns, data = [], rowsPerPageOptions = null, noDataText }) => {
  if (!data || !data.length) return <p>{noDataText || `No ${title?.toLowerCase() || "data"} available.`}</p>;

  return (
    <div>
      {title && <h2>{title}</h2>}

      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: rowsPerPageOptions && rowsPerPageOptions.length > 0 ? rowsPerPageOptions[0] : data.length,
            },
          },
        }}
        getRowHeight={() => 'auto'}
        getRowId={(row) => row?.transactionId || row?.customerId}
        pageSizeOptions={rowsPerPageOptions}
      />
    </div>
  );
};

Table.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      key: PropTypes.string,
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.array,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  noDataText: PropTypes.string
};

export default Table;
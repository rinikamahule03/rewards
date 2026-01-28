import React from "react";
import PropTypes from "prop-types";
import "./Table.css";
import { DataGrid } from '@mui/x-data-grid';

const Table = ({ title, columns, data = [], rowsPerPageOptions = null, noDataText }) => {
  return (
    <div className="table-container">
      {title && <h2>{title}</h2>}

      {(!data || !data.length) ?
        <p className="no-data-text">{noDataText || `No ${title?.toLowerCase() || "data"} available.`}</p>
      :
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
      }
    </div>
  );
};

Table.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      headerName: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      valueGetter: PropTypes.func,
      renderCell: PropTypes.func,
      sortable: PropTypes.bool,
      flex: PropTypes.number
    })
  ).isRequired,
  data: PropTypes.array,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  noDataText: PropTypes.string
};

export default Table;
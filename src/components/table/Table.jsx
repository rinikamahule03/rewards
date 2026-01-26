import React from "react";
import PropTypes from "prop-types";
import "./Table.css";
import { DataGrid } from '@mui/x-data-grid';

const Table = ({ title, columns, data = [], rowsPerPageOptions = null, noDataText }) => {
  // const usePagination = Array.isArray(rowsPerPageOptions) && rowsPerPageOptions.length > 0;
  // const [rowsPerPage, setRowsPerPage] = useState(usePagination ? rowsPerPageOptions[0] : data.length);
  // const [currentPage, setCurrentPage] = useState(0);

  // const totalRows = data.length;
  // const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  // const pagedData = useMemo(() => {
  //   if (!usePagination) return data;
  //   const start = currentPage * rowsPerPage;
  //   return data.slice(start, start + rowsPerPage);
  // }, [data, currentPage, rowsPerPage, usePagination]);

  // const gotoPage = (page) => {
  //   const p = Math.max(0, Math.min(page, pageCount - 1));
  //   setCurrentPage(p);
  // };

  // // reset currentPage if rowsPerPage or data size changes
  // if (currentPage > 0 && currentPage >= pageCount) {
  //   setCurrentPage(0);
  // }

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
        getRowId={(row) => row.transactionId || row.customerId}
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
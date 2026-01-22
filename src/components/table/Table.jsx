import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import "./Table.css";

const Table = ({ title, columns, data = [], rowsPerPageOptions = null, noDataText }) => {
  const usePagination = Array.isArray(rowsPerPageOptions) && rowsPerPageOptions.length > 0;
  const [rowsPerPage, setRowsPerPage] = useState(usePagination ? rowsPerPageOptions[0] : data.length);
  const [currentPage, setCurrentPage] = useState(0);

  const totalRows = data.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  const pagedData = useMemo(() => {
    if (!usePagination) return data;
    const start = currentPage * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage, rowsPerPage, usePagination]);

  const gotoPage = (page) => {
    const p = Math.max(0, Math.min(page, pageCount - 1));
    setCurrentPage(p);
  };

  // reset currentPage if rowsPerPage or data size changes
  if (currentPage > 0 && currentPage >= pageCount) {
    setCurrentPage(0);
  }

  if (!data || !data.length) return <p>{noDataText || `No ${title?.toLowerCase() || "data"} available.`}</p>;

  return (
    <div>
      {title && <h2>{title}</h2>}

      {usePagination && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <label htmlFor={`${title}-rowsPerPage`} style={{ marginRight: 8 }}>Rows per page:</label>
            <select
              id={`${title}-rowsPerPage`}
              className="rows-per-page-select"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(0);
              }}
            >
              {rowsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: 14 }}>
            Showing {currentPage * rowsPerPage + 1} - {Math.min((currentPage + 1) * rowsPerPage, totalRows)} of {totalRows}
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key || c.header}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pagedData.map((row, rIdx) => (
            <tr key={row.id || row.key || rIdx}>
              {columns.map((c, cIdx) => {
                const content = typeof c.render === "function" ? c.render(row) : row[c.key];
                return (
                  <td key={c.key || cIdx} data-label={c.header}>
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {usePagination && pageCount > 1 && (
        <div className='pagination'>
          <button className='pagination-btn' onClick={() => gotoPage(currentPage - 1)} disabled={currentPage === 0}>‹</button>

          {Array.from({ length: pageCount }).map((_, i) => {
            const showWindow = 5;
            const start = Math.max(0, currentPage - Math.floor(showWindow / 2));
            const end = Math.min(pageCount, start + showWindow);
            if (i < start || i >= end) return null;
            return (
              <button
                key={i}
                className='pagination-btn'
                onClick={() => gotoPage(i)}
                aria-current={currentPage === i ? "page" : undefined}
                style={{
                  fontWeight: currentPage === i ? "bold" : "normal",
                  textDecoration: currentPage === i ? "underline" : "none"
                }}
              >
                {i + 1}
              </button>
            );
          })}

          <button className='pagination-btn' onClick={() => gotoPage(currentPage + 1)} disabled={currentPage >= pageCount - 1}>›</button>
        </div>
      )}
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
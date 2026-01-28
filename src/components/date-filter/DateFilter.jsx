import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const isValidDate = (d) => d instanceof Date && !isNaN(d);

const DateFilter = ({ initialStart = null, initialEnd = null, onApply, onClear }) => {
  const [localStart, setLocalStart] = useState(initialStart);
  const [localEnd, setLocalEnd] = useState(initialEnd);

  // memoize Date construction so ESLint/react-hooks won't complain about changing deps
  const startDate = useMemo(() => (localStart ? new Date(localStart) : null), [localStart]);
  const endDate = useMemo(() => (localEnd ? new Date(localEnd) : null), [localEnd]);

  // memoize comparison as well
  const startAfterEnd = useMemo(
    () => !!(startDate && endDate && startDate > endDate),
    [startDate, endDate]
  );

  const canApply = useMemo(() => {
    if (startDate && !isValidDate(startDate)) return false;
    if (endDate && !isValidDate(endDate)) return false;
    if (startAfterEnd) return false;
    // allow apply even if both null (clears filter) or one side set
    return true;
  }, [startDate, endDate, startAfterEnd]);

  const handleApply = () => {
    if (!canApply) return;
    if (typeof onApply === "function") onApply(startDate, endDate);
  };

  const handleClear = () => {
    setLocalStart(null);
    setLocalEnd(null);
    if (typeof onClear === "function") onClear();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          marginBottom: 2,
          flexWrap: "wrap",
        }}
      >
        <DatePicker
          label="Start date"
          value={localStart}
          onChange={(newVal) => setLocalStart(newVal)}
          disableFuture
          renderInput={(params) => (
            <TextField
              size="small"
              {...params}
              error={!!params.error || startAfterEnd}
              helperText={
                startAfterEnd ? "Start date must be before or equal to end date" : params.helperText
              }
            />
          )}
        />
        <DatePicker
          label="End date"
          value={localEnd}
          onChange={(newVal) => setLocalEnd(newVal)}
          disableFuture
          renderInput={(params) => (
            <TextField
              size="small"
              {...params}
              error={!!params.error || startAfterEnd}
              helperText={
                startAfterEnd ? "End date must be after or equal to start date" : params.helperText
              }
            />
          )}
        />
        <Button
          variant="contained"
          onClick={handleApply}
          data-testid="datefilter-apply"
          disabled={!canApply}
          sx={{ backgroundColor: "var(--primary-color)" }}
        >
          Filter
        </Button>
        <Button sx={{ borderColor: "var(--primary-color)", color: "var(--primary-color)" }} variant="outlined" onClick={handleClear} data-testid="datefilter-clear">
          Clear
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default DateFilter;

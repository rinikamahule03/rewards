import { useEffect, useState } from "react";
import { fetchTransactions } from "../api/rewardsApi";
import { logger } from "../utils/logger";

export const useRewardsData = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    transactions: []
  });

  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        setState({
          loading: false,
          error: null,
          transactions: data,
        });
      })
      .catch((error) => {
        logger.error(error);
        setState((prev) => ({ ...prev, loading: false, error }))
      });
  }, []);

  return state;
};

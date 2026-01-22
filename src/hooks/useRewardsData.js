import { useEffect, useState } from "react";
import { fetchTransactions } from "../api/rewardsApi";
import { aggregateMonthlyRewards, buildTotalRewards } from "../utils/rewardsCalculator";
import { logger } from "../utils/logger";

export const useRewardsData = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    transactions: [],
    monthlyRewards: [],
    totalRewards: []
  });

  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        const monthlyMap = aggregateMonthlyRewards(data);
        const monthlyRewards = Object.values(monthlyMap).sort((a, b) => a.sortKey - b.sortKey);

        setState({
          loading: false,
          error: null,
          transactions: data,
          monthlyRewards,
          totalRewards: buildTotalRewards(data)
        });
      })
      .catch((error) => {
        logger.error(error);
        setState((prev) => ({ ...prev, loading: false, error }))
      });
  }, []);

  return state;
};

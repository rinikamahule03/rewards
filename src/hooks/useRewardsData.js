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

        const totalRewardsArray = Object.entries(buildTotalRewards(data)).map(([name, rewardPoints]) => ({ name, rewardPoints }));

        setState({
          loading: false,
          error: null,
          transactions: data,
          monthlyRewards,
          totalRewards: totalRewardsArray
        });
      })
      .catch((error) => {
        logger.error(error);
        setState((prev) => ({ ...prev, loading: false, error }))
      });
  }, []);

  return state;
};

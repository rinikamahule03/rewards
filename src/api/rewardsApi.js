import { logger } from "../utils/logger";

export const fetchTransactions = async () => {
  try {
    const response = await fetch("/data/transactions.json");
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    return response.json();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

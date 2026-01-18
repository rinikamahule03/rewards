export const logger = {
  error: (msg) => {
    if (process.env.NODE_ENV !== "production") {
      console.error(msg);
    }
  }
};

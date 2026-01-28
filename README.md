Project Overview

This project is a Customer Rewards Dashboard built with React. It calculates reward points per transaction, aggregates monthly and total rewards per customer, and displays transactions and rewards tables.

Features:
- Calculates reward points:
  - 2 points for every dollar above $100
  - 1 point for every dollar between $50 and $100
- Aggregates monthly and total rewards per customer
- Displays three tables:
  - Transactions table
  - Monthly rewards table
  - Total rewards table
- Handles decimal amounts safely
- Simulated async API call for fetching data
- Unit tests with Jest (or compatible runner)
- Uses Material UI DataGrid for tables

Project structure (updated)
src/
 ├─ api/
 │   └─ rewardsApi.js                  # simulated async API call
 ├─ components/
 │   ├─ error/
 │   │   ├─ ErrorBoundary.jsx
 │   │   └─ ErrorPage.jsx
 │   ├─ loader/
 │   │   └─ Loader.jsx
 │   ├─ monthly-rewards-table/
 │   │   ├─ MonthlyRewardsTable.jsx
 │   │   └─ MonthlyRewardsTable.test.jsx
 │   ├─ total-rewards-table/
 │   │   ├─ TotalRewardsTable.jsx
 │   │   └─ TotalRewardsTable.test.js
 │   ├─ transactions-table/
 │   │   ├─ TransactionsTable.jsx
 │   │   └─ TransactionsTable.test.js
 │   ├─ rewards-dashboard/
 │   │   ├─ RewardsDashboard.jsx
 │   │   └─ RewardsDashboard.test.jsx
 │   └─ table/
 │       ├─ Table.jsx
 │       ├─ Table.css
 │       └─ Table.test.jsx
 ├─ hooks/
 │   └─ useRewardsData.js               # custom hook for fetching & aggregating data
 ├─ utils/
 │   ├─ rewardsCalculator.js            # pure functions: calculateRewardPoints, aggregations
 │   ├─ dateUtils.js                    # month/year helpers
 │   └─ logger.js                       # logger for error handling
 ├─ index.js
 ├─ index.css
 ├─ App.js
 └─ README.md

public/
 ├─ index.html
 └─ data/
     ├─ transactions.json               # small sample dataset
     └─ transactions_100.json           # 100-sample dataset (non-identical records)

Tests
- Unit tests live next to components or under test files as *.test.js / *.test.jsx
  Examples:
  - src/components/monthly-rewards-table/MonthlyRewardsTable.test.jsx
  - src/components/transactions-table/TransactionsTable.test.js
  - src/utils/rewards-calculator/rewardsCalculator.test.js
 
Screenshots for reference:

- Monthly rewards table
<img width="1320" height="603" alt="image" src="https://github.com/user-attachments/assets/06b286dd-3e4d-4af5-99d9-5ded0b12cafd" />




- Total rewards table
<img width="1330" height="451" alt="image" src="https://github.com/user-attachments/assets/8d46f819-3c74-47c1-a313-affe67dd27c8" />



- Transactions table
<img width="1316" height="461" alt="image" src="https://github.com/user-attachments/assets/378190a0-2833-4ce6-ae0c-c5caf10bf9c9" />


- When no records found
<img width="1320" height="612" alt="image" src="https://github.com/user-attachments/assets/320a1470-79da-43da-bd2c-0546dc7284df" />


- Errors

<img width="1366" height="637" alt="image" src="https://github.com/user-attachments/assets/c67286df-b875-4b4f-a576-12363b63b43f" />

<img width="1345" height="622" alt="image" src="https://github.com/user-attachments/assets/80bc8903-bfbc-4ac3-a5c5-1afbdab41722" />





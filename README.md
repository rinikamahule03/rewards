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
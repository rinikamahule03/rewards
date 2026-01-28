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

- Tables
  
<img width="1365" height="731" alt="image" src="https://github.com/user-attachments/assets/5a079c36-8c3f-45c0-9053-b73ee415462d" />

<img width="1345" height="642" alt="image" src="https://github.com/user-attachments/assets/16591f92-8900-4093-b949-5b7123b3ae7f" />

<img width="1358" height="585" alt="image" src="https://github.com/user-attachments/assets/74da432a-9d5a-44e0-9252-397c2e4cf61b" />

- Errors

<img width="1366" height="637" alt="image" src="https://github.com/user-attachments/assets/c67286df-b875-4b4f-a576-12363b63b43f" />

<img width="1345" height="622" alt="image" src="https://github.com/user-attachments/assets/80bc8903-bfbc-4ac3-a5c5-1afbdab41722" />





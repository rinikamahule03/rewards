Project Overview

This project is a Customer Rewards Dashboard built with React JS (no TypeScript, no Redux). It calculates reward points per transaction, aggregates monthly and total rewards per customer, and displays transactions and rewards tables.

Features:

Calculates reward points based on purchase amount:

2 points for every dollar spent above $100

1 point for every dollar spent between $50 and $100

Supports multi-month and multi-year transactions

Aggregates rewards monthly and total

Displays 3 tables:

Transactions table

Monthly rewards table

Total rewards table

Responsive, striped, and hoverable tables with CSS styling

Handles decimal amounts safely

Simulated async API call for fetching data

Includes unit tests with Jest

Fully modular and reusable React components

Handles loading and error states gracefully


src/
 ├─ api/
 │   └─ rewardsApi.js          # Simulated API call
 ├─ components/
 │   ├─ Loader.jsx
 │   ├─ MonthlyRewardsTable.jsx
 │   ├─ TotalRewardsTable.jsx
 │   └─ TransactionsTable.jsx
 ├─ data/
 │   └─ transactions.json      # Sample dataset
 ├─ hooks/
 │   └─ useRewardsData.js      # Custom hook for fetching & aggregating data
 ├─ utils/
 │   ├─ rewardsCalculator.js  # Pure functions for rewards & aggregation
 │   ├─ dateUtils.js           # Helper for month/year keys
 │   └─ logger.js              # Logger for error handling
 ├─ __tests__/
 │   ├─ rewardsCalculator.test.js
 │   └─ aggregation.test.js
 ├─ App.jsx
 ├─ App.css                    # Table styles 
 └─ index.js
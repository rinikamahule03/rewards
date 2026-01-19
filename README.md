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

 Screenshots for reference:

<img width="1364" height="728" alt="image" src="https://github.com/user-attachments/assets/0a3cfb09-128b-4351-9892-67bc04117ac2" />

<img width="1304" height="276" alt="image" src="https://github.com/user-attachments/assets/7da35a2e-92d1-407c-9182-1955c6e655fe" />

<img width="1333" height="524" alt="image" src="https://github.com/user-attachments/assets/f9a26d62-5130-4576-b007-ddaeb2a90952" />

<img width="1366" height="732" alt="image" src="https://github.com/user-attachments/assets/455ad93d-dc27-47bc-8c6a-ca7a0acc6bcc" />




import PropTypes from "prop-types";
import { calculateRewardPoints } from "../utils/rewardsCalculator";

const TransactionsTable = ({ transactions }) => {
  if (!transactions.length) return <p>No transactions available.</p>;

  return (
    <div>
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Customer name</th>
            <th>Purchase date</th>
            <th>Product purchased</th>
            <th>Price</th>
            <th>Reward points</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.transactionId}>
                <td data-label="Transaction ID">{tx.transactionId}</td>
                <td data-label="Customer">{tx.customerName}</td>
                <td data-label="Date">{new Date(tx.date).toLocaleDateString()}</td>
                <td data-label="Product">{tx.product}</td>
                <td data-label="Price">{tx.amount}</td>
                <td data-label="Points">{calculateRewardPoints(tx.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TransactionsTable.propTypes = {
  transactions: PropTypes.array.isRequired
};

export default TransactionsTable;

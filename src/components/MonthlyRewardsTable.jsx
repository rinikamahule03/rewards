import PropTypes from "prop-types";

const MonthlyRewardsTable = ({ monthlyRewards }) => {
  if (!monthlyRewards.length) return <p>No monthly rewards data.</p>;

  return (
    <div>
      <h2>User monthly rewards</h2>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Month</th>
            <th>Year</th>
            <th>Reward Points</th>
          </tr>
        </thead>
        <tbody>
          {monthlyRewards.map((r, index) => (
            <tr key={index}>
              <td>{r.customerId}</td>
              <td>{r.name}</td>
              <td>{r.month}</td>
              <td>{r.year}</td>
              <td>{r.rewardPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

MonthlyRewardsTable.propTypes = {
  monthlyRewards: PropTypes.array.isRequired
};

export default MonthlyRewardsTable;

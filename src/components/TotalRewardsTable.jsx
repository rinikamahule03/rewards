import PropTypes from "prop-types";

const TotalRewardsTable = ({ totalRewards }) => {
  if (!totalRewards.length) return <p>No total rewards data.</p>;

  return (
    <div>
      <h2>Total rewards</h2>
      <table>
        <thead>
          <tr>
            <th>Customer name</th>
            <th>Total reward points</th>
          </tr>
        </thead>
        <tbody>
          {totalRewards.map(({ name, rewardPoints }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{rewardPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TotalRewardsTable.propTypes = {
  totalRewards: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rewardPoints: PropTypes.number.isRequired
    })
  ).isRequired
};

export default TotalRewardsTable;

interface BalanceDisplayProps {
  balance: string;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  return <p className="dark:text-white text-gray-900">Balance: ${balance}</p>;
};

export default BalanceDisplay;

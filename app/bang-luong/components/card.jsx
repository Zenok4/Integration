const Card = ({ title, amount, className }) => {
  return (
    <div className={`card flex-1 p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl  ${className}`}>
      <div className="card-title text-gray-500">{title}</div>
      <div className="card-amount text-2xl font-bold mt-2">{amount} đ</div>
    </div>
  );
};

export default Card;

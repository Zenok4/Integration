const CardMenu = ({data}) => {
  return (
    <div className="card-menu flex justify-between">
      <div className="card bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition duration-300">
        <div className="card-header flex justify-between items-center gap-2">
          <span className="text-gray-500">{data?.title}</span>
          <data.icon className="w-5 h-5 text-gray-500" />
        </div>
        <div className="card-amount mt-4 text-xl font-bold">{data?.payroll}</div>
        <div className="card-date text-gray-400 mt-2">{data?.date}</div>
      </div>
    </div>
  );
};

export default CardMenu;

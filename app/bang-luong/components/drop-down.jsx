import { useEffect, useState } from "react";

const Dropdown = ({ onChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const monthOptions = [];

    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      for (let month = 1; month <= 12; month++) {
        monthOptions.push(`${year}-${month.toString().padStart(2, "0")}`);
      }
    }

    setOptions(monthOptions);
  }, []);

  return (
    <select onChange={onChange} className="dropdown w-1/2 p-2 bg-gray-200/60 rounded-lg cursor-pointer">
      {options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </select>
  );
};

export default Dropdown;
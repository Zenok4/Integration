const formatCurrent = (amount) => {
  if(typeof amount !== 'number')
    amount = parseFloat(amount);
  return amount.toLocaleString("vi-VN");
};

export default formatCurrent;

// input type="datetime-local" trả về: "2025-05-06T15:30"
// chuyển về "06-05-2025" hoặc "DD-MM-YYYY

export function formatDateForAPI(dateStr) {
    const [date] = dateStr.split('T'); // tách phần ngày
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`; // DD-MM-YYYY
  }
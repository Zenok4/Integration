import API from "./api";

export const getAttendanceByEmployee = async (employeeId) => {
  try {
    const res = await API.get(`/attendance/employee/${employeeId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching attendance by employee:", err);
    throw err;
  }
};

export const getAttendanceByDate = async (date) => {
  try {
    const res = await API.get(`/attendance/date/${date}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching attendance by date:", err);
    throw err;
  }
};

export const addAttendance = async (data) => {
  try {
    const res = await API.post("/attendance/add", data);
    return res.data;
  } catch (err) {
    console.error("Error adding attendance:", err);
    throw err;
  }
};

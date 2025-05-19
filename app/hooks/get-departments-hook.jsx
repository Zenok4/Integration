import { useEffect, useState } from "react";
import API from "../services/api";

export const useDepartments = () => {
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await API.get("/departments");
      if (response?.data?.departments) {
        setDepartments(response.data.departments);
        console.log("Departments:", response.data.departments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return departments;
};

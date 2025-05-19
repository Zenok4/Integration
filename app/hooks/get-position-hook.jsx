import { useEffect, useState } from "react";
import API from "../services/api";

export const usePositions = () => {
  const [positions, setPositions] = useState([]);

  const fetchPositions = async () => {
    try {
      const response = await API.get("/positions");
      if (response?.data?.positions) {
        setPositions(response.data.positions);
        console.log("Position:", response.data.positions);
      }
    } catch (error) {
      console.error("Error fetching position:", error);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  return positions;
};

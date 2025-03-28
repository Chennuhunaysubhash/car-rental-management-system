import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/ownerHistory.css";

const OwnerHistory = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/bookings/history/owner", {
          headers: { Authorization: `Bearer ${user?.token}` }, // Include JWT token
        });

        if (response.ok) {
          const data = await response.json();
          setHistory(data.bookings);
        } else {
          console.error("Failed to fetch history");
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    if (user?.token) {
      fetchHistory();
    }
  }, [user]);

  return (
    <div className="history-container">
      <h2>Booking History</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Renter Name</th>
            <th>Car No.</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Price</th>
            <th>From Date</th>
            <th>To Date</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((record, index) => (
              <tr key={index}>
                <td>{record.renterId.firstName} {record.renterId.lastName}</td>
                <td>{record.carId.carNumber}</td>
                <td>{record.carId.brand}</td>
                <td>{record.carId.model}</td>
                <td>${record.carId.pricePerHour}</td>
                <td>{new Date(record.startDate).toLocaleDateString()}</td>
                <td>{new Date(record.endDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No booking history available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerHistory;

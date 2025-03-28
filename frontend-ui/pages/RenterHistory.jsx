import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/renterHistory.css";

const RenterHistory = () => {
  const { user } = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/bookings/history/renter", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Data:", data);
        setHistory(data.approvedBookings || []);
        setPendingApprovals(data.pendingBookings || []);
      } else {
        console.error("Failed to fetch history");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  /**
   * 📌 **Resend Booking Request**
   */
  const handleResend = async (bookingId) => {
    const confirmResend = window.confirm("Are you sure you want to resend this booking request?");
    if (!confirmResend) return; // User clicked "No"

    try {
      const response = await fetch(`/api/bookings/history/renter/resend/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        fetchHistory(); // Refresh booking list
      } else {
        const errorData = await response.json();
        console.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error resending booking:", error);
    }
  };

  /**
   * 📌 **Cancel Pending Booking Request**
   */
  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking request?");
    if (!confirmCancel) return; // User clicked "No"

    try {
      const response = await fetch(`/api/bookings/history/renter/close/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        fetchHistory(); // Refresh booking list
      } else {
        const errorData = await response.json();
        console.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  return (
    <div className="renter-history-container">
      <h2>History</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Owner ID</th>
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
                <td>{record.ownerId?._id || "N/A"}</td>
                <td>{record.carId?.carNumber || "N/A"}</td>
                <td>{record.carId?.brand || "N/A"}</td>
                <td>{record.carId?.model || "N/A"}</td>
                <td>${record.carId?.pricePerHour || "N/A"}</td>
                <td>{record.startDate ? new Date(record.startDate).toLocaleDateString() : "N/A"}</td>
                <td>{record.endDate ? new Date(record.endDate).toLocaleDateString() : "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No booking history available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Show "Pending Approvals" only if there is at least 1 pending approval */}
      {pendingApprovals.length > 0 && (
        <>
          <div className="pending-approvals">
            <h3 className="pending-header">Pending Approvals</h3>
            {pendingApprovals.map((car, index) => (
              <div key={index} className="approval-card">
                <img
                  src={car.carId?.image || "/default-car.jpg"}
                  alt={car.carId?.model || "Car"}
                  className="car-image"
                />
                <div className="car-details">
                  <p>
                    <b>
                      {car.carId?.brand || "Unknown"} {car.carId?.model || "Model"}, Year {car.carId?.year || "N/A"}
                    </b>
                  </p>
                  <p>${car.carId?.pricePerHour || "N/A"}/hr</p>
                  <p className="status">{car.carId?.available ? "Available" : "Not Available"}</p>
                </div>
                <div className="owner-details">
                  <p><b>Owner Details</b></p>
                  <p>Name: {car.ownerId?.firstName} {car.ownerId?.lastName}</p>
                  <p>Phone: <a href={`tel:${car.ownerId?.phoneNumber}`}>{car.ownerId?.phoneNumber}</a></p>
                </div>
                <div className="action-buttons">
                  <button className="resend-button" onClick={() => handleResend(car._id)}>Resend</button>
                  <button className="cancel-button" onClick={() => handleCancel(car._id)}>Cancel</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RenterHistory;

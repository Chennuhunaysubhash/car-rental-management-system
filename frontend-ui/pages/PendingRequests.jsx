import React, { useState, useEffect } from "react";
import "../styles/pendingRequests.css";

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Unauthorized: No token found");
        }

        const response = await fetch("http://localhost:5000/api/owner/pending-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Pending Requests Data:", data);
        setPendingRequests(data.pendingRequests);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/owner/update-request/${requestId}`, {
        method: "PUT", // ✅ Use PUT instead of POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update request`);
      }

      const result = await response.json();
      console.log("Update Response:", result);

      // ✅ Update UI after successful response
      setPendingRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
    <h2 className="header-text">Pending Requests</h2>
    <div className="pending-requests-container">
      
      {error && <p className="error-message">Error: {error}</p>}
      {pendingRequests.length > 0 ? (
        <table className="requests-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Car No.</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Price</th>
              <th>From Date</th>
              <th>To Date</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((request) => (
              <tr key={request._id}>
                <td>{request.renterId?.userId || "N/A"}</td>
                <td>{request.carId?.carNumber || "N/A"}</td>
                <td>{request.carId?.brand || "N/A"}</td>
                <td>{request.carId?.model || "N/A"}</td>
                <td>${request.carId?.pricePerHour || "N/A"}</td>
                <td>{request.startDate ? new Date(request.startDate).toLocaleDateString() : "N/A"}</td>
                <td>{request.endDate ? new Date(request.endDate).toLocaleDateString() : "N/A"}</td>
                <td>
  <div className="button-group">
    <button className="accept-btn" onClick={() => handleAction(request._id, "accepted")}>
      Accept
    </button>
    <button className="reject-btn" onClick={() => handleAction(request._id, "rejected")}>
      Reject
    </button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending requests at the moment.</p>
      )}
    </div>
    </>
  );
};

export default PendingRequests;

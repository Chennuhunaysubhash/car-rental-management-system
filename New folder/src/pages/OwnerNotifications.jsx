import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ownerNotifications.css"; // CSS file for styling

import Trash from "../assets/disposal.png";
const OwnerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/notifications/owner", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("API Response:", response.data);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchNotifications(); // Refetch instead of filtering manually
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="notifications-container1">
      <h2>Notifications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <div className="notifications-list1">
          {notifications.map((notif) => (
            <div key={notif._id} className="notification-item1">
              <span>{notif.message}</span>
              {/*<FaTrash className="delete-icon1" onClick={() => deleteNotification(notif._id)} />*/}
              <img src={Trash} alt="Delete" className="delete-icon1" 
              onClick={() => deleteNotification(notif._id)} />

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerNotifications;

import { useState } from "react";
import "../styles/booking.css"; // Make sure this file exists for styles

const BookingCard = ({ car, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      setBookingError("Please select both start and end dates.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/book/${car._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          startDate,
          endDate,
        }),
      });
  
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setBookingSuccess("Booking confirmed successfully!");
        setBookingError("");
      } else {
        setBookingError(data.message || "Failed to book the car.");
      }
    } catch (error) {
      setBookingError("Error processing booking. Please try again.");
    }
  };
  

  return (
    <div className="modal-overlay1">
      <div className="modal main-booking-modal">
        <div className="text-div">
        <h2>Request for Booking</h2>
        </div>
        {/* Car Image and Details */}
        <div className="car-details1">
          <img src={car.image} alt={car.model} className="booking-car-image1" />
          <div className="car-info1">
            <p>
              {car.brand} <b>{car.model}</b>
            </p>
            <span>{car.year}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="price-container1">
          <span>${car.pricePerHour}/hr</span>
          <span className="original-price1">$390</span>
        </div>

        {/* Date Selection */}
        <div className="date-selection">
          <h3>Select Date:</h3>
          <div className="date-inputs">
            <label>
              <span>From Date</span>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label>
              <span>To Date</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
          </div>
        </div>

        {/* Error or Success Message */}
        {bookingError && <p className="error-message">{bookingError}</p>}
        {bookingSuccess && <p className="success-message">{bookingSuccess}</p>}

        {/* Buttons */}
        <div className="booking-buttons1">
          <button className="confirm-booking-btn1" onClick={handleBooking}>
            Book Now
          </button>
          <button className="cancel-booking-btn1" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;

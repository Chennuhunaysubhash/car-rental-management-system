import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../styles/catalog.css"; // Ensure you have modal styles
import { useState } from "react";
import BookingCard from "./BookingCard"; // Import BookingCard

const CarDetailsModal = ({ car, onClose, openBookingModal }) => {
  console.log("Car Data:", car);
  const [bookingCar, setBookingCar] = useState(null);
   // const [cars, setCars] = useState([]);
   // const [selectedCar, setSelectedCar] = useState(null);
  
   // const openCarDetails = (car) => {
    //  console.log("ℹ️ Opening Car Details:", car);
   //   setSelectedCar(car);
   // };
  
    // Close Modal
    //const closeCarDetails = () => {
     // setSelectedCar(null);
    //};
  

  if (!car) return null;

  return (
    <div className="modal-overlay">
      <div className="close-div">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="modal">
        <img src={car.image} alt={car.model} className="modal-car-image" />
        <div className="car-select-info">
          <p className="car-select-brand">{car.brand}</p>
          <p className="car-select-model">{car.model},</p>
          <p className="car-select-year">{car.year}</p>
        </div>
        <p className="select-type">Type: {car.type}</p>
        <p className="select-mileage">Mileage: {car.mileage} kmpl</p>
        <div className="modal-price-container">
          <h3 className="modal-price">${car.pricePerHour}/hr</h3>
          <p className="availability">Available</p>
        </div>

        <div className="card-now-buttons">
          <button className="cart-now-btn">
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
          <button className="book-now-btn" onClick={() => setBookingCar(car)}>
          Proceed 
                  </button>
        </div>

        <div className="owner-details">
          <h4 className="owner-header">Owner Details</h4>
          <p className="owner-name">
            <strong>Name:</strong> {car.owner.firstName + " " + car.owner.lastName}
          </p>
          <p className="owner-phone">
            <strong>Phone:</strong> {car.owner.phoneNumber}
          </p>
        </div>
      </div>
      {/* Booking Modal */}
      {bookingCar && <BookingCard car={bookingCar} onClose={() => setBookingCar(null)} />}
    </div>
  );
};

export default CarDetailsModal;

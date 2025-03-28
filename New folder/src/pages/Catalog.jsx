import React, { useEffect, useState } from "react";
import "../styles/catalog.css";
import "../styles/booking.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart, faTimes } from "@fortawesome/free-solid-svg-icons";

const Catalog = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookingCar, setBookingCar] = useState(null);
  const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [bookingError, setBookingError] = useState(null);
const [bookingSuccess, setBookingSuccess] = useState(null);
const [wishlist, setWishlist] = useState(new Set()); // Store wishlist as a Set for quick lookup
const [cart, setCart] = useState(new Set());

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/renter/cars", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch cars");
        }

        const data = await response.json();
        setCars(Array.isArray(data) ? data : data.cars || []);
        setFilteredCars(Array.isArray(data) ? data : data.cars || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredCars(cars);
      return;
    }

    setFilteredCars(
      cars.filter(
        (car) =>
          car.brand.toLowerCase().includes(term) ||
          car.model.toLowerCase().includes(term)
      )
    );
  };

  const openCarDetails = (car) => {
    setSelectedCar(car);
  };

  const closeCarDetails = () => {
    setSelectedCar(null);
  };

  const openBookingModal = (car) => {
    setBookingCar(car);
  };

  const closeBookingModal = () => {
    setBookingCar(null);
  };
  const handleBooking = async () => {
    setBookingError(null);
    setBookingSuccess(null);
  
    if (!startDate || !endDate) {
      setBookingError("Please select both start and end dates.");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      setBookingError("You must be logged in to book a car.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/book/${bookingCar._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startDate, endDate }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to book car");
      }
  
      setBookingSuccess("Booking request sent successfully!");
      setTimeout(() => {
        closeBookingModal();
        setStartDate("");
        setEndDate("");
      }, 2000);
    } catch (error) {
      setBookingError(error.message);
    }
  };
 // ✅ Fetch Wishlist Cars
 useEffect(() => {
  const fetchWishlist = async () => {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/api/wishlist", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      const wishlistSet = new Set(data.map((item) => item.carId._id));
      setWishlist(wishlistSet);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  fetchWishlist();
}, [token]);
// ✅ Toggle Wishlist
const toggleWishlist = async (carId) => {
  if (!token) {
    alert("Please log in to use the wishlist feature.");
    return;
  }

  const isWishlisted = wishlist.has(carId);
  const url = isWishlisted 
    ? `http://localhost:5000/api/wishlist/remove/${carId}`
    : `http://localhost:5000/api/wishlist/add`;

  try {
    const response = await fetch(url, {
      method: isWishlisted ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: isWishlisted ? null : JSON.stringify({ carId }),
    });

    if (!response.ok) {
      throw new Error("Failed to update wishlist");
    }

    // ✅ Update state correctly
    setWishlist((prevWishlist) => {
      const updatedWishlist = new Set(prevWishlist);
      if (isWishlisted) {
        updatedWishlist.delete(carId);
      } else {
        updatedWishlist.add(carId);
      }
      console.log("Updated wishlist:", Array.from(updatedWishlist)); // Debugging
    
      return new Set(updatedWishlist); // Ensure React re-renders
    });
    
  } catch (error) {
    console.error("Error updating wishlist:", error);
  }
};
const toggleCart = async (carId) => {
  if (!token) {
    alert("Please log in to use the cart feature.");
    return;
  }

  const isInCart = cart.has(carId);
  const url = isInCart 
    ? `http://localhost:5000/api/cart/remove/${carId}` 
    : `http://localhost:5000/api/cart/add`;

  try {
    const response = await fetch(url, {
      method: isInCart ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: isInCart ? null : JSON.stringify({ carId }),
    });

    if (!response.ok) {
      throw new Error("Failed to update cart");
    }

    // ✅ Update state correctly
    setCart((prevCart) => {
      const updatedCart = new Set(prevCart);
      if (isInCart) {
        updatedCart.delete(carId);
      } else {
        updatedCart.add(carId);
      }
      console.log("Updated cart:", Array.from(updatedCart)); // Debugging

      return new Set(updatedCart); // Ensure React re-renders
    });

  } catch (error) {
    console.error("Error updating cart:", error);
  }
};


  return (
    <>
      <div className="catalog-container">
        {/* 📜 Heading & Search Bar */}
        <div className="catalog-header">
          <h1 className="catalog-title">CataLog</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by brand or model..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {loading && <p>Loading cars...</p>}
        {error && <p className="error-message">{error}</p>}

        <div>
          {filteredCars.length > 0 ? (
            <div className="log-car-list">
              {filteredCars.map((car) => (
                <div key={car._id} className="log-car-card">
                  <div className="card-header">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="log-car-image"
                    />
                    <button
                    className={`wishlist-btn ${wishlist.has(car._id) ? "wishlisted" : ""}`}
                    onClick={() => toggleWishlist(car._id)}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                  </div>

                  <div className="log-car-info">
                    <p className="log-car-brand">{car.brand}</p>
                    <p className="log-car-model">{car.model},</p>
                    <p className="log-car-year">{car.year}</p>
                  </div>

                  <h3 className="log-price">
                    <span className="log-discounted-price">${car.pricePerHour}/hr</span>
                    <span className="log-original-price">${Math.floor(Math.random() * (199 - 39 + 1)) + 39}</span>
                  </h3>
                  <div className="log-card-buttons">
                  <button
                    className={`log-cart-btn ${cart.has(car._id) ? "in-cart" : ""}`}
                       onClick={() => toggleCart(car._id)}
                                    >
                <FontAwesomeIcon icon={faShoppingCart} />
          </button>
                    <button className="log-learn-more-btn" onClick={() => openCarDetails(car)}>
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && <p>No cars found.</p>
          )}
        </div>
      </div>

      {/* 🚗 Popup Modal for Car Details */}
      {selectedCar && (
        <div className="modal-overlay">
          <div className="close-div">
            <button className="close-btn" onClick={closeCarDetails}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="modal">
            <img src={selectedCar.image} alt={selectedCar.model} className="modal-car-image" />
            <div className="car-select-info">
              <p className="car-select-brand">{selectedCar.brand}</p>
              <p className="car-select-model">{selectedCar.model},</p>
              <p className="car-select-year">{selectedCar.year}</p>
            </div>
            <p className="select-type">Type: {selectedCar.type}</p>
            <p className="select-mileage">Mileage: {selectedCar.mileage} kmpl</p>
            <div className="modal-price-container">
              <h3 className="modal-price">${selectedCar.pricePerHour}/hr</h3>
              <p className="availability">Available</p>
            </div>

            <div className="card-now-buttons">
              <button className="cart-now-btn">
                <FontAwesomeIcon icon={faShoppingCart} />
              </button>
              <button className="book-now-btn" onClick={() => openBookingModal(selectedCar)}>
                Proceed
              </button>
            </div>

            <div className="owner-details">
              <h4 className="owner-header">Owner Details</h4>
              <p className="owner-name">
                <strong>Name:</strong> {selectedCar.owner.firstName + " " + selectedCar.owner.lastName}
              </p>
              <p className="owner-phone">
                <strong>Phone:</strong> {selectedCar.owner.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 📅 Booking Modal */}
      {bookingCar && (
 <div className="modal-overlay1">
 <div className="modal main-booking-modal">
        <div className="text-div">
        <h2>Request for Booking</h2>
        </div>

   {/* Car Image and Details */}
   <div className="car-details1">
     <img src={bookingCar.image} alt={bookingCar.model} className="booking-car-image1" />
     <div className="car-info1">
       <p>{bookingCar.brand} <b>{bookingCar.model}</b></p>
       <span>{bookingCar.year}</span> 
     </div>
   </div>

   {/* Pricing */}
   <div className="price-container1">
     <span>${bookingCar.pricePerHour}/hr</span>
     <span className="original-price1">$390</span>
   </div>

   {/* Date Selection */}
   {/* Date Selection (From Date & To Date in One Line) */}
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
     <button className="confirm-booking-btn1" onClick={handleBooking}>Book Now</button>
     <button className="cancel-booking-btn1" onClick={closeBookingModal}>Cancel</button>
   </div>
 </div>
</div>

)}

    </>
  );
};

export default Catalog;

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/wishlist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import BookingCard from "./BookingCard"; // ✅ Import BookingCard
import CarDetailsModal from "./CarDetailsModal";

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState(new Set());
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null); // ✅ Track selected car

  const [cart, setCart] = useState(new Set());
  
    const token = localStorage.getItem("token");

  const openCarDetails = (car) => {
    console.log("ℹ️ Opening Car Details:", car);
    setSelectedCar(car);
  };

  // Close Modal
  const closeCarDetails = () => {
    setSelectedCar(null);
  };
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/wishlist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setFilteredCars(data.map((item) => item.carId)); // Extract cars
          setWishlist(new Set(data.map((item) => item.carId._id))); // Track wishlisted cars
        } else {
          console.error("Failed to fetch wishlist:", data.message);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (carId) => {
    const method = wishlist.has(carId) ? "DELETE" : "POST";
    const url = wishlist.has(carId)
      ? `http://localhost:5000/api/wishlist/remove/${carId}`
      : `http://localhost:5000/api/wishlist/add`;
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: method === "POST" ? JSON.stringify({ carId }) : null, // ✅ Only send body for POST
      });
  
      if (response.ok) {
        setWishlist((prev) => {
          const updatedWishlist = new Set(prev);
          if (updatedWishlist.has(carId)) {
            updatedWishlist.delete(carId);
            setFilteredCars((cars) => cars.filter((car) => car._id !== carId)); // ✅ Remove from UI
          } else {
            updatedWishlist.add(carId);
          }
          return updatedWishlist;
        });
      } else {
        console.error("Failed to update wishlist");
      }
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
    <div className="wishlist-container1">
      <h2>Wishlist</h2>
      <div>
        {filteredCars.length > 0 ? (
          <div className="wish-car-list">
            {filteredCars.map((car) => (
              <div key={car._id} className="wish-car-card">
                <div className="card-header1">
                  <img src={car.image} alt={`${car.brand} ${car.model}`} className="wish-car-image" />
                  <button
                    className={`wishlist-btn1 ${wishlist.has(car._id) ? "wishlisted" : ""}`}
                    onClick={() => toggleWishlist(car._id)}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                </div>

                <div className="wish-car-info">
                  <p className="wish-car-brand">{car.brand}</p>
                  <p className="wish-car-model">{car.model},</p>
                  <p className="wish-car-year">{car.year}</p>
                </div>

                <h3 className="wish-price">
                  <span className="wish-discounted-price">${car.pricePerHour}/hr</span>
                  <span className="wish-original-price">${Math.floor(Math.random() * (199 - 39 + 1)) + 39}</span>

                </h3>
                <div className="wish-card-buttons">
                  <button
                                      className={`cart-btn ${cart.has(car._id) ? "in-cart" : ""}`}
                                         onClick={() => toggleCart(car._id)}
                                                      >
                                  <FontAwesomeIcon icon={faShoppingCart} />
                            </button>
                  <button className="wish-learn-more-btn" onClick={() => setSelectedCar(car)}>
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="no-wish">No cars found.</p>
        )}
      </div>

      {/* ✅ Show BookingCard Modal when a car is selected */}
      {selectedCar && <CarDetailsModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </div>
  );
};

export default Wishlist;

/* eslint-disable react/jsx-no-comment-textnodes */
import { useEffect, useState } from "react";
//import { AuthContext } from "../context/AuthContext";
import "../styles/wishlist.css";
import "../styles/cart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import CarDetailsModal from "./CarDetailsModal";
import BookingCard from "./BookingCard"; // Import BookingCard
import { faHeart } from "@fortawesome/free-solid-svg-icons";


const Cart = () => {
  const token = localStorage.getItem("token");
  //const { user } = useContext(AuthContext);
  const [cartCars, setCartCars] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [showLearnMore, setShowLearnMore] = useState(null);

  // Booking Modal State
  const [bookingCar, setBookingCar] = useState(null);
  //const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
const [wishlist, setWishlist] = useState(new Set()); // Store wishlist as a Set for quick lookup

  const openCarDetails = (car) => {
    console.log("ℹ️ Opening Car Details:", car);
    setSelectedCar(car);
  };

  // Close Modal
  const closeCarDetails = () => {
    setSelectedCar(null);
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No token found! Redirecting to login...");
          return;
        }

        const response = await fetch("http://localhost:5000/api/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`❌ Failed to fetch cart. Status: ${response.status}`);

        const data = await response.json();
        console.log("✅ Fetched Cart Data:", data);

        // Ensure each cart item has full car details
        setCartCars(data.map((item) => item.carId)); // If backend sends full car object
      } catch (error) {
        console.error("❌ Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Remove from Cart Function
  const removeFromCart = async (carId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found! Cannot remove from cart.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/cart/remove/${carId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("❌ Failed to remove from cart.");

      console.log(`✅ Removed car ${carId} from cart.`);
      setCartCars((cars) => cars.filter((car) => car._id !== carId));
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
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
  return (
    <div className="cart-container">
      <h2>🛒 Your Cart</h2>

      <div>
        {cartCars.length > 0 ? (
          <div className="cart-car-list">
            {cartCars.map((car) => (
              <div key={car._id} className="cart-car-card">
                <div className="card-header">
                  <img src={car.image} alt={`${car.brand} ${car.model}`} className="cart-car-image" />
                  <button
                                      className={`wishlist-btn ${wishlist.has(car._id) ? "wishlisted" : ""}`}
                                      onClick={() => toggleWishlist(car._id)}
                                    >
                                      <FontAwesomeIcon icon={faHeart} />
                                    </button>
                </div>

                <div className="cart-car-info">
                  <p className="cart-car-brand">{car.brand}</p>
                  <p className="cart-car-model">{car.model},</p>
                  <p className="cart-car-year">{car.year}</p>
                </div>

                <div className="price-learn-more">
                    <h3 className="price">
                    <span className="discounted-price">${car.pricePerHour}/hr</span>
                    <span className="cart-original-price">${Math.floor(Math.random() * (199 - 39 + 1)) + 39}</span>
                    </h3>
                    <p className="learn-more">
                    <a href="#" onClick={(e) => { e.preventDefault();
                        openCarDetails(car);
                    }}>Learn More</a>
                    </p>
                </div>


                <div className="cart-card-buttons">
                  <button className="cart-cart-btn" onClick={() => removeFromCart(car._id)}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </button>
                  <button className="cart-learn-more-btn" onClick={() => setBookingCar(car)}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="no-cars">No cars in your cart.</p>
        )}
      </div>

      {/* Learn More Modal */}
      {selectedCar && <CarDetailsModal car={selectedCar} onClose={closeCarDetails} />}

      {/* Booking Modal */}
      {bookingCar && <BookingCard car={bookingCar} onClose={() => setBookingCar(null)} />}
    </div>
  );
};

export default Cart;

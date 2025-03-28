import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/carComponent.css"; // Import CSS

const CarComponent = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    carNumber: "",
    availability: "Yes",
    type: "",
    pricePerHour: "",
    year: "",
    image: "",
    mileage: "",
    description: "",
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: Please log in.");
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("http://localhost:5000/api/cars", config);
      setCars(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.brand || !formData.model || !formData.carNumber || !formData.type || !formData.pricePerHour || !formData.year || !formData.mileage || !formData.description) {
      setError("⚠️ All fields are required.");
      return false;
    }
    if (isNaN(formData.pricePerHour) || formData.pricePerHour <= 0) {
      setError("⚠️ Price per hour must be a positive number.");
      return false;
    }
    if (isNaN(formData.mileage) || formData.mileage <= 0) {
      setError("⚠️ Mileage must be a positive number.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setError(""); // Clear previous errors
    if (e.target.name === "image") {
      handleImageUpload(e);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("⚠️ Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, image: reader.result });
    reader.readAsDataURL(file);
  };

  const processFormData = () => ({
    ...formData,
    availability: formData.availability === "Yes",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: Please log in.");

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editMode) {
        await axios.put(`http://localhost:5000/api/cars/${selectedCar._id}`, processFormData(), config);
        //alert("✅ Car updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/cars", processFormData(), config);
        //alert("✅ Car added successfully!");
      }

      resetForm();
      setShowForm(false);
      setEditMode(false);
      fetchCars();
    } catch (err) {
      setError(err.response?.data?.message || "❌ An error occurred. Please try again.");
    }
  };

  const handleDeleteCar = (carId) => {
    setCarToDelete(carId);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!carToDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: Please log in.");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/cars/${carToDelete}`, config);

      setShowDeleteModal(false);
      setCarToDelete(null);
      fetchCars();
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error deleting car.");
    }
  };


  

  const handleEditClick = (car) => {
    setSelectedCar(car);
    setFormData({ ...car, availability: car.availability ? "Yes" : "No" });
    setShowForm(true);
    setEditMode(true);
  };

  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      carNumber: "",
      availability: "Yes",
      type: "",
      pricePerHour: "",
      year: "",
      image: "",
      mileage: "",
      description: "",
    });
  };

  return (
    <div className="car-management-container">
      <h2>Manage Cars</h2>
      {error && <p className="error-message">{error}</p>}

      {!showForm && (
  <button
    onClick={() => {
      setShowForm(true);
      setEditMode(false);
      resetForm();
    }}
    className="add-car-btn"
  >
    +Add New Car
  </button>
)}


{showForm && (
    <>
        {/* Dynamic Heading Outside the Form */}
        <div className="form-div">
        <h3 className="form-heading">{editMode ? "Update Car" : "Add New Car"}</h3>

        <form className="car-form" onSubmit={handleSubmit}>
    <div className="input-group">
        <label htmlFor="brand">Brand</label>
        <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange}  required />
    </div>

    <div className="input-group">
        <label htmlFor="model">Model</label>
        <input type="text" id="model" name="model" value={formData.model} onChange={handleChange}  required />
    </div>

    <div className="input-group">
        <label htmlFor="carNumber">Car Number</label>
        <input type="text" id="carNumber" name="carNumber" value={formData.carNumber} onChange={handleChange}  required />
    </div>

    <div className="input-group">
        <label htmlFor="availability">Availability</label>
        <select id="availability" name="availability" value={formData.availability} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>
    </div>

    <div className="input-group">
        <label htmlFor="type">Type</label>
        <input type="text" id="type" name="type" value={formData.type} onChange={handleChange}  required />
    </div>

    <div className="input-group">
        <label htmlFor="pricePerHour">Price per Hour</label>
        <input type="number" id="pricePerHour" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange}  required />
    </div>

    <div className="input-group">
        <label htmlFor="year">Year</label>
        <input type="number" id="year" name="year" value={formData.year} onChange={handleChange}  required />
    </div>

    <div className="input-group">
        <label htmlFor="image">Image</label>
        <input type="file" id="image" name="image" accept="image/*" onChange={handleImageUpload} />
    </div>

    <div className="input-group">
        <label htmlFor="mileage">Mileage</label>
        <input type="number" id="mileage" name="mileage" value={formData.mileage} onChange={handleChange}  required />
    </div>

    <div className="input-group">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} ></textarea>
    </div>

    <div className="button-container1">
        <button className="add-car-form-one" type="submit">{editMode ? "Update Car" : "Add Car"}</button>
        <button className="close-form-btn-one" type="button" onClick={() => { setShowForm(false); resetForm(); }}>
            Close
        </button>
    </div>
</form>

        </div>
    </>
)}


      {!showForm && (
        <>
          {loading && <p>Loading cars...</p>}
          <table className="car-table">
            <thead>
             
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id}>
                  <td><img src={car.image || "https://via.placeholder.com/150"} alt={`${car.brand} ${car.model}`} className="car-image" /></td>
                  <td className="font-style" >{car.model} <br/> {car.carNumber} <br/> {car.year} Model</td>
                  <td className="font-style" >${car.pricePerHour}</td>
                  <td className="font-style" >{car.availability ? "Available" : "Not Available"}</td>
                  <td>
                    <button className="update-btn" onClick={() => handleEditClick(car)}>Update</button>
                    <button className="delete-btn" onClick={() => handleDeleteCar(car._id)}>Delete</button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {showDeleteModal && (
  <div className="delete-modal">
    <div className="delete-modal-content">
      <p>Are you sure you want to delete this car?</p>
      <button className="confirm-btn" onClick={confirmDelete}>YES</button>
      <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>NO</button>
    </div>
  </div>
)}

    </div>
  );
};

export default CarComponent;

# Car Rental Management System (MERN)

## 🚗 About the Project
The **Car Rental Management System** is a web-based application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It allows **owners** to list their cars for rent and **renters** to browse, book, and manage car rentals efficiently. The system supports **role-based access control**, ensuring that users have appropriate permissions based on their roles.

## 🛠 Tech Stack
- **Frontend:** React.js (with CSS for styling)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **State Management:** Context API / Redux (optional)

## 🎯 Features
### Owner
- Add, update, and delete car details (including images)
- Accept or reject booking requests
- View booking history
- Manage profile (update details, delete account, change theme)

### Renter
- Search and book cars
- Add cars to wishlist and view cart
- View booking history
- Receive notifications for booking approvals/rejections
- Manage profile (update details, delete account, change theme)

## 🚀 Getting Started
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Chennuhunaysubhash/car-rental-management-system.git
cd car-rental-management-system
```

### 2️⃣ Backend Setup
```sh
cd backend
npm install  # Install dependencies
npm start    # Start the server
```

### 3️⃣ Frontend Setup
```sh
cd frontend
npm install  # Install dependencies
npm start    # Start the React app
```

### 4️⃣ Environment Variables
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## 📌 Folder Structure
```
car-rental-management-system/
├── backend/    # Node.js & Express backend
│   ├── models/    # Database models
│   ├── routes/    # API routes
│   ├── controllers/ # Business logic
│   ├── middleware/ # Auth & security middleware
│   ├── config/    # DB connection & environment configs
│   ├── server.js  # Main server file
│
├── frontend/   # React.js frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/   # Main application pages
│   │   ├── context/  # State management
│   │   ├── App.js    # Main app component
│   │   ├── index.js  # Entry point
│
├── README.md   # Project documentation
├── package.json
```

## 🤝 Contributing
Feel free to submit **pull requests** or open **issues** to improve the project!

## 📄 License
This project is **open-source** and free to use.


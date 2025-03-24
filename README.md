# Sippy Life - MVP Backend

## 🚀 Introduction
Sippy Life is Nigeria's innovative wholesale beverage platform, revolutionizing how businesses and individuals access premium drinks. This MVP serves as a quick demonstration of my backend development skills, showcasing essential features such as user authentication, order management, group ordering, payment processing, and real-time order tracking.

## 🔥 Features
- **User Authentication** (Signup, Login, Role-based Access Control)
- **Order Management** (Create Orders, Track Orders, Group Orders)
- **Payment Processing** (Paystack Integration)
- **Real-Time Order Tracking** (WebSockets for live updates)
- **Inventory Management** (Stock Updates & Alerts)
- **API Documentation** (Swagger/OpenAPI)
- **Security** (JWT Authentication, Protected Routes)

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Payments**: Paystack API
- **Real-Time Updates**: WebSockets (Socket.io)
- **API Documentation**: Swagger / OpenAPI

---

## 📌 Setup Instructions

### 1️⃣ Prerequisites
Ensure you have the following installed:
- Node.js (v14+)
- PostgreSQL
- Git
- A Paystack account (for payment processing)

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/William9701/Sippy_backendProject.git
cd Sippy_backendProject
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and configure the following:
```
PORT=5000
DB_NAME=beverage_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
JWT_SECRET=your_secret_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

### 5️⃣ Set Up the Database
```bash
npx sequelize-cli db:migrate
```

### 6️⃣ Start the Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## 📡 API Endpoints

### **1️⃣ Authentication**
#### ➤ User Signup
- **Endpoint**: `POST /auth/signup`
- **Payload**:
```json
{
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

#### ➤ User Login
- **Endpoint**: `POST /auth/login`
- **Payload**:
```json
{
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```
- **Response**: Session ID stored in cookies

---

### **2️⃣ Orders**
#### ➤ Create Order
- **Endpoint**: `POST /orders`
- **Authorization**: JWT Token required
- **Payload**:
```json
{
  "orderType": "single",
  "orders": [
    { "productId": "123", "quantity": 2 },
  ]
}
```

#### ➤ Group Order
- **Endpoint**: `POST /orders`
- **Payload**:
```json
{
  "orderType": "group",
  "orders": [
    { "productId": "123", "quantity": 2 },
    { "productId": "456", "quantity": 4 }
  ]
}
```

#### ➤ Track Order
- **Endpoint**: `GET /orders/track/:id`

---

### **3️⃣ Payment Processing**
#### ➤ Initialize Paystack Payment
- **Endpoint**: `POST /payments/paystack`
- **Payload**:
```json
{
  "orderId": "xyz789",
  "authorization_code": "AUTH_123ABC"
}
```
- **Response**:
```json
{
  "authorization_url": "https://paystack.com/pay/example",
  "charge_response": { "status": "success" }
}
```

---

### **4️⃣ Inventory Management**
#### ➤ Update Stock
- **Endpoint**: `PUT /inventory/update-stock`
- **Authorization**: Admin only
- **Payload**:
```json
{
  "productId": "12345",
  "newStock": 100
}
```

---

## 🖥️ Running API Tests

### Using Postman
- Import the provided **Postman Collection**.
- Ensure to include `-b cookie.txt` after login to use session authentication.
- Update environment variables for API URLs and tokens.

### Using cURL (Terminal)
#### ➤ Login and Store Cookie
```bash
curl -X POST http://localhost:5000/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email": "johndoe@example.com", "password": "securepassword"}' \
 -c cookie.txt
```

#### ➤ Place Order with Authentication
```bash
curl -X POST http://localhost:5000/orders/create \
 -H "Content-Type: application/json" \
 -b cookie.txt \
 -d '{"productId": "12345", "quantity": 2}'
```

---

## 🔐 Security Measures
- **JWT Authentication** for secure access.
- **Role-Based Access Control** (Admins, Customers, Delivery Personnel).
- **Session Management** (Cookies for authentication).
- **Data Validation** using Joi/Express-validator.

---

## 📜 API Documentation
This project uses **Swagger/OpenAPI** to document API endpoints.
- Visit `http://localhost:5000/api-docs` after running the server.

---

## 🛠️ Future Enhancements
- Implement **Gamification** for customer engagement.
- **AI-powered** recommendations for products.
- **Automated stock level monitoring**.

---

## 🤝 Contributing
If you'd like to contribute, feel free to fork the repo and submit a PR.

---

## 📬 Contact
- **Developer**: Obi Obiesie William
- **Email**: obi.william@example.com
- **LinkedIn**: [linkedin.com/in/obiobiesie](#)

---

## 🎯 Conclusion
This MVP is a demonstration of my backend development skills, showcasing **authentication, order processing, payments, and real-time tracking**. Built to be **scalable, secure, and efficient**, this serves as a foundation for Sippy Life’s digital expansion.

🚀 **Let's build the future of beverage ordering!** 🍾🥂


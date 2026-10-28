# E-Commerce Platform

A full-featured online shopping platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### Customer Features
- 🛍️ Browse products with search and category filtering
- 🛒 Shopping cart with real-time updates  
- 💳 Secure checkout process
- 👤 User authentication (register/login)
- 📦 Order history tracking

### Admin Features
- 📊 Admin dashboard
- ➕ Create, edit, and delete products
- 📋 Manage orders and update status
- 👥 View customer information

## Tech Stack

**Frontend:**
- React 19 with Vite
- React Router for navigation
- Axios for API calls
- Modern CSS with glassmorphism effects

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v20.19+ or v22.12+)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Install Backend Dependencies**
\`\`\`bash
cd backend
npm install
\`\`\`

2. **Install Frontend Dependencies**
\`\`\`bash
cd frontend
npm install
\`\`\`

3. **Configure Environment Variables**

Backend (\`backend/.env\`):
\`\`\`
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
\`\`\`

Frontend (\`frontend/.env\`):
\`\`\`
VITE_API_URL=http://localhost:5000
\`\`\`

4. **Seed the Database** (Optional - adds sample products)
\`\`\`bash
cd backend
node config/seed.js
\`\`\`

### Running the Application

1. **Start MongoDB** (if using local installation)
\`\`\`bash
mongod
\`\`\`

2. **Start Backend Server**
\`\`\`bash
cd backend
npm run dev
\`\`\`
Server runs on http://localhost:5000

3. **Start Frontend Development Server**
\`\`\`bash
cd frontend
npm run dev
\`\`\`
Application runs on http://localhost:5173

## Deploy to Render

Deploy the backend as a Render **Web Service** and the frontend as a Render **Static Site**. Both services can use this repository.

### 1. Prepare MongoDB

Create a MongoDB Atlas cluster and database user. In Atlas Network Access, allow connections from Render (for a quick setup this is commonly `0.0.0.0/0`; use a more restrictive network policy if your setup supports Render's outbound IP ranges). Copy the cluster connection string; it should include the database username, password, and database name.

### 2. Deploy the backend API

In Render, create a **Web Service** for this repository with:

| Setting | Value |
| --- | --- |
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Add these environment variables in the service's **Environment** settings:

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long, randomly generated secret |

Render supplies `PORT` automatically. After the service deploys, open its URL (for example, `https://your-api.onrender.com`); it should return a JSON response confirming the API is running.

### 3. Deploy the frontend

Create a **Static Site** for the same repository with:

| Setting | Value |
| --- | --- |
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Add this environment variable to the Static Site. Use only the backend origin: do not append `/api` or a trailing slash.

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | `https://your-api.onrender.com` |

Add a rewrite rule in the Static Site's **Redirects/Rewrites** settings so React Router routes work on refresh:

| Source | Destination | Action |
| --- | --- | --- |
| `/*` | `/index.html` | Rewrite |

Deploy the Static Site after setting `VITE_API_URL`; Vite reads it during the build. If you change it later, trigger a new frontend deploy. The `VITE_API_URL` value is public in the browser bundle, so do not put secrets in it.

### 4. Verify

Open the Static Site URL, then try loading products and registering or signing in. If API requests fail, confirm the frontend variable is the backend origin, the backend has the correct MongoDB URI and JWT secret, and the Atlas network settings allow the backend to connect. Free Render services may take a little time to respond after inactivity.

## Default Admin Account

To create an admin account, register a user and manually update the role in MongoDB:
\`\`\`javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
\`\`\`

Or register with role in the backend API:
\`\`\`bash
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
\`\`\`

## Project Structure

\`\`\`
E-Commerce Platform/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React Context providers
│   │   ├── services/     # API service layer
│   │   └── styles/       # Global styles
│   └── package.json
├── backend/              # Express API
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── controllers/     # Route controllers
│   ├── config/          # Configuration files
│   └── server.js        # Entry point
└── README.md
\`\`\`

## API Endpoints

### Authentication
- POST \`/api/auth/register\` - Register new user
- POST \`/api/auth/login\` - Login user
- GET \`/api/auth/profile\` - Get user profile (protected)

### Products
- GET \`/api/products\` - Get all products
- GET \`/api/products/:id\` - Get single product
- POST \`/api/products\` - Create product (admin)
- PUT \`/api/products/:id\` - Update product (admin)
- DELETE \`/api/products/:id\` - Delete product (admin)

### Cart
- GET \`/api/cart\` - Get user cart (protected)
- POST \`/api/cart/add\` - Add item to cart (protected)
- PUT \`/api/cart/update\` - Update cart item (protected)
- DELETE \`/api/cart/remove/:productId\` - Remove item (protected)

### Orders
- POST \`/api/orders\` - Create order (protected)
- GET \`/api/orders\` - Get user orders (protected)
- GET \`/api/orders/all\` - Get all orders (admin)
- PUT \`/api/orders/:id/status\` - Update order status (admin)

## License

MIT

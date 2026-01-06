# ProfitPulse 🚀

ProfitPulse is a modern, real-time Profit Analytics SaaS platform for e-commerce store owners. It consolidates data from Shopify (Revenue) and Ad Platforms (Meta, TikTok) to calculate **True Profit** by deducting COGS, Shipping, Transaction Fees, and Ad Spend in real-time.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

* **Real-Time Dashboard:** Visualizes Net Profit, Margin, Revenue, and Ad Spend with interactive graphs.
* **Multi-Channel Attribution:** Tracks ad spend breakdown by platform (Meta, TikTok, Google).
* **Cost Breakdown:** Detailed donut chart showing where money goes (COGS, Shipping, Fees, etc.).
* **Orders vs. Ad Spend:** Advanced analysis of Ad Spend per Order trends.
* **Customer Insights:** Tracks CAC (Customer Acquisition Cost) and LTV metrics.
* **Integrations Manager:** Simulate connections to Shopify, Meta Ads, and TikTok Ads.
* **Transaction Management:** Paginated table view of all sales with status indicators.
* **Secure Authentication:** JWT-based Auth (Access + Refresh Tokens) with HttpOnly cookies.
* **Modern UI:** Glassmorphism design using Tailwind CSS v4, Lucide Icons, and Recharts.

## 🛠 Tech Stack

### Frontend
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS v4
* **State Management:** Redux Toolkit
* **Charts:** Recharts
* **Icons:** Lucide React
* **HTTP Client:** Axios (with Interceptors)

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (JSON Web Tokens), bcrypt
* **Security:** CORS, Cookie-Parser

## 📂 Folder Structure

```text
ProfitPulse/
├── backend/                 # API & Database Logic
│   ├── src/
│   │   ├── controllers/     # Route Logic (Auth, Dashboard, Analytics)
│   │   ├── models/          # Mongoose Schemas (User, Store, Transaction, Expense)
│   │   ├── routes/          # API Endpoint Definitions
│   │   ├── utils/           # AsyncHandler, ApiError, Seed Script
│   │   └── app.js           # Express App Configuration
│   └── .env                 # Backend Secrets
│
└── frontend/                # React Application
    ├── src/
    │   ├── components/      # Reusable UI (Sidebar, MetricCards, Charts)
    │   ├── features/        # Redux Slices & Services (Auth, Dashboard)
    │   ├── pages/           # View Pages (Dashboard, Settings, Integrations)
    │   └── styles/          # Tailwind v4 Configuration
    └── vite.config.js

🚀 Getting Started
Prerequisites
Node.js (v16 or higher)

MongoDB (Local or Atlas URL)

1. Setup Backend

```
cd backend
npm install

# Create a .env file based on the example below
# Run the seeder to get fake data
node src/seed.js

# Start the server
npm run dev
```

Backend .env Example:

```
PORT=8000
MONGODB_URI=mongodb+srv://<your_mongo_url>
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_super_secret_access_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRY=10d
```

2. Setup Frontend

```
cd frontend
npm install

# Start the development server
npm run dev
```

Visit http://localhost:5173 in your browser.

🧪 Demo Data (Seeder)
The project includes a robust seeding script that populates the database with:

A demo user account.

A linked Shopify store.

30 days of realistic Transactions (Revenue, Shipping, Fees).

30 days of Ad Spend (Meta & TikTok).

To reset data, simply run:

```
cd backend
node src/seed.js
```

🔐 API EndpointsMethodEndpointDescriptionPOST/api/v1/users/loginLogin user & set cookiesPOST/api/v1/users/registerCreate new accountGET/api/v1/dashboard/statsGet main dashboard metrics & graph dataGET/api/v1/transactionsGet paginated list of ordersGET/api/v1/integrationsGet connection status of external apps


🛡️ License
This project is licensed under the MIT License.
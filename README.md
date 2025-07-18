# 🩸 LifeFlow – Blood Donation & Community Support Platform

![React](https://img.shields.io/badge/React-19.x-blue?logo=react)
![Express](https://img.shields.io/badge/Express-5.x-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss)
![Stripe](https://img.shields.io/badge/Stripe-18.x-635bff?logo=stripe)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

> **LifeFlow** is a full-featured MERN stack web application that bridges the gap between blood donors, recipients, volunteers, and healthcare organizations. It enables secure, role-based operations with donation request management, a donor directory, a full-featured CMS for blogs, and Stripe-powered fundraising — all within a beautifully responsive and accessible design.

---

## 🔗 Live Demo

🌐 **Frontend**: [Visit Live Site](https://blood-donation-full-stack.web.app)  
🔐 **Admin Access**:  
`Email:` `admin@blood.com`  
`Password:` `admin123`

---

## 📁 Repositories

- 🖥️ **Frontend (Client)**: [GitHub Repo → Client](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-CodesWithRakib)
- ⚙️ **Backend (Server)**: [GitHub Repo → Server](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-CodesWithRakib)

---

## 🚀 Key Features

- 🔑 **Secure Role-Based Dashboard** (Admin | Donor | Volunteer)
- 🧾 **Blood Donation Requests** with live status tracking
- 🔍 **Donor Finder** by Blood Group, District, and Upazila
- 📝 **Rich Blog Management System** with Publish/Unpublish support
- 💳 **Stripe Integration** for fundraising and donation
- 📈 **Analytics Dashboard** with visual charts and real-time stats
- 🔐 **Firebase Auth + JWT** for dual-layered route protection
- 📱 **Fully Responsive & Accessible UI**
- 🎨 **Framer Motion + Lucide Icons** for modern, animated UX
- 📨 **Email Notifications** and Smart Alerts via Toastify & SweetAlert2

---

## 🛠️ Tech Stack

### 💻 Frontend

| Technology             | Purpose                       |
| ---------------------- | ----------------------------- |
| React (v19)            | UI Library                    |
| Tailwind CSS (v4)      | Styling Framework             |
| React Router (v7)      | Routing & Navigation          |
| TanStack Query         | API Caching & Data Management |
| React Hook Form        | Form Handling                 |
| Framer Motion          | Animations                    |
| Lucide Icons           | Iconography                   |
| Jodit Editor           | Rich Text Blog Editor         |
| SweetAlert2 & Toastify | UI Alerts & Notifications     |

### 🔐 Authentication

- **Firebase** for user auth & registration
- **JWT** for secure route protection and backend validation

### 💳 Payments

- **Stripe** for secure online donations  
  (via `@stripe/react-stripe-js` and `@stripe/stripe-js`)

### ⚙️ Backend

| Technology    | Purpose                        |
| ------------- | ------------------------------ |
| Node.js       | Server runtime                 |
| Express.js    | API Framework                  |
| MongoDB       | Database                       |
| Mongoose      | ODM for MongoDB                |
| PDFKit        | PDF generation for receipts    |
| Nodemailer    | Sending emails to users        |
| Helmet & CORS | Security and API configuration |

---

## 📦 Core Dependencies

### Client-side

```json
{
  "react": "^19.1.0",
  "react-router": "^7.6.3",
  "tailwindcss": "^4.1.11",
  "axios": "^1.10.0",
  "firebase": "^11.10.0",
  "jodit-react": "^5.2.19",
  "lucide-react": "^0.525.0",
  "framer-motion": "^12.23.0",
  "react-hook-form": "^7.60.0",
  "react-toastify": "^2.5.2",
  "sweetalert2": "^11.22.2",
  "recharts": "^3.1.0",
  "@stripe/react-stripe-js": "^3.7.0",
  "@stripe/stripe-js": "^7.4.0",
  "@tanstack/react-query": "^5.81.5",
  "@tanstack/react-table": "^8.21.3"
}
```

### Server-side

```json
{
  "express": "^5.1.0",
  "cors": "^2.8.5",
  "dotenv": "^17.1.0",
  "helmet": "^8.1.0",
  "cookie-parser": "^1.4.7",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.17.0",
  "nodemailer": "^7.0.5",
  "stripe": "^18.0.0",
  "pdfkit": "^0.17.1"
}
```

---

## 🧪 Setup & Installation

### ⚙️ Prerequisites

- Node.js v18+
- MongoDB Database URI
- Firebase Project (for Auth)
- Stripe Keys
- Vite (Frontend Dev Server)

### 🔧 Local Installation

```bash
# Clone both repos
git clone https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-CodesWithRakib.git
git clone https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-CodesWithRakib.git

# Install client
cd client
npm install
npm run dev

# Install server
cd ../server
npm install
npm run start
```

### 🔐 Environment Variables

#### `.env` (Frontend)

```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_project.firebaseapp.com
VITE_projectId=your_project_id
VITE_storageBucket=your_project.appspot.com
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id

VITE_IMGBB_API_KEY=your_imgbb_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
VITE_CLOUD_NAME=your_cloudinary_name
VITE_API_BASE_URL=https://your-server-url.com

```

#### `.env` (Backend)

```env
DB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=your_admin_email@example.com

```

---

## 📸 Screenshots

> _Coming soon: Dashboard, Request Page, Blog CMS, and Stripe Payment Modals..._

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).

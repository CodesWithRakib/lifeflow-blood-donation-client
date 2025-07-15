# 🩸 Donorly - Blood Donation App

**Donorly** is a full-featured MERN stack application that connects blood donors, volunteers, and patients in need. It includes a role-based dashboard system, donation request management, public donor search, blog CMS, and Stripe-based fundraising — all secured and beautifully designed.

---

## 🔗 Live Preview

🌐 **Live URL**: [Donorly Live](https://blood-donation-full-stack.web.app/)

🔐 **Admin Credentials**  
**Email**: `admin@blood.com`  
**Password**: `admin123`

---

## 📦 Repositories

- **Client**: [GitHub → Client](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-CodesWithRakib)
- **Server**: [GitHub → Server](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-CodesWithRakib)

---

## 🚀 Core Features

- ✅ **Role-Based Access** (Admin, Donor, Volunteer)
- 🔐 **JWT Auth** with Firebase
- 📝 **Rich Blog CMS** with image upload, publish/unpublish
- 📅 **Blood Donation Requests** with status updates and filters
- 📍 **Donor Search by Blood Group, District & Upazila**
- 💳 **Stripe Payments** for funding system
- 📊 **Dashboard with statistics and admin controls**
- 📱 **Fully Responsive Design**
- 🌐 **Public and Protected Routes with Auth Guard**
- 🔔 **Smart Notifications** using SweetAlert2 & Toastify
- 📁 **Environment-based Config (Firebase, Stripe, MongoDB)**

---

## 🛠️ Tech Stack

### 🖥️ Frontend

- **React** + **Vite**
- **Tailwind CSS** for utility-first styling
- **React Router v7**
- **Jodit Editor** for blog content
- **Lucide Icons** for elegant UI
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **TanStack Query** for efficient data fetching
- **React Toastify** & **SweetAlert2** for notifications

### 🔐 Auth & API

- **Firebase Auth** for registration/login
- **JWT** for protected routes
- **Axios** for API calls

### 💳 Payments

- **Stripe** via `@stripe/react-stripe-js` and `@stripe/stripe-js`

### 📦 Backend

- **Node.js** + **Express.js**
- **MongoDB** with Mongoose
- **RESTful APIs** with role protection and filtering

---

## 📚 Key Dependencies

```json
{
  "@emotion/react": "^11.14.0",
  "@stripe/react-stripe-js": "^3.7.0",
  "@stripe/stripe-js": "^7.4.0",
  "@tailwindcss/vite": "^4.1.11",
  "@tanstack/react-query": "^5.81.5",
  "axios": "^1.10.0",
  "date-fns": "^4.1.0",
  "dompurify": "^3.2.6",
  "firebase": "^11.10.0",
  "jodit-react": "^5.2.19",
  "lucide-react": "^0.525.0",
  "motion": "^12.23.0",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-hook-form": "^7.60.0",
  "react-hot-toast": "^2.5.2",
  "react-icons": "^5.5.0",
  "react-intersection-observer": "^9.16.0",
  "react-loading-skeleton": "^3.5.0",
  "react-router": "^7.6.3",
  "react-select": "^5.10.2",
  "react-spinners": "^0.17.0",
  "recharts": "^3.1.0",
  "sweetalert2": "^11.22.2",
  "sweetalert2-react-content": "^5.1.0",
  "tailwindcss": "^4.1.11"
}
```

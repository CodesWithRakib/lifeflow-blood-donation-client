import { createBrowserRouter } from "react-router";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import Home from "../pages/home/Home";
import Blogs from "../pages/Blogs/Blogs";
import BlogPreview from "../pages/Blogs/BlogPreview";
import Funding from "../pages/Funding/Funding";
import SearchPage from "../pages/Donors/SearchPage";
import DonationRequestsPublic from "../pages/Requests/DonationRequestsPublic";
import DonationRequestDetails from "../pages/Requests/DonationRequestDetails";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Dashboard Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Dashboard/Profile";

// Donor Routes
import CreateDonationRequest from "../components/form/CreateDonationRequest";
import MyDonationRequests from "../pages/Dashboard/Donor/MyDonationRequests";
import EditDonationRequest from "../components/form/EditDonationRequest";

// Admin Routes
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import AllDonationRequests from "../pages/Dashboard/Admin/AllDonationRequests";
import ContentManagement from "../pages/Dashboard/Admin/ContentManagement";
import AddBlog from "../pages/Dashboard/Admin/AddBlog";
import EditBlog from "../pages/Dashboard/Admin/EditBlog";

// Common Components
import Error from "../pages/error/Error";
import PrivateRoute from "../middleware/PrivateRoute";
import MyDonations from "../pages/Requests/MyDonations";
import HealthTips from "../pages/Requests/HealthTips";
import Analytics from "../pages/Dashboard/Admin/Analytics";
import Settings from "../pages/Dashboard/Settings";
import HelpCenter from "../pages/Dashboard/HelpCenter";
import AdminRoute from "../middleware/AdminRoute";
import EmergencyRequest from "../pages/Requests/EmergencyRequest";
import DonationRequest from "../pages/Requests/DonationRequest";

// Routing Configuration
const router = createBrowserRouter([
  // =======================
  // 🔓 Public Main Layout
  // =======================
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      // --- Homepage
      { index: true, element: <Home /> },

      // --- Blogs
      { path: "blog", element: <Blogs /> },
      {
        path: "blogs/:id",
        element: (
          <PrivateRoute>
            <BlogPreview />
          </PrivateRoute>
        ),
      },

      // --- Funding (shared access)
      {
        path: "funding",
        element: (
          <PrivateRoute>
            {" "}
            <Funding />{" "}
          </PrivateRoute>
        ),
      },

      // --- Search Donors
      { path: "search-donors", element: <SearchPage /> },

      // --- Auth Pages
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // --- Public Donation Request Page
      { path: "donation-requests", element: <DonationRequestsPublic /> },

      // --- Donation Request Details (Requires Login)
      {
        path: "donation-request/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "emergency-request",
        element: (
          <PrivateRoute>
            <EmergencyRequest />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ===========================
  // 🔐 Protected Dashboard Area
  // ===========================
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <Error />,
    children: [
      // --- Dashboard Overview (common)
      { index: true, element: <Dashboard /> },

      // --- Profile Page (common)
      {
        path: "profile",
        element: (
          <PrivateRoute>
            {" "}
            <Profile />{" "}
          </PrivateRoute>
        ),
      },

      // ========= Donor Routes =========
      {
        path: "create-donation-request",
        element: (
          <PrivateRoute>
            <DonationRequest />
            {/* <CreateDonationRequest /> */}
          </PrivateRoute>
        ),
      },
      {
        path: "my-donation-requests",
        element: (
          <PrivateRoute>
            {" "}
            <MyDonationRequests />
          </PrivateRoute>
        ),
      },
      {
        path: "my-donations",
        element: (
          <PrivateRoute>
            {" "}
            <MyDonations />
          </PrivateRoute>
        ),
      },
      {
        path: "donation-details/:id",
        element: (
          <PrivateRoute>
            {" "}
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },
      { path: "health-tips", element: <HealthTips /> },
      {
        path: "donation-request/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "edit-donation/:id",
        element: (
          <PrivateRoute>
            {" "}
            <EditDonationRequest />{" "}
          </PrivateRoute>
        ),
      },

      // ========= Admin Routes =========
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "all-blood-donation-request",
        element: (
          <PrivateRoute>
            {" "}
            <AllDonationRequests />{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <AdminRoute>
            {" "}
            <Analytics />{" "}
          </AdminRoute>
        ),
      },

      // --- Content Management (Blogs)
      {
        path: "content-management",
        element: (
          <PrivateRoute>
            {" "}
            <ContentManagement />{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "content-management/add-blog",
        element: (
          <PrivateRoute>
            {" "}
            <AddBlog />{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "content-management/edit-blog/:id",
        element: (
          <PrivateRoute>
            <EditBlog />
          </PrivateRoute>
        ),
      },
      {
        path: "content-management/blog-preview/:id",
        element: (
          <PrivateRoute>
            {" "}
            <BlogPreview />
          </PrivateRoute>
        ),
      },
      // --- Funding (shared access in dashboard)
      {
        path: "funding",
        element: (
          <PrivateRoute>
            {" "}
            <Funding />{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <PrivateRoute>
            {" "}
            <Settings />{" "}
          </PrivateRoute>
        ),
      },
      { path: "help-center", element: <HelpCenter /> },
    ],
  },
]);

export default router;

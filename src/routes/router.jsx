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
      { path: "funding", element: <Funding /> },

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
      { path: "profile", element: <Profile /> },

      // ========= Donor Routes =========
      { path: "create-donation-request", element: <CreateDonationRequest /> },
      { path: "my-donation-requests", element: <MyDonationRequests /> },
      { path: "my-donations", element: <MyDonations /> },
      { path: "donation-details/:id", element: <DonationRequestDetails /> },
      { path: "health-tips", element: <HealthTips /> },
      {
        path: "donation-request/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },
      { path: "edit-donation/:id", element: <EditDonationRequest /> },

      // ========= Admin Routes =========
      { path: "all-users", element: <AllUsers /> },
      { path: "all-blood-donation-request", element: <AllDonationRequests /> },
      { path: "analytics", element: <Analytics /> },

      // --- Content Management (Blogs)
      { path: "content-management", element: <ContentManagement /> },
      { path: "content-management/add-blog", element: <AddBlog /> },
      { path: "content-management/edit-blog/:id", element: <EditBlog /> },
      {
        path: "content-management/blog-preview/:id",
        element: <BlogPreview />,
      },

      // ========= Volunteer Routes =========
      // Reuse AllDonationRequests and ContentManagement
      // Render UI conditionally in layout/sidebar based on user role

      // --- Funding (shared access in dashboard)
      { path: "funding", element: <Funding /> },
      { path: "settings", element: <Settings /> },
      { path: "help-center", element: <HelpCenter /> },
    ],
  },
]);

export default router;

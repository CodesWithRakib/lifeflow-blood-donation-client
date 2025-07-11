import Root from "../layouts/Root";
import { createBrowserRouter } from "react-router";
import Home from "../pages/home/Home";
import Register from "../pages/registration/Register";
import Error from "../pages/error/Error";
import Login from "../pages/login/LogIn";
import SearchPage from "../pages/search/SearchPage";
import PrivateRoute from "../auth/PrivateRoute";
import DonationRequests from "../pages/Donation/DonationRequests";
import AboutUs from "../pages/about/AboutUs";
import FAQ from "../pages/Faq/FAQ";
import TermsOfService from "../pages/Terms/TermsOfService";
import AdminDashboard from "../pages/Dashboard/Admin/AdminDashboard";
import Profile from "../pages/Dashboard/Profile";
import ContactUs from "../pages/home/ContactUs";
import Blogs from "../pages/Blogs/Blogs";
import AdminRoute from "../auth/AdminRoute";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import MyDonationRequests from "../pages/Dashboard/MydonationRequests";
import CreateDonationRequest from "../components/form/CreateDonationRequest";
import DonationRequestDetails from "../pages/Donation/DonationRequestDetails";
import Funding from "../pages/Funding/Funding";
import AllUsers from "../pages/Dashboard/users/AllUsers";
import ContentManagement from "../pages/Dashboard/ContentManagement";
import AddBlog from "../pages/Dashboard/AddBlog";
import EditBlog from "../pages/Dashboard/EditBlog";
import BlogDetails from "../pages/Blogs/BlogDetails";
import Dashboard from "../layouts/Dashboard";
import EditDonationRequest from "../components/form/EditDonationRequest";
import BlogPreview from "../pages/Blogs/BlogPreview";
import Privacy from "../pages/Privacy/Privacy";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "search-donors", element: <SearchPage /> },
      { path: "blog", element: <Blogs /> },
      { path: "blogs/:id", element: <BlogDetails /> },
      { path: "contact", element: <ContactUs /> },
      { path: "about", element: <AboutUs /> },
      { path: "faq", element: <FAQ /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <TermsOfService /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },

      // Protected routes that don't use Dashboard layout
      {
        path: "funding",
        element: (
          <PrivateRoute>
            <Funding />
          </PrivateRoute>
        ),
      },
      {
        path: "donation-requests",
        element: (
          <PrivateRoute>
            <DonationRequests />
          </PrivateRoute>
        ),
      },
      {
        path: "donation-requests/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },
    ],
  },

  // Dashboard routes with separate layout
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "profile", element: <Profile /> },
      { path: "my-donation-requests", element: <MyDonationRequests /> },
      { path: "edit-donation/:id", element: <EditDonationRequest /> },
      { path: "donation-details/:id", element: <DonationRequestDetails /> },
      { path: "create-donation-request", element: <CreateDonationRequest /> },
      {
        path: "content-management",
        element: <ContentManagement />,
      },
      { path: "content-management/add-blog", element: <AddBlog /> },
      { path: "content-management/edit-blog/:id", element: <EditBlog /> },
      {
        path: "content-management/blog-preview/:id",
        element: <BlogPreview />,
      },
      // Admin-only routes
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
          <AdminRoute>
            <DonationRequests />
          </AdminRoute>
        ),
      },
    ],
  },

  // Separate admin dashboard route (if needed)
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      </PrivateRoute>
    ),
  },

  // Catch-all error route
  { path: "*", element: <Error /> },
]);

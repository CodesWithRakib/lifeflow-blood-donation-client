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
import PrivacyPolicy from "../pages/Privacy/PrivacyPolicy";
import TermsOfService from "../pages/Terms/TermsOfService";
import Dashboard from "../layouts/Dashboard";
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
import EditBlog from "../pages/Dashboard/EditBlog"; // Assuming you create this component

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <SearchPage /> },
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
      { path: "blog", element: <Blogs /> },
      { path: "contact", element: <ContactUs /> },
      { path: "about", element: <AboutUs /> },
      { path: "faq", element: <FAQ /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "terms", element: <TermsOfService /> },

      // Dashboard (User) Routes
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "profile", element: <Profile /> },
          { path: "my-donation-requests", element: <MyDonationRequests /> },
          {
            path: "create-donation-request",
            element: <CreateDonationRequest />,
          },

          // Admin-only routes inside dashboard wrapped with AdminRoute
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
          {
            path: "content-management",
            element: (
              <AdminRoute>
                <ContentManagement />
              </AdminRoute>
            ),
          },
          {
            path: "content-management/add-blog",
            element: (
              <AdminRoute>
                <AddBlog />
              </AdminRoute>
            ),
          },
          {
            path: "content-management/edit-blog/:id",
            element: (
              <AdminRoute>
                <EditBlog />
              </AdminRoute>
            ),
          },
        ],
      },

      // Admin dashboard route
      {
        path: "admin",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
    ],
  },

  // Auth routes (no layout)
  { path: "register", element: <Register /> },
  { path: "login", element: <Login /> },

  // Catch-all error route
  { path: "*", element: <Error /> },
]);

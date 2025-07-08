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
import FundingPage from "../pages/Funding/FundingPage";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import MyDonationRequests from "../pages/Dashboard/MydonationRequests";
import CreateDonationRequest from "../components/form/CreateDonationRequest";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "funding",
        element: (
          <PrivateRoute>
            <FundingPage />
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
        path: "blog",
        element: <Blogs />,
      },
      {
        path: "contact",
        element: <ContactUs />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "faq",
        element: <FAQ />,
      },
      {
        path: "privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms",
        element: <TermsOfService />,
      },
      // User routes
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "create-donation-request",
            element: (
              <PrivateRoute>
                <CreateDonationRequest />
              </PrivateRoute>
            ),
          },
          {
            path: "my-donation-requests",
            element: (
              <PrivateRoute>
                <MyDonationRequests />
              </PrivateRoute>
            ),
          },
          {},
        ],
      },
      // Admin routes
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
  // Auth routes
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "login",
    element: <Login />,
  },
  // Error route
  {
    path: "*",
    element: <Error />,
  },
]);

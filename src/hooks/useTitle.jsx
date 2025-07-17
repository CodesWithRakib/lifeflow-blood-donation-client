import { useEffect } from "react";
import { useLocation } from "react-router";

const useTitle = (title, defaultTitle = "LifeFlow - Blood Donation") => {
  const location = useLocation();

  useEffect(() => {
    // Set document title
    if (title) {
      document.title = `${title} | ${defaultTitle}`;
    } else {
      document.title = defaultTitle;
    }

    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Add smooth scrolling
    });

    return () => {
      document.title = defaultTitle;
    };
  }, [title, defaultTitle, location.pathname]);
};

export default useTitle;

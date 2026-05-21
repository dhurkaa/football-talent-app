import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../../context/AuthContext";

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const hideFooter =
    isAuthenticated &&
    !["/", "/login", "/register", "/about"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <main className={`flex-1 pt-20 ${isAuthenticated ? "lg:pt-32" : ""}`}>{children}</main>
      {hideFooter ? null : <Footer />}
    </div>
  );
};

export default Layout;

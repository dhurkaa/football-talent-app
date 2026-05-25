import React from "react";
import { useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const showSidebar = !isAuthPage;
  const hideFooter = showSidebar && location.pathname !== "/";

  return (
    <div className="min-h-screen bg-dark-950">
      <AppSidebar />
      <main className={showSidebar ? "min-h-screen pt-20 lg:ml-80 lg:pt-0" : "min-h-screen"}>{children}</main>
      {hideFooter ? null : <Footer />}
    </div>
  );
};

export default Layout;

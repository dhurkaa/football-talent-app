import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">404</p>
        <h1 className="mt-3 font-display text-5xl font-bold text-white">Page not found</h1>
        <p className="mt-4 text-lg text-dark-400">The page you are looking for does not exist or has moved.</p>
        <div className="mt-8">
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16">
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-600">The page you are looking for does not exist.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

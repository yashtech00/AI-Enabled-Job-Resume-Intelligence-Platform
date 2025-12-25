import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-sm font-semibold text-gray-900">
            AI Resume Platform
          </Link>
          <nav className="flex items-center gap-3">
            <Link to="/jobs" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Jobs
            </Link>
            <Link to="/resumes" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Resumes
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default Layout;

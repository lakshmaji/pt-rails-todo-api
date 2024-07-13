import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./common/Header";
import { useAuth } from "../application/hooks/useAuth";
import { useEffect } from "react";

const Layout = () => {
  let { auth } = useAuth();
  let location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoggedIn) {
      if (location.pathname === "/login" || location.pathname === "/signup") {
        navigate("/");
      }
    }
  }, [auth.isLoggedIn, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-400 transition-all duration-700">
      <Header />
      <main className="container mx-auto px-6 md:max-w-xl pb-5">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

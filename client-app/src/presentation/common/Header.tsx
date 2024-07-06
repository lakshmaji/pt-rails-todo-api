import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useLogoutUser } from "../../application/hooks/useLogoutUser";
import { useAuth } from "../../application/hooks/useAuth";

// TODO: move this to a hook
const initialStateDarkMode = localStorage.getItem("theme") === "dark";

const Header = () => {
  const [darkMode, setDarkMode] = useState(initialStateDarkMode);
  const { auth } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  const { onClickLogout } = useLogoutUser();

  return (
    <header className="container mx-auto md:max-w-xl px-6 py-10 ">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold uppercase tracking-[0.5em] text-white">
          Tasks
        </h1>

        <div className="flex items-center gap-2">
          {auth.isLoggedIn ? (
            <button
              onClick={onClickLogout}
              className="rounded-md bg-rose-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-1 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-1.5 me-2  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-1.5 me-2  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                to="/signup"
              >
                Signup
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={clsx(
              "text-white focus:ring-4 focus:outline-none focus:ring-indigo-200 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2",
              darkMode
                ? "bg-indigo-600 hover:bg-indigo-700  dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-700"
                : "bg-indigo-600 hover:bg-indigo-700  dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-700"
            )}
            aria-label="Theme switcher"
          >
            {darkMode ? (
              <SunIcon className="w-4 h-4 size-6 text-white-500" />
            ) : (
              <MoonIcon className="w-4 h-4 size-6 text-white-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

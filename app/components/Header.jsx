"use client";
import { useState, useEffect } from "react";
import { FaUserCircle, FaSearch, FaMoon, FaSun } from "react-icons/fa";
import Link from "next/link";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("");
  const [showLogOutForm, setShowLogOutForm] = useState(false);

  const showDelete = () => {
    setShowLogOutForm(true);
  };

  const cancelLogOut = () => {
    setShowLogOutForm(false);
  };

  const confirmLogOut = () => {
    // Add logout logic here (e.g., clearing tokens, redirecting to login page, etc.)
    //console.log("User logged out");
    setShowLogOutForm(false);
  };

  // On initial load, check if dark mode is enabled
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    const fetchUserRole = async () => {
      try {
        const response = await fetch(
          "http://localhost/admin-dashboard/api/login.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const text = await response.text(); // Fetch as text first to debug

        //console.log("Response Text:", text); // Log the raw response text for debugging

        try {
          const result = JSON.parse(text); // Try to parse manually
          //console.log("Parsed Result:", result);

          if (result.success) {
            setUserRole(result.role);
            setUserName(result.email);
            //console.log(result.email);
          } else {
            //console.log("Error:", result.message);
          }
        } catch (jsonError) {
          console.error("Failed to parse JSON:", jsonError);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchUserRole();
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between">
      <button
        className="text-black dark:text-white md:hidden focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="flex flex-col font-bold text-black dark:text-white gap-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/users">Users</Link>
          <Link href="/analytics">Analytics</Link>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-2 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg focus:outline-none"
        >
          {darkMode ? (
            <FaSun className="text-yellow-400" />
          ) : (
            <FaMoon className="text-gray-800" />
          )}
        </button>
        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <button onClick={showDelete}>
            <FaUserCircle
              className="text-gray-500 dark:text-gray-400"
              size={24}
            />
          </button>
          {(userRole === "admin" || userRole === "viewer" || userRole==="editor") && (
            <span className="text-gray-800 dark:text-white">{userName}</span>
          )}
        </div>
      </div>

      {/* Log Out Confirmation Modal */}
      {showLogOutForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to log out?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelLogOut}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogOut}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

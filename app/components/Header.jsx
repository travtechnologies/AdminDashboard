// components/Header.js
"use client";
import { useState, useEffect } from "react";
import { FaUserCircle, FaSearch, FaMoon, FaSun } from "react-icons/fa";
import Link from "next/link";
const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // On initial load, check if dark mode is enabled
  useEffect(() => {
    if (localStorage.theme === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
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
          <FaUserCircle
            className="text-gray-500 dark:text-gray-400"
            size={24}
          />
          <span className="text-gray-800 dark:text-white">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

"use client";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useEffect } from "react";
import Login from "../Login/page";

const Layout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Start as null to avoid mismatch

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check localStorage for login state
    setIsLoggedIn(isUserLoggedIn);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true"); // Set login state in localStorage
    setIsLoggedIn(true); // Update state
  };

  // Handle loading state while determining login status
  if (isLoggedIn === null) {
    return <div>Loading...</div>; // Prevents hydration error by showing loading state
  }

  return (
    <>
      {isLoggedIn ? (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 bg-white dark:bg-black">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default Layout;

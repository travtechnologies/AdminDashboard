"use client";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useEffect } from "react";
import Login from "../Login/page";

const Layout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Start as null to avoid mismatch

  useEffect(() => {
    // Replace with your actual logic to check login status
    const isUserLoggedIn = false/* your login check logic, e.g., from localStorage */;
    setIsLoggedIn(isUserLoggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
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

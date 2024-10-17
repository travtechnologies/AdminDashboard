"use client";
import React, { useEffect, useState } from "react";
import TableComponent from "../components/tables/products";

export default function Products() {
  const [data, setData] = useState([]);
  const [role,setRole] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/admin-dashboard/api/products.php", {
          method: "GET", // Adjust method as per your API needs
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const jsonData = await response.json();
          console.log(jsonData); // Check the response structure here
          if (jsonData.success) {
            setData(jsonData.products); // Assuming 'products' is the correct key
          } else {
            console.error("Error:", jsonData.message);
          }
        } else {
          console.error("Fetch error:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await fetch(
          "http://localhost/admin-dashboard/api/login.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
          }
        );
    
        const text = await response.text(); // Fetch as text first to debug
    
        console.log("Response Text:", text); // Log the raw response text for debugging
    
        try {
          const result = JSON.parse(text); // Try to parse manually
          console.log("Parsed Result:", result);
    
          if (result.success) {
            setRole(result.userRole);
          } else {
            console.log("Error:", result.message);
          }
        } catch (jsonError) {
          console.error("Failed to parse JSON:", jsonError);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    
  
    fetchData();
    fetchUserRole();
  }, []);
  
  

  return (
    <div className="flex flex-wrap justify-center items-center gap-5">
      <TableComponent data={data} userRole={role} />
    </div>
  );
}

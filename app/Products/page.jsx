"use client";
import React, { useEffect, useState } from "react";
import TableComponent from "../components/tables/products";

export default function Products() {
  const [data, setData] = useState([]);

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
  
    fetchData();
  }, []);
  
  

  return (
    <div className="flex flex-wrap justify-center items-center gap-5">
      <TableComponent data={data} />
    </div>
  );
}

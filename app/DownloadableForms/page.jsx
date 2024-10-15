"use client";
import { useEffect, useState } from "react";

export default function Forms() {
  const [sections, setSections] = useState([]);

  // Fetch sections from the database using useEffect
  useEffect(() => {
    async function fetchSections() {
      try {
        const response = await fetch('http://localhost/admin-dashboard/api/sections.php'); // Change to your PHP endpoint URL
        const data = await response.json();
        setSections(data); // Set the fetched sections data to state
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    }

    fetchSections();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold my-5">Downloadable Forms</h1>
      <div>
        {sections.map((section) => (
          <div key={section.id} className="mb-3">
            <h2 className="text-lg font-semibold">{section.title}</h2> {/* Display section title */}
          </div>
        ))}
      </div>
    </div>
  );
}

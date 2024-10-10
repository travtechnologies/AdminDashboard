"use client";
import TableComponent from "../components/tables/blogs";
import React, { useState } from "react";

export default function Blogs() {
  const [loading, setLoading] = useState(false); // Set loading to false since no data fetch is needed

  const staticData = [
    {
      id: 1,
      title: "Test Blog",
      author: "John Doe",
      content: "This is a test blog.",
      image: "/test-image.jpg",
    },
    {
      id: 2,
      title: "Another Test Blog",
      author: "Jane Doe",
      content: "This is another test blog.",
      image: "/another-test-image.jpg",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center items-center">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TableComponent data={staticData} />
      )}
    </div>
  );
}

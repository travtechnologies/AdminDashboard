// components/FormComponent.js
import { useState } from "react";

export default function FormComponent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState(" ");


  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = {
      title,
      description,
      price,
      imageUrl // Sending 'imageUrl' from the form
    };  
    // Send form data to PHP script using fetch()
    fetch('http://localhost/admin-dashboard/api/products.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert('Product added successfully');
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  

  

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Submit Your Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="price"
            className="block text-gray-700 font-medium mb-1"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="100"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="ImageUrl"
            className="block text-gray-700 font-medium mb-1"
          >
            Image Url
          </label>
          <input
            type="text"
            id="ImageUrl"
            name="ImageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)} // Corrected handler
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

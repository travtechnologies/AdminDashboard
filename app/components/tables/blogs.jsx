import React, { useState } from "react";
import FormComponent from "../forms/blog";
import Link from "next/link";

const TableComponent = ({ data, onAdd }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteFormVisible, setIsDeleteFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    author_name: "",
    content: "",
  });

  
  // Adding a new Blog

  const handleAddNewBlog = () => {
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setIsEditFormVisible(false);
  };

  // Deleting the blog

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteFormVisible(true);
  };

  const cancelDelete = () => {
    setIsDeleteFormVisible(false);
    setItemToDelete(null);
  };

  const confirmDelete = (e) => {
    e.preventDefault();

    const requestBody = JSON.stringify({ id: itemToDelete.id });

    // After console logging it's clear that the the id is correct.
    console.log(requestBody);

    fetch("http://localhost/admin-dashboard/api/blogs.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          alert("Blog deleted successfully");
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
      })
      .finally(() => {
        setIsDeleteFormVisible(false);
        setItemToDelete(null);
      });
  };

  // Editing the blog

  const handleEdit = (item) => {
    setItemToEdit(item);
    setEditFormData({
      title: item.blog_title,
      author_name: item.author_name,
      content: item.blog_title,
    });
    setIsEditFormVisible(true);
  };


  const closeEditModal = () => {
    setIsEditFormVisible(false);
    setItemToEdit(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const requestBody = JSON.stringify({
      id: itemToEdit.id, // Corrected variable name
      title: editFormData.title,
      author: editFormData.author_name, // Ensure this matches your state
      content: editFormData.content,
    });


    fetch("http://localhost/admin-dashboard/api/blogs.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          alert("Blog updated successfully");
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
      })
      .finally(() => {
        setIsEditFormVisible(false); // Close the modal on success
        setItemToEdit(null);
      });
  };




  return (
    <div className="p-6">
      <button
        onClick={handleAddNewBlog}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded ml-auto hover:bg-blue-600"
      >
        Add New Blog
      </button>

      {isFormVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FormComponent onClose={closeForm} onAdd={onAdd} />
            <button
              onClick={closeForm}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isEditFormVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl">Edit Blog</h2>
            <form>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditFormChange}
                className="border p-2 w-full mb-4"
              />
              <label>Author</label>
              <input
                type="text"
                name="author"
                value={editFormData.author_name}
                onChange={handleEditFormChange}
                className="border p-2 w-full mb-4"
              />
              <label>Content</label>
              <textarea
                type="text"
                name="content"
                value={editFormData.content}
                onChange={handleEditFormChange}
                className="border p-2 w-full mb-4 h-32"
              />
              <button
                onClick={handleEditSubmit}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </form>
            <button
              onClick={closeEditModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isDeleteFormVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
            >
              Yes, Delete
            </button>
            <button
              onClick={cancelDelete}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="w-full bg-gray-100 border-b border-gray-200">
              <th className="py-3 px-6 text-left text-gray-600">Sl No</th>
              <th className="py-3 px-6 text-left text-gray-600">Title</th>
              <th className="py-3 px-6 text-left text-gray-600">Author</th>
              <th className="py-3 px-6 text-left text-gray-600">Content</th>
              <th className="py-3 px-6 text-left text-gray-600">View Blog</th>
              <th className="py-3 px-6 text-left text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">{item.blog_title}</td>
                <td className="py-3 px-6">{item.author_name}</td>
                <td className="py-3 px-6">{item.blog_content}</td>
                <td className="py-3 px-6">
                  <Link href={`/blog/${item.id}`}>
                    <button className="rounded-lg bg-green-400 p-2 hover:bg-green-600">
                      View
                    </button>
                  </Link>
                </td>
                <td className="py-3 px-6">
                  <div className="flex">
                    <button
                      onClick={() => handleDelete(item)}
                      className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;

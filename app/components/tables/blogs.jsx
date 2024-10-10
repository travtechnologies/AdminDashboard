import React, { useState } from "react";
import FormComponent from "../forms/blog";
import Link from "next/link";

const TableComponent = ({ data, onAdd }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log("Deleted:", itemToDelete);
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    // Add logic here to remove the item from your data source
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setIsEditFormVisible(false);
  };

  const handleAddNewBlog = () => {
    setIsFormVisible(true);
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

      {isEditFormVisible && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl">Edit Blog</h2>
            <form>
              <label>Title</label>
              <input
                type="text"
                defaultValue={selectedItem.title}
                className="border p-2 w-full mb-4"
              />
              <label>Author</label>
              <input
                type="text"
                defaultValue={selectedItem.author}
                className="border p-2 w-full mb-4"
              />
              <label>Content</label>
              <textarea
                defaultValue={selectedItem.content}
                className="border p-2 w-full mb-4 h-32"
              />
              <label>Image URL</label>
              <input
                type="text"
                defaultValue={selectedItem.image}
                className="border p-2 w-full mb-4"
              />
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </form>
            <button
              onClick={closeForm}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
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
                <td className="py-3 px-6">{item.title}</td>
                <td className="py-3 px-6">{item.author}</td>
                <td className="py-3 px-6">{item.content}</td>
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

import React, { useState } from "react";
import Image from "next/image";
import FormComponent from "../forms/prd";
import ball from "@/api/products/football.png";

const TableComponent = ({ data }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    console.log("Deleted:", itemToDelete);
    setIsDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
    setEditFormData({
      title: item.title,
      description: item.description,
      price: item.price,
      image: item.url,
    });
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setItemToEdit(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = () => {
    console.log("Updated item:", { ...itemToEdit, ...editFormData });
    setIsEditModalVisible(false);
    setItemToEdit(null);
  };

  const handleAddNewProduct = () => {
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
  };

  return (
    <div className="p-6">
      <button
        onClick={handleAddNewProduct}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded ml-auto hover:bg-blue-600"
      >
        Add New Product
      </button>

      {/* Add Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FormComponent />
            <button
              onClick={closeForm}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this item?
            </h3>
            <div className="flex justify-end">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 p-2 rounded"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="text"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={editFormData.image}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </form>
            <div className="flex justify-end">
              <button
                onClick={handleEditSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                onClick={closeEditModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="w-full bg-gray-100 border-b border-gray-200">
              <th className="py-3 px-6 text-left text-gray-600">Sl No</th>
              <th className="py-3 px-6 text-left text-gray-600">Thumbnail</th>
              <th className="py-3 px-6 text-left text-gray-600">Title</th>
              <th className="py-3 px-6 text-left text-gray-600">Description</th>
              <th className="py-3 px-6 text-left text-gray-600">Price</th>
              <th className="py-3 px-6 text-left text-gray-600">Image URL</th>
              <th className="py-3 px-6 text-left text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Render fetched data here */}
            {Array.isArray(data) ? (
              data.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6">
                    <Image
                      src={item.url}
                      alt={item.title}
                      width={30}
                      height={30}
                      className="object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-6">{item.title}</td>
                  <td className="py-3 px-6">{item.description}</td>
                  <td className="py-3 px-6">${item.price}</td>
                  <td className="py-3 px-6">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer" // Add this line
                      className="text-blue-500 hover:underline"
                    >
                      View me
                    </a>
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
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-3 px-6 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;

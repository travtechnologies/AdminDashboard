"use client";
import { useState } from 'react';
import { FaFileDownload, FaQuestionCircle, FaChevronDown, FaChevronUp, FaTrash, FaPlus } from 'react-icons/fa';

const DownloadSection = () => {
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [formData, setFormData] = useState({ sectionIndex: null, name: '', file: null });
  const [isFormPopupOpen, setFormPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', index: null, linkIndex: null });

  const toggleSection = (index) => {
    setSections((prevSections) =>
      prevSections.map((section, i) =>
        i === index ? { ...section, isOpen: !section.isOpen } : section
      )
    );
  };

  const addNewSection = () => {
    if (newSectionName.trim() === '') return;
    const newSection = { title: newSectionName, isOpen: false, links: [] };
    setSections((prevSections) => [...prevSections, newSection]);
    setNewSectionName('');
  };

  const deleteSection = (index) => {
    setDeleteTarget({ type: 'section', index });
    setDeletePopupOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget.type === 'section') {
      setSections((prevSections) => prevSections.filter((_, i) => i !== deleteTarget.index));
    } else if (deleteTarget.type === 'form') {
      const { index, linkIndex } = deleteTarget;
      setSections((prevSections) =>
        prevSections.map((section, i) =>
          i === index
            ? { ...section, links: section.links.filter((_, j) => j !== linkIndex) }
            : section
        )
      );
    }
    setDeletePopupOpen(false);
  };

  const openFormPopup = (index) => {
    setFormData({ sectionIndex: index, name: '', file: null });
    setFormPopupOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'file' ? files[0] : value,
    }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    const { sectionIndex, name, file } = formData;
    if (name && file) {
      const newLink = { text: name, file: URL.createObjectURL(file) };
      setSections((prevSections) =>
        prevSections.map((section, i) =>
          i === sectionIndex ? { ...section, links: [...section.links, newLink] } : section
        )
      );
      setFormPopupOpen(false);
    }
  };

  const deleteForm = (sectionIndex, linkIndex) => {
    setDeleteTarget({ type: 'form', index: sectionIndex, linkIndex });
    setDeletePopupOpen(true);
  };

  return (
    <div className="m-5 border border-gray-200 rounded-lg">
      {sections.map((section, index) => (
        <div key={index} className="border-b border-gray-200">
          <div className="flex justify-between items-center px-4 py-3 cursor-pointer bg-gray-100 hover:bg-gray-200">
            <div onClick={() => toggleSection(index)} className="flex items-center">
              <FaQuestionCircle className="text-blue-500" />
              <span className="font-semibold">{section.title}</span>
              {section.isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div className="flex items-center">
              <FaTrash className="text-red-500 cursor-pointer ml-2" onClick={() => deleteSection(index)} />
              <FaPlus className="text-green-500 cursor-pointer ml-2" onClick={() => openFormPopup(index)} />
            </div>
          </div>
          {section.isOpen && (
            <div className="px-6 py-3">
              {section.links.map((link, linkIndex) => (
                <div key={linkIndex} className="flex justify-between items-center">
                  <DownloadLink text={link.text} file={link.file} />
                  <FaTrash
                    className="text-red-500 cursor-pointer ml-2"
                    onClick={() => deleteForm(index, linkIndex)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="flex items-center justify-center mt-4 mb-2">
        <input
          type="text"
          placeholder="New Section Name"
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={addNewSection}
        >
          Add New Section
        </button>
      </div>

      {/* Form Popup */}
      {isFormPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <form
            onSubmit={submitForm}
            className="bg-white p-6 rounded shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Add New Form</h2>
            <input
              type="text"
              name="name"
              placeholder="Form Name"
              value={formData.name}
              onChange={handleFormChange}
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
            />
            <input
              type="file"
              name="file"
              onChange={handleFormChange}
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
                onClick={() => setFormPopupOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
                onClick={() => setDeletePopupOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DownloadLink = ({ text, file }) => (
  <div className="flex items-center py-2 text-blue-500 hover:underline">
    <FaFileDownload className="mr-2" />
    <a href={file} download>{text}</a>
  </div>
);

export default DownloadSection;

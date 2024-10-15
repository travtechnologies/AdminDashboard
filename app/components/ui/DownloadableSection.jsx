"use client";
import { useEffect, useState } from 'react';
import { FaFileDownload, FaQuestionCircle, FaChevronDown, FaChevronUp, FaTrash, FaPlus } from 'react-icons/fa';

const DownloadSection = ({ defaultOpenSectionIndex = null }) => {
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [formData, setFormData] = useState(
    { sectionIndex: null, name: '', path: '' });
  const [isFormPopupOpen, setFormPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', index: null, linkIndex: null });

  // Use useEffect to open the default section based on the passed prop
  useEffect(() => {
    if (defaultOpenSectionIndex !== null) {
      setSections((prevSections) =>
        prevSections.map((section, i) => 
          i === defaultOpenSectionIndex ? { ...section, isOpen: true } : section
        )
      );
    }
  }, [defaultOpenSectionIndex]);

  const toggleSection = (index) => {
    setSections((prevSections) =>
      prevSections.map((section, i) =>
        i === index ? { ...section, isOpen: !section.isOpen } : section
      )
    );
  };

  const addNewSection = async () => {
    if (newSectionName.trim() === '') return;

    console.log(newSectionName); // Check if the newSectionName is being logged

    try {
        const response = await fetch('http://localhost/admin-dashboard/api/sections.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sectionName: newSectionName }), // Sending sectionName in JSON format
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const newSection = { title: newSectionName, isOpen: false, links: [] };
            setSections((prevSections) => [...prevSections, newSection]);
            setNewSectionName(''); // Clear the input field
        } else {
            console.error('Error saving section:', data.message); // Log the error message
        }
    } catch (error) {
        console.error('Error:', error.message); // Handle network errors
    }
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

  const submitForm = async (e) => {
    e.preventDefault();
    const { sectionIndex, name, file } = formData;

    if (name && file) {
      const formDataToSend = new FormData();
      formDataToSend.append('section_id', sectionIndex); // Assuming you're passing the section ID.
      formDataToSend.append('name', name);
      formDataToSend.append('file', file);

      try {
        const response = await fetch('http://localhost/admin-dashboard/api/forms.php', {
          method: 'POST',
          body: formDataToSend,
        });

        const data = await response.json();
        if (data.success) {
          const newLink = { text: name, file: URL.createObjectURL(file) };
          setSections((prevSections) =>
            prevSections.map((section, i) =>
              i === sectionIndex ? { ...section, links: [...section.links, newLink] } : section
            )
          );
          setFormPopupOpen(false);
        } else {
          console.error('Error saving form:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
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
              type="text"
              name="name"
              placeholder="Form Path"
              value={formData.path}
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
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this?</h2>
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
                onClick={() => setDeletePopupOpen(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DownloadLink = ({ text, file }) => (
  <a href={file} download className="flex items-center hover:text-blue-500">
    <FaFileDownload className="mr-2" />
    {text}
  </a>
);

export default DownloadSection;

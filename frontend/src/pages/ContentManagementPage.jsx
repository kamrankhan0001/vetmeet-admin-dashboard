import React, { useState } from 'react';
import ContentFormModal from '../pages/ContentFormModal';

const ContentManagementPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [contentType, setContentType] = useState('faq'); // default content type

  const handleAddClick = (type) => {
    setContentType(type);
    setEditingContent(null);
    setShowModal(true);
  };

  const handleSaveContent = (newContent) => {
    console.log("Saved content:", newContent);
    // Here you can send the data to your backend or update local state
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Content</h2>

      <div className="space-x-4 mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleAddClick('faq')}
        >
          Add FAQ
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleAddClick('banner')}
        >
          Add Banner
        </button>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-md"
          onClick={() => handleAddClick('aboutUs')}
        >
          Update About Us
        </button>
      </div>

      {showModal && (
        <ContentFormModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveContent}
          contentType={contentType}
          editingContent={editingContent}
        />
      )}
    </div>
  );
};

export default ContentManagementPage;

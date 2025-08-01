import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const ContentFormModal = ({ onClose, onSave, contentType, editingContent }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    // Load form data from editingContent or initialize based on contentType
    if (editingContent) {
      setFormData(editingContent);
    } else {
      switch (contentType) {
        case 'faq':
          setFormData({ question: '', answer: '' });
          break;
        case 'banner':
          setFormData({ title: '', subtitle: '', imageUrl: '', link: '' });
          break;
        case 'aboutUs':
          setFormData({ content: '' });
          break;
        default:
          setFormData({});
      }
    }
  }, [contentType, editingContent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (contentType === 'faq' && (!formData.question || !formData.answer)) {
      return setError('Question and Answer are required.');
    }

    if (contentType === 'banner' && (!formData.title || !formData.imageUrl)) {
      return setError('Title and Image URL are required.');
    }

    if (contentType === 'aboutUs' && !formData.content) {
      return setError('Content is required.');
    }

    onSave(formData); // Send data to parent
    onClose();         // Close modal
  };

  const getModalTitle = () => {
    if (editingContent) {
      return contentType === 'faq' ? 'Edit FAQ'
        : contentType === 'banner' ? 'Edit Banner'
        : 'Edit About Us';
    } else {
      return contentType === 'faq' ? 'Add New FAQ'
        : contentType === 'banner' ? 'Add New Banner'
        : 'Update About Us';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">{getModalTitle()}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {contentType === 'faq' && (
            <>
              <div>
                <label className="block text-sm font-medium">Question*</label>
                <input
                  type="text"
                  name="question"
                  value={formData.question || ''}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Answer*</label>
                <textarea
                  name="answer"
                  value={formData.answer || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full mt-1 p-2 border rounded"
                  required
                />
              </div>
            </>
          )}

          {contentType === 'banner' && (
            <>
              <div>
                <label className="block text-sm font-medium">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle || ''}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Image URL*</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Link (optional)</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link || ''}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
            </>
          )}

          {contentType === 'aboutUs' && (
            <div>
              <label className="block text-sm font-medium">About Us Content*</label>
              <textarea
                name="content"
                value={formData.content || ''}
                onChange={handleChange}
                rows={6}
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            {editingContent ? 'Update' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContentFormModal;

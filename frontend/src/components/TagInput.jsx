import React, { useState } from 'react';
import { X } from 'lucide-react';

const TagInput = ({ tags, setTags, placeholder = "Add a tag..." }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim().toUpperCase(); // Enforce uppercase
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {tags.map(tag => (
          <span
            key={tag}
            style={{
              background: '#f0f0f0',
              padding: '0.3rem 0.6rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              border: '2px solid #ccc'
            }}
          >
            {tag}
            <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)} />
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          className="sketch-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          className="sketch-button secondary"
          onClick={addTag}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default TagInput;

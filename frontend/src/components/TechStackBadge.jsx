import React from 'react';

const TechStackBadge = ({ text }) => {
  return (
    <span
      className="tech-badge"
      style={{
        display: 'inline-block',
        background: '#e0e0e0',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: '#333',
        marginRight: '0.3rem',
        marginBottom: '0.3rem',
        border: '1px solid #ccc',
      }}
    >
      {text}
    </span>
  );
};

export default TechStackBadge;

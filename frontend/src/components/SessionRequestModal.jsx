import React, { useState } from 'react';

const SessionRequestModal = ({ onClose, onSubmit }) => {
  const [message, setMessage] = useState('');
  
  const getWordCount = (text) => text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const wordCount = getWordCount(message);
  const isOverLimit = wordCount > 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOverLimit) return;
    onSubmit(message);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="sketch-card sketch-card-tape" style={{ width: '90%', maxWidth: '500px', backgroundColor: 'var(--card-bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Request Session</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontWeight: 'bold' }}>Message (Max 100 words)</label>
            <textarea 
              className="sketch-input" 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              rows={5} 
              placeholder="Why do you want a session? What do you want to learn?"
              required 
            />
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: isOverLimit ? 'red' : '#666', marginTop: '0.2rem' }}>
              {wordCount} / 100 words
            </div>
          </div>

          <button 
            type="submit" 
            className="sketch-button primary" 
            style={{ alignSelf: 'flex-end', marginTop: '1rem' }}
            disabled={isOverLimit}
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default SessionRequestModal;

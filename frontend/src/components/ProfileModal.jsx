import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { sessionRequestsApi } from '../api';
import { SketchButton, SketchCard } from './Sketch';
import SessionRequestModal from './SessionRequestModal';

const ProfileModal = ({ user, onClose }) => {
  const [showSessionModal, setShowSessionModal] = useState(false);

  const handleSessionRequest = async (message) => {
    try {
      await sessionRequestsApi.create({ toUserId: user.id, message });
      alert('Session request sent successfully!');
      setShowSessionModal(false);
      onClose();
    } catch (err) {
      alert('Failed to send request: ' + (err.response?.data?.message || err.message));
    }
  };

  if (!user) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      {showSessionModal ? (
        <SessionRequestModal 
          onClose={() => setShowSessionModal(false)}
          onSubmit={handleSessionRequest}
        />
      ) : (
        <SketchCard decoration="tape" style={{ width: '90%', maxWidth: '500px', backgroundColor: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img 
                src={`/avatars/${user.avatarId || 'avatar1'}.svg`} 
                alt={user.name} 
                style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #ccc' }} 
              />
              <div>
                <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--fg-color)' }}>{user.name}</h2>
                <div style={{ fontSize: '1rem', color: 'var(--fg-color)', opacity: 0.8 }}>{user.experience} • {user.company}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--fg-color)' }}>&times;</button>
          </div>
          <p style={{ fontStyle: 'italic', color: 'var(--fg-color)', opacity: 0.8, marginBottom: '1.5rem' }}>{user.bio || 'No bio provided.'}</p>
          
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--fg-color)' }}>Tech Stack:</h3>
          {user.techStack && user.techStack.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
              {user.techStack.map((tech, idx) => (
                <span key={idx} style={{ background: 'var(--muted-color)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem', border: '1px solid var(--fg-color)', color: 'var(--fg-color)' }}>
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontStyle: 'italic', color: 'var(--fg-color)', opacity: 0.8, marginBottom: '2rem' }}>No tech stack listed.</p>
          )}
          
          <SketchButton primary onClick={() => setShowSessionModal(true)} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} /> Request Session
          </SketchButton>
        </SketchCard>
      )}
    </div>
  );
};

export default ProfileModal;

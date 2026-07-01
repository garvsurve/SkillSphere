import React from 'react';

const AvatarPicker = ({ selectedAvatarId, onSelect }) => {
  // Avatars 1-8 are available in /public/avatars/
  const avatars = Array.from({ length: 8 }, (_, i) => `avatar${i + 1}`);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Choose your avatar:</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {avatars.map((avatarId) => (
          <img
            key={avatarId}
            src={`/avatars/${avatarId}.svg`}
            alt={avatarId}
            style={{
              width: '100%',
              cursor: 'pointer',
              border: selectedAvatarId === avatarId ? '4px solid #ff4d4d' : '4px solid transparent',
              borderRadius: '50%',
              padding: '2px',
              transition: 'border 0.2s',
            }}
            onClick={() => onSelect(avatarId)}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarPicker;

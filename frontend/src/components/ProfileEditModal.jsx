import React, { useState } from 'react';
import AvatarPicker from './AvatarPicker';
import TagInput from './TagInput';

const ProfileEditModal = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [experience, setExperience] = useState(user?.experience || 'Fresher');
  const [company, setCompany] = useState(user?.company || '');
  const [avatarId, setAvatarId] = useState(user?.avatarId || 'avatar1');
  const [techStack, setTechStack] = useState(user?.techStack || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, bio, experience, company, avatarId, techStack });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="sketch-card sketch-card-tape" style={{ width: '90%', maxWidth: '600px', backgroundColor: 'var(--card-bg)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Edit Profile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AvatarPicker selectedAvatarId={avatarId} onSelect={setAvatarId} />

          <div>
            <label style={{ fontWeight: 'bold' }}>Name (Required)</label>
            <input className="sketch-input" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Bio</label>
            <textarea className="sketch-input" value={bio} onChange={e => setBio(e.target.value)} rows={3} />
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Experience</label>
            <select className="sketch-input" value={experience} onChange={e => setExperience(e.target.value)}>
              <option value="Fresher">Fresher</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="3+ years">3+ years</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Company / Institute</label>
            <input className="sketch-input" value={company} onChange={e => setCompany(e.target.value)} />
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Tech Stack / Domains</label>
            <TagInput tags={techStack} setTags={setTechStack} placeholder="e.g. REACT, NODEJS" />
          </div>

          <button type="submit" className="sketch-button primary" style={{ alignSelf: 'flex-end', marginTop: '1rem' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;

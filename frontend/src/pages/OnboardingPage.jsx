import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarPicker from '../components/AvatarPicker';
import TagInput from '../components/TagInput';
import { usersApi } from '../api';

const OnboardingPage = ({ user, setUser }) => {
  const [bio, setBio] = useState(user?.bio || '');
  const [experience, setExperience] = useState('Fresher');
  const [company, setCompany] = useState('');
  const [avatarId, setAvatarId] = useState('avatar1');
  const [techStack, setTechStack] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name: user.name, // Keep existing name
        bio,
        experience,
        company,
        avatarId,
        techStack
      };
      const res = await usersApi.updateProfile(user.userId || user.id, updatedData);
      
      // Update local storage and context
      const newUserData = { ...user, ...res.data, userId: res.data.id };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      
      navigate('/feed');
    } catch (err) {
      alert('Failed to save profile: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '4rem', paddingBottom: '4rem' }}>
      <div className="sketch-card sketch-card-tack" style={{ transform: 'rotate(0.5deg)' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome, {user?.name}!</h2>
        <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>Let's get your profile set up so others can know you better.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <AvatarPicker selectedAvatarId={avatarId} onSelect={setAvatarId} />

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Bio</label>
            <textarea 
              className="sketch-input" 
              placeholder="Tell us a bit about yourself..." 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              rows={3} 
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Experience</label>
            <select className="sketch-input" value={experience} onChange={e => setExperience(e.target.value)}>
              <option value="Fresher">Fresher</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="3+ years">3+ years</option>
              <option value="5+ years">5+ years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Company / Institute</label>
            <input 
              className="sketch-input" 
              placeholder="Where do you work or study?" 
              value={company} 
              onChange={e => setCompany(e.target.value)} 
            />
          </div>

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Tech Stack / Domains</label>
            <TagInput tags={techStack} setTags={setTechStack} placeholder="e.g. REACT, SPRING BOOT" />
          </div>

          <button type="submit" className="sketch-button primary" style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
            Let's go!
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;

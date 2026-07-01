import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, FolderDot, Code2, Link as LinkIcon, Compass, Share2, Lightbulb, Pickaxe, Network } from 'lucide-react';
import { usersApi } from '../api';
import { SketchCard, SketchButton } from '../components/Sketch';
import ProfileModal from '../components/ProfileModal';

// Mock Intents for UI demonstration
const INTENTS = [
  'Open to Work', 'Open to Collaborate', 'Learning', 'Need Help', 
  'Can Help', 'Looking for Projects', 'Building Startup', 
  'Side Projects', 'Open Source', 'Interview Prep'
];

const INTENT_COLORS = {
  'Open to Work': '#a8e6cf',
  'Open to Collaborate': '#ffd3b6',
  'Learning': '#ffaaa5',
  'Need Help': '#ff8b94',
  'Can Help': '#dcedc1',
  'Looking for Projects': '#c5a3ff',
  'Building Startup': '#f6e58d',
  'Side Projects': '#7bed9f',
  'Open Source': '#70a1ff',
  'Interview Prep': '#ff7f50'
};

const DiscoverPage = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeIntent, setActiveIntent] = useState('All');
  const [enrichedUsers, setEnrichedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await usersApi.getAll();
        // Keep stats mocked since they don't exist in backend, but use real intents
        const enriched = res.data.map(user => {
          return {
            ...user,
            intents: user.intents || [],
            followers: (user.id * 43) % 1500,
            projects: (user.id * 7) % 25,
            contributions: (user.id * 91) % 500,
            location: user.company ? `${user.company} HQ` : 'Remote'
          };
        });
        setUsers(enriched);
        setEnrichedUsers(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = enrichedUsers.filter(user => {
    if (activeIntent !== 'All' && !user.intents.includes(activeIntent)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return user.name.toLowerCase().includes(q) || 
           (user.techStack && user.techStack.some(tech => tech.toLowerCase().includes(q))) ||
           (user.company && user.company.toLowerCase().includes(q)) ||
           user.intents.some(intent => intent.toLowerCase().includes(q));
  });

  return (
    <div className="container" style={{ maxWidth: '1440px', padding: '2rem 4rem' }}>
      
      {/* HERO SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '4.5rem', marginBottom: '1rem', transform: 'rotate(-1deg)' }}>
          Discover amazing people, <br/> share knowledge, <span className="marker-highlight">build together.</span>
        </h1>
        <p style={{ fontSize: '1.6rem', color: 'var(--fg-color)', opacity: 0.8, marginBottom: '3rem', fontFamily: "'Kalam', cursive" }}>
          "Everyone knows something. Everyone wants to learn something."
        </p>

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto 3rem', transform: 'rotate(0.5deg)' }}>
          <input 
            className="sketch-input" 
            placeholder="Search for skills, people, or intents..." 
            style={{ paddingLeft: '3.5rem', height: '70px', fontSize: '1.6rem', borderRadius: 'var(--wobbly)' }}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-color)', width: '32px', height: '32px' }} />
        </div>

        {/* INTENT FILTERS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
          <button 
            className="sketch-button"
            style={{ 
              padding: '0.4rem 1rem', 
              fontSize: '1.1rem', 
              background: activeIntent === 'All' ? 'var(--fg-color)' : 'transparent',
              color: activeIntent === 'All' ? 'var(--bg-color)' : 'var(--fg-color)'
            }}
            onClick={() => setActiveIntent('All')}
          >
            All Intents
          </button>
          {INTENTS.map(intent => (
            <button 
              key={intent}
              className="sketch-button"
              style={{ 
                padding: '0.4rem 1rem', 
                fontSize: '1.1rem', 
                background: activeIntent === intent ? INTENT_COLORS[intent] : 'transparent',
                border: `2px solid ${activeIntent === intent ? 'var(--fg-color)' : 'var(--muted-color)'}`,
                boxShadow: activeIntent === intent ? '2px 2px 0px 0px var(--shadow-color)' : 'none'
              }}
              onClick={() => setActiveIntent(activeIntent === intent ? 'All' : intent)}
            >
              {intent}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '4rem', alignItems: 'start' }}>
        
        {/* LEFT MAIN CONTENT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '3rem' }}>
          {loading ? (
            <div className="loading-sketch">
              <div className="loading-circle"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '4rem', 
              fontSize: '1.8rem', 
              fontFamily: "'Kalam', cursive", 
              opacity: 0.7 
            }}>
              No developers found matching your search.
            </div>
          ) : (
            filteredUsers.map((user, index) => {
              const decorations = ['tape', 'tack', 'clip', null];
              const decoration = decorations[index % decorations.length];
            
            return (
              <SketchCard 
                key={user.id} 
                decoration={decoration}
                style={{ transform: `rotate(${index % 2 === 0 ? -1 : 1.5}deg)`, display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <img 
                    src={`/avatars/${user.avatarId || 'avatar1'}.svg`} 
                    alt={user.name} 
                    style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid var(--fg-color)', background: '#fff' }} 
                  />
                  <div>
                    <h3 style={{ fontSize: '1.8rem', margin: '0 0 0.2rem' }}>{user.name}</h3>
                    <div style={{ fontSize: '1rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                      <Code2 size={14} /> {user.experience} • {user.company || 'Indie'}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={14} /> {user.location}
                    </div>
                  </div>
                </div>

                {/* Looking For Badges */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem', fontFamily: "'Kalam', cursive" }}>Looking For:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {user.intents.map(intent => (
                      <span key={intent} style={{ 
                        background: INTENT_COLORS[intent], 
                        color: '#2d2d2d',
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.85rem', 
                        border: '1px solid var(--fg-color)',
                        fontWeight: 'bold'
                      }}>
                        {intent}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                  <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem', fontFamily: "'Kalam', cursive" }}>Skills:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {user.techStack && user.techStack.length > 0 ? (
                      user.techStack.slice(0, 4).map((tech, idx) => (
                        <span key={idx} style={{ 
                          background: 'var(--card-bg)', 
                          padding: '0.3rem 0.8rem', 
                          borderRadius: '20px', 
                          fontSize: '0.9rem', 
                          border: '2px solid var(--muted-color)',
                        }}>
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontStyle: 'italic', opacity: 0.6 }}>No skills listed</span>
                    )}
                    {user.techStack && user.techStack.length > 4 && (
                      <span style={{ fontSize: '0.9rem', opacity: 0.6, padding: '0.3rem' }}>+{user.techStack.length - 4}</span>
                    )}
                  </div>
                </div>



                <SketchButton 
                  primary 
                  style={{ width: '100%', justifyContent: 'center', fontSize: '1.2rem' }}
                  onClick={() => setSelectedUser(user)}
                >
                  <Compass size={18} /> View Profile
                </SketchButton>
              </SketchCard>
            );
          }))}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          


          {/* Suggested Connections */}
          <SketchCard decoration="clip" style={{ transform: 'rotate(0.5deg)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}><Users size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}/> Suggested</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {enrichedUsers.slice(0, 3).map(user => (
                <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={`/avatars/${user.avatarId || 'avatar1'}.svg`} alt="Avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--fg-color)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Shared: {user.techStack?.[0] || 'Learning'}</div>
                  </div>
                  <SketchButton style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }} onClick={() => setSelectedUser(user)}>
                    <LinkIcon size={14} /> Connect
                  </SketchButton>
                </div>
              ))}
            </div>
          </SketchCard>
        </div>

      </div>

      {/* BOTTOM FEATURE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '6rem' }}>
        <SketchCard decoration="tape" style={{ background: '#dcedc1', transform: 'rotate(-1deg)' }}>
          <Share2 size={32} style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Share what you know</h3>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Help others grow and solidify your own understanding.</p>
        </SketchCard>
        
        <SketchCard decoration="tack" style={{ background: '#ffd3b6', transform: 'rotate(1deg)' }}>
          <Lightbulb size={32} style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Learn from others</h3>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Discover new perspectives and master difficult topics.</p>
        </SketchCard>
        
        <SketchCard decoration="clip" style={{ background: '#ffaaa5', transform: 'rotate(-0.5deg)' }}>
          <Pickaxe size={32} style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Build together</h3>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Find collaborators for your next big side project.</p>
        </SketchCard>
        
        <SketchCard decoration="tape" style={{ background: '#c5a3ff', transform: 'rotate(0.5deg)' }}>
          <Network size={32} style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Grow your network</h3>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Connect based on skills and shared interests, not titles.</p>
        </SketchCard>
      </div>

      {selectedUser && <ProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

export default DiscoverPage;

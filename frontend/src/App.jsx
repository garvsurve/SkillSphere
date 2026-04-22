import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate 
} from 'react-router-dom';
import { Search, LogOut, Sparkles, BookOpen, Map, ArrowRight, UserPlus, Fingerprint } from 'lucide-react';
import api, { authApi, skillsApi, usersApi } from './api';

// --- ATOMS / REUSABLE SKETCH COMPONENTS ---

const SketchButton = ({ children, primary = false, secondary = false, onClick, type = "button", style }) => {
  let className = "sketch-button";
  if (primary) className += " primary";
  if (secondary) className += " secondary";
  
  return (
    <button className={className} onClick={onClick} type={type} style={style}>
      {children}
    </button>
  );
};

const SketchCard = ({ children, decoration = null, style, className = "" }) => {
  let decorClass = "";
  if (decoration === "tape") decorClass = "sketch-card-tape";
  if (decoration === "tack") decorClass = "sketch-card-tack";
  
  return (
    <div className={`sketch-card ${decorClass} ${className}`} style={style}>
      {children}
    </div>
  );
};

// --- LAYOUT COMPONENTS ---

const Navbar = ({ user, onLogout }) => (
  <nav className="nav">
    <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
      SkillSphere<span className="correction-mark">!</span>
    </Link>
    <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
      <Link to="/discover" className="font-heading" style={{ textDecoration: 'none', color: 'inherit' }}>discover</Link>
      {user ? (
        <>
          <Link to="/dashboard" className="font-heading" style={{ textDecoration: 'none', color: 'inherit' }}>my stuff</Link>
          <SketchButton onClick={onLogout} style={{ padding: '0.4rem 1rem', fontSize: '1.1rem' }}>
            <LogOut size={16} /> bye
          </SketchButton>
        </>
      ) : (
        <Link to="/login" className="sketch-button" style={{ textDecoration: 'none', borderBottom: '4px solid #ff4d4d' }}>
          get in <ArrowRight size={18} />
        </Link>
      )}
    </div>
  </nav>
);

// --- PAGES ---

const LandingPage = () => (
  <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
    <h1 style={{ fontSize: '4.5rem', lineHeight: '1', transform: 'rotate(-1deg)' }}>
      Swap talents <br/> 
      <span className="marker-highlight">no money involved</span>
      <span className="correction-mark">!</span>
    </h1>
    
    <p style={{ fontSize: '1.6rem', maxWidth: '650px', margin: '2rem auto 3rem' }}>
      SkillSphere is a human-powered exchange. Learn anything from coding to cooking, taught by real people in your neighborhood.
    </p>

    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '6rem' }}>
      <Link to="/login" className="sketch-button" style={{ background: '#2d2d2d', color: 'white', fontSize: '1.8rem' }}>
        Start Swap <Sparkles size={24} />
      </Link>
      <Link to="/discover" className="sketch-button" style={{ fontSize: '1.8rem' }}>
        Explore <BookOpen size={24} />
      </Link>
    </div>

    {/* STATS SECTION */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>
      <SketchCard decoration="tack" style={{ transform: 'rotate(-2deg)' }}>
        <h2 style={{ fontSize: '3.5rem' }}>500<span className="correction-mark">k</span>+</h2>
        <p>Active Learners</p>
      </SketchCard>
      <SketchCard decoration="tape" style={{ transform: 'rotate(1deg)' }}>
        <h2 style={{ fontSize: '3.5rem' }}>99<span className="correction-mark">%</span></h2>
        <p>Success Rate</p>
      </SketchCard>
      <SketchCard decoration="tack" style={{ transform: 'rotate(-1deg)' }}>
        <h2 style={{ fontSize: '3.5rem' }}>0<span className="correction-mark">$</span></h2>
        <p>Cost Always</p>
      </SketchCard>
    </div>
  </div>
);

const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <SketchCard decoration="tape" style={{ width: '90%', maxWidth: '500px', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{user.name}'s Profile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        </div>
        <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '1.5rem' }}>{user.bio || 'No bio provided.'}</p>
        
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Skills Offered:</h3>
        <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '2rem' }}>
          {user.skillsOffered && user.skillsOffered.length > 0 ? user.skillsOffered.map(skill => (
            <li key={skill.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', border: '1px dashed #ccc' }}>
              <strong>{skill.title}</strong> - {skill.category}
            </li>
          )) : <li>No skills offered yet.</li>}
        </ul>
        
        <SketchButton primary style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} /> Contact {user.name}
        </SketchButton>
      </SketchCard>
    </div>
  );
};

const DiscoverPage = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await usersApi.getAll();
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter(user => {
    if (!query) return true;
    const q = query.toLowerCase();
    return user.name.toLowerCase().includes(q) || 
           (user.skillsOffered && user.skillsOffered.some(s => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)));
  });

  return (
    <div className="container">
      <div style={{ position: 'relative', marginBottom: '4rem', transform: 'rotate(0.5deg)' }}>
        <input 
          className="sketch-input" 
          placeholder="Search by name or skill..." 
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ paddingLeft: '3.5rem', fontSize: '1.5rem', height: '60px' }}
        />
        <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#2d2d2d' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
        {filteredUsers.map((user, index) => (
          <SketchCard 
            key={user.id} 
            decoration={index % 2 === 0 ? "tape" : "tack"}
            style={{ transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`, cursor: 'pointer' }}
          >
            <div onClick={() => setSelectedUser(user)}>
              <h3 style={{ fontSize: '1.8rem', marginTop: '0.5rem', color: '#2d2d2d' }}>{user.name}</h3>
              <p style={{ color: '#555', margin: '1rem 0 1rem', minHeight: '3em' }}>{user.bio || 'A mysterious member...'}</p>
              <div style={{ borderTop: '2px dashed #ccc', paddingTop: '1rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Skills:</strong>
                {user.skillsOffered && user.skillsOffered.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {user.skillsOffered.map(skill => (
                      <span key={skill.id} style={{ background: '#f0f0f0', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                        {skill.title}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontStyle: 'italic', color: '#999' }}>No skills listed</span>
                )}
              </div>
            </div>
          </SketchCard>
        ))}
      </div>
      {selectedUser && <ProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await authApi.login({ email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
      } else {
        await authApi.signup({ name, email, password });
        alert('Cool! Now login.');
        setIsLogin(true);
        return;
      }
      navigate('/discover');
    } catch (err) {
      alert('Oops: ' + (err.response?.data?.message || 'Bad luck!'));
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '4rem' }}>
      <SketchCard decoration="tack" style={{ transform: 'rotate(1deg)' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
          {isLogin ? 'Hello again' : 'First time?'} <span className="correction-mark">?</span>
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <input 
              className="sketch-input" 
              placeholder="What's your name?" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
            />
          )}
          <input 
            className="sketch-input" 
            placeholder="Email address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <input 
            className="sketch-input" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
          />
          <SketchButton type="submit" style={{ width: '100%', background: '#2d2d2d', color: 'white', justifyContent: 'center' }}>
            {isLogin ? 'Let\'s go' : 'Create account'} <Fingerprint size={20} />
          </SketchButton>
        </form>
        <p 
          style={{ marginTop: '2rem', textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' }} 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Actually, I'm new here" : "I've been here before"}
        </p>
      </SketchCard>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/dashboard" element={<div className="container"><SketchCard decoration="tape"><h2>Dashboard is being sketched...</h2><p>Come back later!</p></SketchCard></div>} />
      </Routes>
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate 
} from 'react-router-dom';
import { Search, LogOut, Sparkles, BookOpen, Map, ArrowRight, UserPlus, Fingerprint } from 'lucide-react';
import api, { authApi, skillsApi } from './api';

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

const DiscoverPage = () => {
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState('');

  const fetchSkills = async () => {
    try {
      const res = query 
        ? await skillsApi.search(query) 
        : await skillsApi.getAll();
      setSkills(res.data.content || res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchSkills(); }, [query]);

  return (
    <div className="container">
      <div style={{ position: 'relative', marginBottom: '4rem', transform: 'rotate(0.5deg)' }}>
        <input 
          className="sketch-input" 
          placeholder="What do you want to learn today?" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ paddingLeft: '3.5rem', fontSize: '1.5rem', height: '60px' }}
        />
        <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#2d2d2d' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
        {skills.map((skill, index) => (
          <SketchCard 
            key={skill.id} 
            decoration={index % 2 === 0 ? "tape" : "tack"}
            style={{ transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)` }}
          >
            <span className="font-heading" style={{ color: '#ff4d4d', letterSpacing: '1px' }}>{skill.category}</span>
            <h3 style={{ fontSize: '1.8rem', marginTop: '0.5rem' }}>{skill.title}</h3>
            <p style={{ color: '#555', margin: '1rem 0 2rem', minHeight: '3em' }}>{skill.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px dashed #ccc', paddingTop: '1rem' }}>
              <span style={{ fontSize: '1.1rem' }}>By <span className="marker-highlight">{skill.ownerName}</span></span>
              <SketchButton style={{ padding: '0.3rem 1rem' }}>Swap</SketchButton>
            </div>
          </SketchCard>
        ))}
      </div>
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

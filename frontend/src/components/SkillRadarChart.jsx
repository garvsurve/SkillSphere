import React, { useEffect, useState } from 'react';
import { githubApi } from '../api';
import { RefreshCw } from 'lucide-react';

const SkillRadarChart = ({ userId, isOwner }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, [userId]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data } = await githubApi.getSkills(userId);
      setSkills(data || []);
    } catch (err) {
      console.error('Failed to fetch verified skills', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (syncing) return;
    try {
      setSyncing(true);
      await githubApi.sync(userId);
      await fetchSkills();
    } catch (err) {
      console.error('Failed to sync skills', err);
      alert('GitHub sync failed. Try again later.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center font-kalam">Loading Verified Skills...</div>;
  }

  if (skills.length === 0) {
    if (isOwner) {
      return (
        <div className="border-2 border-black p-6 rounded-xl bg-white shadow-offset-sm relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMjBMMjAgME0wIDBMMjAgMjAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')]"></div>
          <h3 className="font-kalam text-xl font-bold mb-2 relative z-10">GitHub Verified Skills</h3>
          <p className="font-kalam text-gray-600 mb-4 relative z-10 text-center">
            Connect your GitHub account to automatically verify your coding skills!
          </p>
          <a
            href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_github_client_id_here'}&scope=repo`} 
            className="sketch-button"
            style={{ textDecoration: 'none', zIndex: 10, display: 'inline-block', marginTop: '1rem' }}
          >
            Connect GitHub
          </a>
        </div>
      );
    }
    return null; // Don't show anything to visitors if no skills
  }

  // Radar Chart Calculations
  const size = 300;
  const center = size / 2;
  const radius = center - 40;
  const numAxes = skills.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Generate wobbly polygon points
  const getWobblyPoint = (score, angle, index) => {
    // Add slight randomness based on index to make it look hand-drawn
    const wobble = Math.sin(index * 45) * 5; 
    const r = (score / 100) * radius + wobble;
    return {
      x: center + r * Math.cos(angle - Math.PI / 2),
      y: center + r * Math.sin(angle - Math.PI / 2)
    };
  };

  const points = skills.map((s, i) => getWobblyPoint(s.score, i * angleStep, i));
  const pathData = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ') + ' Z';

  return (
    <div className="border-2 border-black p-6 rounded-xl bg-white shadow-offset relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMjBMMjAgME0wIDBMMjAgMjAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')]"></div>
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="font-kalam text-xl font-bold">GitHub Verified Skills</h3>
        {isOwner && (
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="p-2 border-2 border-black rounded-full bg-blue-100 hover:bg-blue-200 transition-colors disabled:opacity-50 shadow-offset-sm active:translate-y-0.5 active:shadow-none"
            title="Sync with GitHub"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
          </button>
        )}
      </div>

      <div className="flex justify-center relative z-10">
        <svg width={size} height={size} className="overflow-visible">
          {/* Axes */}
          {skills.map((_, i) => {
            const angle = i * angleStep;
            const endX = center + radius * Math.cos(angle - Math.PI / 2);
            const endY = center + radius * Math.sin(angle - Math.PI / 2);
            return (
              <line
                key={`axis-${i}`}
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke="#000"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-40"
              />
            );
          })}

          {/* Web Background Circles (wobbly) */}
          {[0.25, 0.5, 0.75, 1].map((scale, i) => {
             const r = radius * scale;
             // Hand-drawn roughly circular path
             const d = `M ${center},${center - r} 
                        C ${center + r*0.6},${center - r} ${center + r},${center - r*0.6} ${center + r},${center}
                        C ${center + r},${center + r*0.6} ${center + r*0.6},${center + r} ${center},${center + r}
                        C ${center - r*0.6},${center + r} ${center - r},${center + r*0.6} ${center - r},${center}
                        C ${center - r},${center - r*0.6} ${center - r*0.6},${center - r} ${center},${center - r} Z`;
             return <path key={`circle-${i}`} d={d} stroke="#000" strokeWidth="1" fill="none" className="opacity-20" />;
          })}

          {/* Radar Polygon */}
          <path
            d={pathData}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#000"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Data Points and Labels */}
          {skills.map((skill, i) => {
            const angle = i * angleStep;
            const p = points[i];
            const labelRadius = radius + 20;
            const lx = center + labelRadius * Math.cos(angle - Math.PI / 2);
            const ly = center + labelRadius * Math.sin(angle - Math.PI / 2);
            
            return (
              <g key={`point-${i}`}>
                {/* Wobbly Dot */}
                <circle cx={p.x} cy={p.y} r="5" fill="#3b82f6" stroke="#000" strokeWidth="2" />
                {/* Label */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="font-kalam font-bold text-sm"
                  fill="#000"
                >
                  {skill.language}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {skills.length > 0 && (
        <div className="text-center mt-4 text-xs font-kalam text-gray-500 relative z-10">
          Last synced: {new Date(skills[0].lastSyncedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default SkillRadarChart;

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaBook, FaFileAlt, FaCode, FaRobot } from 'react-icons/fa';
import Scene3D from '../components/Scene3D';

function AnimatedBG() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(draw);
    }
    draw();
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      zIndex: 0, pointerEvents: 'none',
    }} />
  );
}

const features = [
  { icon: <FaChartBar size={28} />, title: 'Algorithm Visualizer', desc: 'Watch algorithms execute in real-time with stunning animations', path: '/visualizer', gradient: 'linear-gradient(135deg, #4c1d95, #7c3aed)' },
  { icon: <FaBook size={28} />, title: 'Study Notes', desc: 'Crisp, exam-ready notes for every ADA topic', path: '/notes', gradient: 'linear-gradient(135deg, #3b0764, #6d28d9)' },
  { icon: <FaFileAlt size={28} />, title: 'Previous Year Questions', desc: 'Practice with real RGPV exam questions & solutions', path: '/pyq', gradient: 'linear-gradient(135deg, #2e1065, #7c3aed)' },
  { icon: <FaCode size={28} />, title: 'Algorithms', desc: 'Deep-dive into every algorithm with code & complexity', path: '/algorithms', gradient: 'linear-gradient(135deg, #4c1d95, #8b5cf6)' },
  { icon: <FaRobot size={28} />, title: 'AI Assistant', desc: 'Your 24/7 doubt-solving AI companion for ADA', path: '/', gradient: 'linear-gradient(135deg, #3b0764, #a855f7)' },
];

const stats = [
  { value: '50+', label: 'Algorithms' },
  { value: '200+', label: 'PYQs' },
  { value: '10+', label: 'Topics' },
  { value: '24/7', label: 'AI Support' },
];

function Home() {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <AnimatedBG />

      {/* HERO — text left, 3D right */}
      <div style={styles.heroSection}>
        {/* Left side text */}
        <div style={styles.heroLeft}>
          <div style={styles.badge}>🎓 Built exclusively for RGPV Students</div>
          <h1 style={styles.title}>
            Master<br />
            <span style={styles.highlight}>ADA</span> Like a<br />
            <span style={styles.titleWhite}>Pro.</span>
          </h1>
          <p style={styles.subtitle}>
            Visualize algorithms in 3D, crack PYQs,
            study smart notes, and get instant AI doubt resolution.
          </p>

          {/* Stats inline */}
          <div style={styles.statsRow}>
            {stats.map((s, i) => (
              <div key={i} style={styles.statBox}>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={styles.btnGroup}>
            <button style={styles.primaryBtn} onClick={() => navigate('/algorithms')}>
              🚀 Start Learning
            </button>
            <button style={styles.secondaryBtn} onClick={() => navigate('/visualizer')}>
              ▶ Live Visualizer
            </button>
          </div>
        </div>

        {/* Right side 3D */}
        <div style={styles.heroRight}>
          <Scene3D />
          <div style={styles.dragHint}>🖱️ Drag to interact</div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Feature Cards */}
      <div style={styles.sectionTitle}>
        <div style={styles.sectionBadge}>✦ Features</div>
        <h2 style={styles.sectionH2}>
          Everything to <span style={styles.highlight}>Ace ADA</span>
        </h2>
        <p style={styles.sectionSub}>One platform. All resources. Zero confusion.</p>
      </div>

      <div style={styles.cardGrid}>
        {features.map((f, i) => (
          <div
            key={i}
            style={{ ...styles.card, background: f.gradient }}
            onClick={() => navigate(f.path)}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(139,92,246,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
            }}
          >
            <div style={styles.cardIconWrap}>{f.icon}</div>
            <h3 style={styles.cardTitle}>{f.title}</h3>
            <p style={styles.cardDesc}>{f.desc}</p>
            <div style={styles.cardArrow}>→</div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={styles.footerCTA}>
        <h2 style={styles.ctaTitle}>
          Ready to <span style={styles.highlight}>dominate ADA?</span>
        </h2>
        <p style={styles.ctaSubtitle}>
          Join hundreds of RGPV students already learning smarter.
        </p>
        <button style={styles.primaryBtn} onClick={() => navigate('/algorithms')}>
          Get Started Free 🎯
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0a0010',
    minHeight: '100vh',
    position: 'relative',
  },

  // Hero split layout
  heroSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '80px 80px 40px',
    minHeight: '90vh',
    position: 'relative',
    zIndex: 1,
    gap: '40px',
  },
  heroLeft: {
    flex: 1,
    maxWidth: '520px',
  },
  heroRight: {
    flex: 1,
    maxWidth: '560px',
    position: 'relative',
  },
  dragHint: {
    textAlign: 'center',
    color: '#7c3aed',
    fontSize: '13px',
    marginTop: '-20px',
    letterSpacing: '1px',
  },

  badge: {
    display: 'inline-block',
    background: 'rgba(139,92,246,0.12)',
    border: '1px solid rgba(139,92,246,0.35)',
    color: '#c4b5fd',
    padding: '7px 18px',
    borderRadius: '20px',
    fontSize: '13px',
    marginBottom: '28px',
  },
  title: {
    color: '#a855f7',
    fontSize: '4.5rem',
    fontWeight: '900',
    lineHeight: '1.05',
    marginBottom: '20px',
  },
  titleWhite: { color: 'white' },
  highlight: {
    color: '#a855f7',
    textShadow: '0 0 40px rgba(168,85,247,0.6)',
  },
  subtitle: {
    color: '#c4b5fd',
    fontSize: '1.1rem',
    lineHeight: '1.8',
    marginBottom: '32px',
    maxWidth: '440px',
  },

  // Stats inside hero
  statsRow: {
    display: 'flex',
    gap: '32px',
    marginBottom: '36px',
    flexWrap: 'wrap',
  },
  statBox: { textAlign: 'left' },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#a855f7',
    textShadow: '0 0 20px rgba(168,85,247,0.4)',
  },
  statLabel: { color: '#9ca3af', fontSize: '0.8rem', marginTop: '2px' },

  btnGroup: { display: 'flex', gap: '14px', flexWrap: 'wrap' },
  primaryBtn: {
    padding: '13px 32px', fontSize: '0.95rem', fontWeight: '700',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: 'white', border: 'none', borderRadius: '30px',
    cursor: 'pointer', boxShadow: '0 0 30px rgba(139,92,246,0.5)',
    transition: 'all 0.3s',
  },
  secondaryBtn: {
    padding: '13px 32px', fontSize: '0.95rem', fontWeight: '600',
    background: 'transparent', color: '#c4b5fd',
    border: '1px solid rgba(139,92,246,0.4)', borderRadius: '30px',
    cursor: 'pointer', transition: 'all 0.3s',
  },

  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)',
    margin: '0 80px',
    position: 'relative',
    zIndex: 1,
  },

  // Feature section
  sectionTitle: {
    textAlign: 'center',
    padding: '70px 20px 40px',
    position: 'relative',
    zIndex: 1,
  },
  sectionBadge: {
    color: '#7c3aed',
    fontSize: '13px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  sectionH2: {
    color: 'white',
    fontSize: '2.4rem',
    fontWeight: '800',
    marginBottom: '12px',
  },
  sectionSub: { color: '#9ca3af', fontSize: '1rem' },

  cardGrid: {
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
    gap: '24px', padding: '0 60px 80px',
    position: 'relative', zIndex: 1,
  },
  card: {
    borderRadius: '20px', padding: '32px 26px', width: '230px',
    cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  cardIconWrap: {
    color: '#e9d5ff',
    marginBottom: '16px',
    background: 'rgba(255,255,255,0.08)',
    width: '52px', height: '52px',
    borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { color: 'white', fontSize: '1rem', fontWeight: '700', marginBottom: '10px' },
  cardDesc: { color: '#ddd6fe', fontSize: '0.85rem', lineHeight: '1.6' },
  cardArrow: { color: '#a855f7', fontSize: '1.3rem', marginTop: '16px', fontWeight: '700' },

  footerCTA: {
    textAlign: 'center', padding: '80px 20px 100px',
    background: 'linear-gradient(180deg, transparent, rgba(124,58,237,0.08))',
    position: 'relative', zIndex: 1,
  },
  ctaTitle: { color: 'white', fontSize: '2.2rem', marginBottom: '12px', fontWeight: '800' },
  ctaSubtitle: { color: '#c4b5fd', marginBottom: '28px', fontSize: '1rem' },
};

export default Home;
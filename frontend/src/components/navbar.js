import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Algorithms', path: '/algorithms' },
    { name: 'Visualizer', path: '/visualizer' },
    { name: 'Notes', path: '/notes' },
    { name: 'PYQ', path: '/pyq' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>⬡</span>
        <span style={styles.logoText}>ADA<span style={styles.logoAccent}>verse</span></span>
      </div>
      <div style={styles.links}>
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            style={{
              ...styles.link,
              ...(location.pathname === link.path || hovered === link.name
                ? styles.linkActive : {})
            }}
            onMouseEnter={() => setHovered(link.name)}
            onMouseLeave={() => setHovered(null)}
          >
            {link.name}
            {location.pathname === link.path && <div style={styles.activeDot} />}
          </Link>
        ))}
        <button style={styles.ctaBtn}>Get Started</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 60px',
    background: 'rgba(10, 0, 20, 0.85)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { fontSize: '28px', color: '#8b5cf6' },
  logoText: { fontSize: '22px', fontWeight: '800', color: 'white', letterSpacing: '1px' },
  logoAccent: { color: '#8b5cf6' },
  links: { display: 'flex', alignItems: 'center', gap: '8px' },
  link: {
    color: '#c4b5fd',
    textDecoration: 'none',
    fontSize: '15px',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.3s',
    position: 'relative',
  },
  linkActive: {
    color: '#fff',
    background: 'rgba(139, 92, 246, 0.2)',
  },
  activeDot: {
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#8b5cf6',
  },
  ctaBtn: {
    marginLeft: '16px',
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
  },
};

export default Navbar;
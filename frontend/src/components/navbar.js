import React, { useState } from 'react';

import { Link } from 'react-router-dom';

function Navbar() {
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
        <span style={styles.logoText}>
          ADA<span style={styles.logoAccent}>verse</span>
        </span>
      </div>

      <div style={styles.links}>
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            style={{
              ...styles.link,
              ...(hovered === link.name
                ? styles.linkActive
                : {})
            }}
            onMouseEnter={() => setHovered(link.name)}
            onMouseLeave={() => setHovered(null)}
          >
            {link.name}
            {hovered === link.name && <div style={styles.activeDot} />}
          </Link>
        ))}

        <Link to="/algorithms" style={styles.ctaBtn}>
          Get Started
        </Link>
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
    background: '#18392B',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(163, 177, 138, 0.25)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  logoIcon: {
    fontSize: '28px',
    color: '#A3B18A',
  },

  logoText: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#DAD7CD',
    letterSpacing: '1px',
  },

  logoAccent: {
    color: '#A3B18A',
  },

  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  link: {
    color: '#DAD7CD',
    textDecoration: 'none',
    fontSize: '15px',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.3s',
    position: 'relative',
  },

  linkActive: {
    color: '#DAD7CD',
    background: 'rgba(163, 177, 138, 0.18)',
  },

  activeDot: {
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#A3B18A',
  },

  ctaBtn: {
    marginLeft: '16px',
    padding: '10px 24px',
    background: '#DAD7CD',
    color: '#18392B',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: 'none',
    display: 'inline-block',
    textDecoration: 'none',
  },
};

export default Navbar;
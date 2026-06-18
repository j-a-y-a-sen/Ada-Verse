import React, { useState, useEffect } from 'react';

const marksColor = {
  2:  { bg: 'rgba(34,197,94,0.15)',  border: '#22c55e', text: '#86efac' },
  7:  { bg: 'rgba(234,179,8,0.15)',  border: '#eab308', text: '#fde047' },
  14: { bg: 'rgba(239,68,68,0.15)',  border: '#ef4444', text: '#fca5a5' },
};

const unitNames = {
  1: 'Unit 1 — Intro & Divide and Conquer',
  2: 'Unit 2 — Greedy & Graph Algorithms',
  3: 'Unit 3 — Dynamic Programming',
  4: 'Unit 4 — Backtracking',
  5: 'Unit 5 — NP Completeness & Branch and Bound',
};

function PYQCard({ pyq }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const mc = marksColor[pyq.marks] || marksColor[7];

  return (
    <div style={styles.card}>
      {/* Top row */}
      <div style={styles.cardTop}>
        <div style={styles.badgeRow}>
          <span style={{
            ...styles.marksBadge,
            background: mc.bg,
            border: `1px solid ${mc.border}`,
            color: mc.text,
          }}>
            {pyq.marks} Marks
          </span>
          <span style={styles.yearBadge}>{pyq.year}</span>
          <span style={styles.unitSmall}>Unit {pyq.unit}</span>
        </div>
      </div>

      {/* Question */}
      <p style={styles.question}>Q. {pyq.question}</p>

      {/* Answer toggle */}
      {pyq.answer && (
        <>
          <button
            style={styles.answerBtn}
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? '▲ Hide Answer' : '▼ Show Answer'}
          </button>

          {showAnswer && (
            <div style={styles.answerBox}>
              <div style={styles.answerLabel}>✅ Answer</div>
              <pre style={styles.answerText}>{pyq.answer}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PYQ() {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [selectedMarks, setSelectedMarks] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/pyqs/')
      .then(res => res.json())
      .then(data => { setPyqs(data); setLoading(false); })
      .catch(() => { setError('Could not connect to backend'); setLoading(false); });
  }, []);

  const years = [...new Set(pyqs.map(p => p.year))].sort((a, b) => b - a);

  const filtered = pyqs.filter(p => {
    const yearOk = selectedYear === 'all' || p.year === parseInt(selectedYear);
    const unitOk = selectedUnit === 'all' || p.unit === parseInt(selectedUnit);
    const marksOk = selectedMarks === 'all' || p.marks === parseInt(selectedMarks);
    return yearOk && unitOk && marksOk;
  });

  // Group by unit
  const grouped = {};
  filtered.forEach(p => {
    if (!grouped[p.unit]) grouped[p.unit] = [];
    grouped[p.unit].push(p);
  });

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerBadge}>📝 Previous Year Questions</div>
        <h1 style={styles.title}>
          RGPV <span style={styles.highlight}>PYQs</span>
        </h1>
        <p style={styles.subtitle}>
          Year-wise and unit-wise previous year questions with answers
        </p>

        {/* Stats */}
        {!loading && (
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{pyqs.length}</div>
              <div style={styles.statLabel}>Total Questions</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{years.length}</div>
              <div style={styles.statLabel}>Years Covered</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{filtered.length}</div>
              <div style={styles.statLabel}>Showing Now</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={styles.filtersSection}>

        {/* Year filter */}
        <div style={styles.filterGroup}>
          <div style={styles.filterLabel}>📅 Year</div>
          <div style={styles.filterRow}>
            <button
              style={{ ...styles.filterBtn, ...(selectedYear === 'all' ? styles.filterActive : {}) }}
              onClick={() => setSelectedYear('all')}
            >All</button>
            {years.map(y => (
              <button
                key={y}
                style={{ ...styles.filterBtn, ...(selectedYear === String(y) ? styles.filterActive : {}) }}
                onClick={() => setSelectedYear(String(y))}
              >{y}</button>
            ))}
          </div>
        </div>

        {/* Unit filter */}
        <div style={styles.filterGroup}>
          <div style={styles.filterLabel}>📚 Unit</div>
          <div style={styles.filterRow}>
            {['all', '1', '2', '3', '4', '5'].map(u => (
              <button
                key={u}
                style={{ ...styles.filterBtn, ...(selectedUnit === u ? styles.filterActive : {}) }}
                onClick={() => setSelectedUnit(u)}
              >{u === 'all' ? 'All' : `Unit ${u}`}</button>
            ))}
          </div>
        </div>

        {/* Marks filter */}
        <div style={styles.filterGroup}>
          <div style={styles.filterLabel}>⭐ Marks</div>
          <div style={styles.filterRow}>
            {['all', '2', '7', '14'].map(m => (
              <button
                key={m}
                style={{ ...styles.filterBtn, ...(selectedMarks === m ? styles.filterActive : {}) }}
                onClick={() => setSelectedMarks(m)}
              >{m === 'all' ? 'All' : `${m} Marks`}</button>
            ))}
          </div>
        </div>

      </div>

      {/* Content */}
      {loading && (
        <div style={styles.centerMsg}>
          <div style={styles.loader} />
          <p style={{ color: '#c4b5fd', marginTop: '16px' }}>Loading questions...</p>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error} — Make sure Django server is running on port 8000
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={styles.centerMsg}>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
            No questions found for selected filters.
          </p>
        </div>
      )}

      {!loading && !error && (
        <div style={styles.content}>
          {Object.keys(grouped).sort().map(unit => (
            <div key={unit} style={styles.unitSection}>
              <div style={styles.unitHeader}>
                <div style={styles.unitDot} />
                <h2 style={styles.unitTitle}>{unitNames[unit]}</h2>
                <div style={styles.unitCount}>{grouped[unit].length} questions</div>
              </div>
              <div style={styles.cardList}>
                {grouped[unit].map(pyq => (
                  <PYQCard key={pyq.id} pyq={pyq} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0a0010',
    minHeight: '100vh',
    paddingBottom: '80px',
  },
  header: {
    textAlign: 'center',
    padding: '60px 20px 40px',
    background: 'linear-gradient(180deg, rgba(124,58,237,0.15) 0%, transparent 100%)',
    borderBottom: '1px solid rgba(139,92,246,0.2)',
  },
  headerBadge: {
    display: 'inline-block',
    background: 'rgba(139,92,246,0.15)',
    border: '1px solid rgba(139,92,246,0.35)',
    color: '#c4b5fd',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  title: {
    color: 'white',
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '12px',
  },
  highlight: {
    color: '#a855f7',
    textShadow: '0 0 30px rgba(168,85,247,0.5)',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '1rem',
    marginBottom: '30px',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
    marginTop: '20px',
  },
  statBox: { textAlign: 'center' },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#a855f7',
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: '0.8rem',
    marginTop: '4px',
  },
  filtersSection: {
    padding: '30px 60px',
    borderBottom: '1px solid rgba(139,92,246,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    color: '#7c3aed',
    fontSize: '13px',
    fontWeight: '600',
    minWidth: '70px',
    letterSpacing: '0.5px',
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '7px 16px',
    borderRadius: '20px',
    border: '1px solid rgba(139,92,246,0.3)',
    background: 'transparent',
    color: '#c4b5fd',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterActive: {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: '1px solid #a855f7',
    color: 'white',
    boxShadow: '0 0 15px rgba(139,92,246,0.3)',
  },
  content: {
    padding: '40px 60px',
  },
  unitSection: {
    marginBottom: '48px',
  },
  unitHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(139,92,246,0.2)',
  },
  unitDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#a855f7',
    flexShrink: 0,
  },
  unitTitle: {
    color: 'white',
    fontSize: '1.15rem',
    fontWeight: '700',
    flex: 1,
  },
  unitCount: {
    color: '#7c3aed',
    fontSize: '13px',
    background: 'rgba(124,58,237,0.15)',
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid rgba(124,58,237,0.3)',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    background: 'rgba(139,92,246,0.06)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '16px',
    padding: '24px',
    transition: 'border-color 0.2s',
  },
  cardTop: {
    marginBottom: '14px',
  },
  badgeRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  marksBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
  yearBadge: {
    background: 'rgba(139,92,246,0.15)',
    border: '1px solid rgba(139,92,246,0.3)',
    color: '#c4b5fd',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  unitSmall: {
    color: '#6b7280',
    fontSize: '12px',
  },
  question: {
    color: '#e2e8f0',
    fontSize: '1rem',
    lineHeight: '1.7',
    marginBottom: '16px',
  },
  answerBtn: {
    background: 'rgba(124,58,237,0.15)',
    border: '1px solid rgba(124,58,237,0.3)',
    color: '#a855f7',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  answerBox: {
    marginTop: '16px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '12px',
    padding: '20px',
  },
  answerLabel: {
    color: '#86efac',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px',
    letterSpacing: '0.5px',
  },
  answerText: {
    color: '#d1d5db',
    fontSize: '0.9rem',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
    fontFamily: 'Segoe UI, sans-serif',
    margin: 0,
  },
  centerMsg: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  loader: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(139,92,246,0.3)',
    borderTop: '3px solid #a855f7',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
  errorBox: {
    margin: '40px 60px',
    padding: '20px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '12px',
    color: '#fca5a5',
    textAlign: 'center',
  },
};

export default PYQ;
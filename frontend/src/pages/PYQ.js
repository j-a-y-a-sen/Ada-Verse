import React, { useState, useEffect } from 'react';

const marksColor = {
  2:  { bg: 'rgba(88,129,87,0.14)', border: '#588157', text: '#344E41' },
  7:  { bg: 'rgba(197,190,169,0.35)', border: '#A3B18A', text: '#344E41' },
  14: { bg: 'rgba(163,177,138,0.18)', border: '#3A5A40', text: '#173A29' },
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
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadPyqs = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('http://127.0.0.1:8000/api/pyqs/');

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid PYQ response');
        }

        if (!cancelled) {
          setPyqs(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Could not connect to backend');
          setPyqs([]);
          setLoading(false);
        }
      }
    };

    loadPyqs();

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedPyqs = pyqs.map((p, index) => ({
    ...p,
    id: p.id ?? `${p.year}-${p.unit}-${p.marks}-${index}`,
    year: Number(p.year),
    unit: Number(p.unit),
    marks: Number(p.marks),
    question: p.question ?? '',
    answer: p.answer ?? '',
  }));

  const years = [...new Set(normalizedPyqs.map(p => p.year))]
    .filter(Boolean)
    .sort((a, b) => b - a);

  const filtered = normalizedPyqs.filter(p => {
    const yearOk = selectedYear === 'all' || p.year === Number(selectedYear);
    const unitOk = selectedUnit === 'all' || p.unit === Number(selectedUnit);
    const marksOk = selectedMarks === 'all' || p.marks === Number(selectedMarks);

    const query = search.trim().toLowerCase();
    const searchOk =
      !query ||
      String(p.question).toLowerCase().includes(query) ||
      String(p.answer).toLowerCase().includes(query) ||
      String(p.year).includes(query) ||
      String(p.unit).includes(query) ||
      String(p.marks).includes(query);

    return yearOk && unitOk && marksOk && searchOk;
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
          Year-wise, unit-wise and marks-wise previous year questions with short answers
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

        {/* Search */}
        <div style={styles.searchRow}>
          <div style={styles.searchLabel}>🔎 Search</div>
          <div style={styles.searchWrap}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question, answer, year, unit..."
              style={styles.searchInput}
              aria-label="Search PYQs"
            />
            {search && (
              <button
                type="button"
                style={styles.clearSearch}
                onClick={() => setSearch('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>

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

        <div style={styles.resetRow}>
          <button
            type="button"
            style={styles.resetBtn}
            onClick={() => {
              setSelectedYear('all');
              setSelectedUnit('all');
              setSelectedMarks('all');
              setSearch('');
            }}
          >
            Reset Filters
          </button>
        </div>

      </div>

      {/* Content */}
      {loading && (
        <div style={styles.centerMsg}>
          <div style={styles.loader} />
          <p style={{ color: '#173A29', marginTop: '16px' }}>Loading questions...</p>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error} — Make sure Django server is running on port 8000
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={styles.centerMsg}>
          <p style={{ color: '#46534B', fontSize: '1.1rem' }}>
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
    backgroundColor: '#E9E5D8',
    minHeight: '100vh',
    paddingBottom: '80px',
  },
  header: {
    textAlign: 'center',
    padding: '40px 20px 42px',
    background: 'linear-gradient(180deg, #D8D3C0 0%, #EEEADF 100%)',
    borderBottom: '1px solid rgba(52,78,65,0.15)',
  },
  headerBadge: {
    display: 'inline-block',
    background: 'rgba(52,78,65,0.08)',
    border: '1px solid rgba(52,78,65,0.22)',
    color: '#173A29',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  title: {
    color: '#173A29',
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '12px',
  },
  highlight: {
    color: '#173A29',
    textShadow: 'none',
  },
  subtitle: {
    color: '#46534B',
    fontSize: '1rem',
    marginBottom: '30px',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0',
    flexWrap: 'wrap',
    margin: '20px auto 0',
    maxWidth: '620px',
    background: 'rgba(255,255,255,0.62)',
    border: '1px solid rgba(52,78,65,0.12)',
    borderRadius: '20px',
    padding: '18px 12px',
    boxShadow: '0 10px 30px rgba(52,78,65,0.08)',
  },
  statBox: { textAlign: 'center', flex: '1 1 180px', padding: '4px 18px' },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#173A29',
  },
  statLabel: {
    color: '#46534B',
    fontSize: '0.8rem',
    marginTop: '4px',
  },
  filtersSection: {
    margin: '24px clamp(16px, 4vw, 56px)',
    padding: '24px 30px',
    border: '1px solid rgba(52,78,65,0.12)',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.58)',
    boxShadow: '0 10px 28px rgba(52,78,65,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },

  searchLabel: {
    color: '#173A29',
    fontSize: '13px',
    fontWeight: '600',
    minWidth: '70px',
    letterSpacing: '0.5px',
  },

  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: '260px',
  },

  searchInput: {
    width: '100%',
    padding: '11px 15px',
    borderRadius: '12px',
    border: '1px solid rgba(52,78,65,0.22)',
    background: '#F8F5EC',
    color: '#17251D',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },

  clearSearch: {
    padding: '9px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(52,78,65,0.22)',
    background: '#E9E5D8',
    color: '#173A29',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },

  resetRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '2px',
  },

  resetBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #173A29',
    background: 'transparent',
    color: '#173A29',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },

  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    color: '#173A29',
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
    border: '1px solid rgba(52,78,65,0.22)',
    background: '#F3F0E6',
    color: '#173A29',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterActive: {
    background: '#173A29',
    border: '1px solid #173A29',
    color: '#FFFFFF',
    boxShadow: '0 6px 16px rgba(23,58,41,0.18)',
  },
  content: {
    padding: '40px clamp(16px, 4vw, 60px)',
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
    borderBottom: '1px solid rgba(52,78,65,0.15)',
  },
  unitDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#588157',
    flexShrink: 0,
  },
  unitTitle: {
    color: '#173A29',
    fontSize: '1.15rem',
    fontWeight: '700',
    flex: 1,
  },
  unitCount: {
    color: '#FFFFFF',
    fontSize: '13px',
    background: '#173A29',
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid #173A29',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    background: '#F5F1E6',
    border: '1px solid rgba(52,78,65,0.16)',
    borderRadius: '16px',
    padding: '24px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: '0 8px 22px rgba(52,78,65,0.06)',
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
    background: 'rgba(52,78,65,0.08)',
    border: '1px solid rgba(52,78,65,0.22)',
    color: '#173A29',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  unitSmall: {
    color: '#5D685F',
    fontSize: '12px',
  },
  question: {
    color: '#17251D',
    fontSize: '1rem',
    lineHeight: '1.7',
    marginBottom: '16px',
  },
  answerBtn: {
    background: '#173A29',
    border: '1px solid #173A29',
    color: '#FFFFFF',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  answerBox: {
    marginTop: '16px',
    background: '#F4F1E7',
    border: '1px solid rgba(52,78,65,0.18)',
    borderRadius: '12px',
    padding: '20px',
  },
  answerLabel: {
    color: '#3A5A40',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '12px',
    letterSpacing: '0.5px',
  },
  answerText: {
    color: '#26352C',
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
    border: '3px solid rgba(52,78,65,0.22)',
    borderTop: '3px solid #173A29',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
  errorBox: {
    margin: '26px clamp(16px, 4vw, 56px)',
    padding: '20px',
    background: 'rgba(217,164,65,0.10)',
    border: '1px solid rgba(217,164,65,0.38)',
    borderRadius: '14px',
    color: '#173A29',
    textAlign: 'center',
  },
};

export default PYQ;
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ALGORITHMS = [
  {
    "id": "bubble-sort",
    "name": "Bubble Sort",
    "unit": 1,
    "category": "Sorting",
    "desc": "Repeatedly compare adjacent elements and swap them when they are out of order.",
    "best": "O(n)",
    "avg": "O(n²)",
    "worst": "O(n²)",
    "space": "O(1)",
    "icon": "↕️",
    "noteUnit": 1,
    "noteTopic": "complexity"
  },
  {
    "id": "selection-sort",
    "name": "Selection Sort",
    "unit": 1,
    "category": "Sorting",
    "desc": "Select the smallest remaining element and place it at the next sorted position.",
    "best": "O(n²)",
    "avg": "O(n²)",
    "worst": "O(n²)",
    "space": "O(1)",
    "icon": "▣",
    "noteUnit": 1,
    "noteTopic": "complexity"
  },
  {
    "id": "insertion-sort",
    "name": "Insertion Sort",
    "unit": 1,
    "category": "Sorting",
    "desc": "Build the sorted portion one element at a time by inserting each item into its correct position.",
    "best": "O(n)",
    "avg": "O(n²)",
    "worst": "O(n²)",
    "space": "O(1)",
    "icon": "↔",
    "noteUnit": 1,
    "noteTopic": "complexity"
  },
  {
    "id": "merge-sort",
    "name": "Merge Sort",
    "unit": 1,
    "category": "Divide & Conquer",
    "desc": "Divide the array into halves, solve recursively, and merge the sorted halves.",
    "best": "O(n log n)",
    "avg": "O(n log n)",
    "worst": "O(n log n)",
    "space": "O(n)",
    "icon": "⌘",
    "noteUnit": 1,
    "noteTopic": "dac"
  },
  {
    "id": "quick-sort",
    "name": "Quick Sort",
    "unit": 1,
    "category": "Divide & Conquer",
    "desc": "Partition around a pivot and recursively sort the two resulting subarrays.",
    "best": "O(n log n)",
    "avg": "O(n log n)",
    "worst": "O(n²)",
    "space": "O(log n)",
    "icon": "⇄",
    "noteUnit": 1,
    "noteTopic": "dac"
  },
  {
    "id": "binary-search",
    "name": "Binary Search",
    "unit": 1,
    "category": "Divide & Conquer",
    "desc": "Search a sorted array by repeatedly discarding half of the remaining range.",
    "best": "O(1)",
    "avg": "O(log n)",
    "worst": "O(log n)",
    "space": "O(1)",
    "icon": "⌕",
    "noteUnit": 1,
    "noteTopic": "dac"
  },
  {
    "id": "heap-sort",
    "name": "Heap Sort",
    "unit": 1,
    "category": "Heap & Sorting",
    "desc": "Build a heap and repeatedly extract the maximum element to sort the array in place.",
    "best": "O(n log n)",
    "avg": "O(n log n)",
    "worst": "O(n log n)",
    "space": "O(1)",
    "icon": "▲",
    "noteUnit": 1,
    "noteTopic": "heap"
  },
  {
    "id": "optimal-merge",
    "name": "Optimal Merge Pattern",
    "unit": 2,
    "category": "Greedy",
    "desc": "Repeatedly merge the two smallest files to minimize the total merge cost.",
    "best": "O(n log n)",
    "avg": "O(n log n)",
    "worst": "O(n log n)",
    "space": "O(n)",
    "icon": "≋",
    "noteUnit": 2,
    "noteTopic": "optimal-merge"
  },
  {
    "id": "prim-mst",
    "name": "Prim's MST",
    "unit": 2,
    "category": "Greedy · Graph",
    "desc": "Grow a minimum spanning tree by repeatedly choosing the cheapest crossing edge.",
    "best": "O(V²)",
    "avg": "O(V²)",
    "worst": "O(V²)",
    "space": "O(V)",
    "icon": "⌁",
    "noteUnit": 2,
    "noteTopic": "prim-mst"
  },
  {
    "id": "knapsack",
    "name": "0/1 Knapsack",
    "unit": 3,
    "category": "Dynamic Programming",
    "desc": "Use a DP table to maximize value without exceeding the available capacity.",
    "best": "O(nW)",
    "avg": "O(nW)",
    "worst": "O(nW)",
    "space": "O(nW)",
    "icon": "🎒",
    "noteUnit": 3,
    "noteTopic": "knapsack"
  },
  {
    "id": "multistage",
    "name": "Multistage Graph",
    "unit": 3,
    "category": "Dynamic Programming",
    "desc": "Compute the minimum-cost path through a staged directed graph using dynamic programming.",
    "best": "O(E)",
    "avg": "O(E)",
    "worst": "O(E)",
    "space": "O(V)",
    "icon": "⌁",
    "noteUnit": 3,
    "noteTopic": "multistage"
  },
  {
    "id": "graph-coloring",
    "name": "Graph Coloring",
    "unit": 4,
    "category": "Backtracking",
    "desc": "Assign colors to vertices so adjacent vertices never receive the same color.",
    "best": "O(m^V)",
    "avg": "O(m^V)",
    "worst": "O(m^V)",
    "space": "O(V)",
    "icon": "🎨",
    "noteUnit": 4,
    "noteTopic": "graph-coloring"
  },
  {
    "id": "tsp",
    "name": "Travelling Salesman Problem",
    "unit": 4,
    "category": "Branch & Bound",
    "desc": "Explore feasible tours and keep the minimum-cost Hamiltonian cycle.",
    "best": "O(n!)",
    "avg": "O(n!)",
    "worst": "O(n!)",
    "space": "O(n)",
    "icon": "🧳",
    "noteUnit": 4,
    "noteTopic": "tsp"
  },
  {
    "id": "bfs",
    "name": "Breadth First Search",
    "unit": 5,
    "category": "Graph",
    "desc": "Visit a graph level by level using a queue.",
    "best": "O(V+E)",
    "avg": "O(V+E)",
    "worst": "O(V+E)",
    "space": "O(V)",
    "icon": "◎",
    "noteUnit": 5,
    "noteTopic": "bfs-dfs"
  },
  {
    "id": "dfs",
    "name": "Depth First Search",
    "unit": 5,
    "category": "Graph",
    "desc": "Explore as deeply as possible before backtracking using recursion or a stack.",
    "best": "O(V+E)",
    "avg": "O(V+E)",
    "worst": "O(V+E)",
    "space": "O(V)",
    "icon": "↘",
    "noteUnit": 5,
    "noteTopic": "bfs-dfs"
  },
  {
    "id": "bst",
    "name": "Binary Search Tree",
    "unit": 5,
    "category": "Tree",
    "desc": "Demonstrate BST insertion, search, inorder traversal and deletion.",
    "best": "O(log n)",
    "avg": "O(log n)",
    "worst": "O(n)",
    "space": "O(n)",
    "icon": "🌳",
    "noteUnit": 5,
    "noteTopic": "bst"
  }
];

const UNITS = [
  { id: 0, label: 'All', subtitle: 'All Algorithms' },
  { id: 1, label: 'Unit 1', subtitle: 'Divide & Conquer · Sorting · Heap' },
  { id: 2, label: 'Unit 2', subtitle: 'Greedy & Graph' },
  { id: 3, label: 'Unit 3', subtitle: 'Dynamic Programming' },
  { id: 4, label: 'Unit 4', subtitle: 'Backtracking · Branch & Bound' },
  { id: 5, label: 'Unit 5', subtitle: 'Graphs & Trees' },
];

const COLORS = {
  dark: '#173A29',
  green: '#3A5A40',
  sage: '#588157',
  lightSage: '#A3B18A',
  cream: '#E9E5D8',
  card: '#F5F1E6',
  text: '#173A29',
  muted: '#526057',
};


function AlgorithmCard({ algo, navigate }) {
  return (
    <article style={styles.card}>
      <div style={styles.iconBox}>
        <span style={{ fontSize: 24 }}>{algo.icon}</span>
      </div>

      <div style={{ flex: 1 }}>
        <div style={styles.cardTop}>
          <div>
            <h3 style={styles.cardTitle}>{algo.name}</h3>
            <span style={styles.category}>{algo.category}</span>
          </div>
          <span style={styles.unitBadge}>Unit {algo.unit}</span>
        </div>

        <p style={styles.description}>{algo.desc}</p>

        <div style={styles.complexityGrid}>
          <div><span style={styles.complexityLabel}>Best</span><b>{algo.best}</b></div>
          <div><span style={styles.complexityLabel}>Average</span><b>{algo.avg}</b></div>
          <div><span style={styles.complexityLabel}>Worst</span><b>{algo.worst}</b></div>
          <div><span style={styles.complexityLabel}>Space</span><b>{algo.space}</b></div>
        </div>

        <div style={styles.actionRow}>
          <button type="button" style={styles.learnButton}
            onClick={() => navigate(`/notes?unit=${algo.noteUnit}&topic=${encodeURIComponent(algo.noteTopic)}`)}>
            📖 Learn
          </button>

          <button type="button" style={styles.visualizeButton}
            onClick={() => navigate(`/visualizer?algo=${encodeURIComponent(algo.id)}`)}>
            ▶ Visualize
          </button>
        </div>
      </div>
    </article>
  );
}

function AlgorithmComparison() {
  const rows = ALGORITHMS;

  return (
    <section style={styles.comparisonSection}>
      <div style={styles.sectionHeading}>
        <div>
          <h2 style={styles.sectionTitle}>▥ Algorithm Comparison</h2>
          <p style={styles.sectionSubtext}>
            Compare time and space complexity of all algorithms available in the visualizer.
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Type</th>
              <th>Best</th>
              <th>Average</th>
              <th>Worst</th>
              <th>Space</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((algo) => (
              <tr key={algo.id}>
                <td>{algo.name}</td>
                <td>{algo.category}</td>
                <td>{algo.best}</td>
                <td>{algo.avg}</td>
                <td>{algo.worst}</td>
                <td>{algo.space}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Algorithms() {
  const navigate = useNavigate();
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [search, setSearch] = useState('');

  const filteredAlgorithms = useMemo(() => {
    const q = search.trim().toLowerCase().replace(/\s+/g, ' ');

    return ALGORITHMS.filter((algo) => {
      const unitMatches = selectedUnit === 0 || algo.unit === selectedUnit;

      const searchMatches =
        !q ||
        algo.name.toLowerCase().includes(q) ||
        algo.category.toLowerCase().includes(q) ||
        algo.desc.toLowerCase().includes(q) ||
        `unit ${algo.unit}`.includes(q);

      return unitMatches && searchMatches;
    });
  }, [selectedUnit, search]);

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.eyebrow}>🌿 Explore • Understand • Visualize • Practice</div>

          <h1 style={styles.heroTitle}>Algorithms</h1>
          <h2 style={styles.heroSubtitle}>From Concepts to Implementation</h2>

          <p style={styles.heroText}>
            Explore a collection of algorithms, visualize how they work, and
            practice with real problems — all in one place.
          </p>

          <div style={styles.heroActions}>
            <button type="button" style={styles.heroAction}
              onClick={() => navigate('/notes')}>
              <span style={styles.heroActionIcon}>📖</span>
              <span style={styles.heroActionText}><b>Learn</b><small>Read detailed explanations in Notes</small></span>
              <span>→</span>
            </button>

            <button type="button" style={styles.heroAction}
              onClick={() => navigate('/visualizer')}>
              <span style={styles.heroActionIcon}>▮▮▮</span>
              <span style={styles.heroActionText}><b>Visualize</b><small>See step-by-step execution in Visualizer</small></span>
              <span>→</span>
            </button>

            <button type="button" style={styles.heroAction}
              onClick={() => navigate('/pyq')}>
              <span style={styles.heroActionIcon}>☷</span>
              <span style={styles.heroActionText}><b>Practice</b><small>Solve problems in PYQs</small></span>
              <span>→</span>
            </button>
          </div>
        </div>

        <div style={styles.heroArtwork}>
          <div style={styles.bookStack}>
            <div style={{ ...styles.book, transform: 'rotate(-2deg)' }}>ALGORITHMS</div>
            <div style={{ ...styles.book, transform: 'rotate(1deg)' }}>DATA STRUCTURES</div>
            <div style={{ ...styles.book, transform: 'rotate(-1deg)' }}>PROBLEM SOLVING</div>
          </div>
          <div style={styles.leaf}>🌿</div>
          <div style={styles.note}>Better<br />Algorithms<br />Brighter<br />Tomorrows ♡</div>
        </div>
      </header>

      <main>
        <section style={styles.browse}>
          <div style={styles.sectionHeading}>
            <div>
              <h2 style={styles.sectionTitle}>▱ Browse Algorithms</h2>
              <p style={styles.sectionSubtext}>
                Select a unit or use search to find algorithms. Click on any card to explore, visualize or practice.
              </p>
            </div>

            <div style={styles.searchWrap} onMouseDown={(e) => e.stopPropagation()}>
              <span>⌕</span>
              <input
                type="text"
                aria-label="Search algorithms"
                autoComplete="off"
                spellCheck="false"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search algorithms..."
                style={styles.search}
              />
              {search && (
                <button type="button" aria-label="Clear search"
                  onClick={() => setSearch('')}
                  style={styles.clearSearch}>
                  ×
                </button>
              )}
            </div>
          </div>

          <div style={styles.tabs}>
            {UNITS.map((unit) => (
              <button
                key={unit.id}
                type="button"
                onClick={() => setSelectedUnit(unit.id)}
                style={{ ...styles.tab, ...(selectedUnit === unit.id ? styles.tabActive : {}) }}
              >
                <span style={styles.tabText}>
                  <b>{unit.label}</b>
                  <span>{unit.subtitle}</span>
                </span>
              </button>
            ))}
          </div>

          <div style={styles.resultInfo}>
            <span>{filteredAlgorithms.length} algorithm{filteredAlgorithms.length === 1 ? '' : 's'}</span>
            {search && <span>matching “{search}”</span>}
          </div>

          {filteredAlgorithms.length > 0 ? (
            <div style={styles.grid}>
              {filteredAlgorithms.map((algo) => (
                <AlgorithmCard key={algo.id} algo={algo} navigate={navigate} />
              ))}
            </div>
          ) : (
            <div style={styles.empty}>
              <div style={{ fontSize: 40 }}>⌕</div>
              <h3>No algorithms found</h3>
              <p>Try another algorithm name, unit, or category.</p>
              <button type="button" style={styles.visualizeButton}
                onClick={() => { setSearch(''); setSelectedUnit(0); }}>
                Show All Algorithms
              </button>
            </div>
          )}
        </section>

        <AlgorithmComparison />

        <section style={styles.helper}>
          <h2 style={styles.sectionTitle}>◎ What are you trying to solve?</h2>
          <p style={styles.sectionSubtext}>Choose a goal and jump directly to the relevant visualization.</p>

          <div style={styles.helperGrid}>
            {[
              ['⌕', 'Search an element', 'binary-search'],
              ['↕', 'Sort data', 'merge-sort'],
              ['⌁', 'Find a minimum spanning tree', 'prim-mst'],
              ['↗', 'Explore a graph', 'bfs'],
              ['🎒', 'Optimize a selection problem', 'knapsack'],
              ['☷', 'Solve using dynamic programming', 'multistage'],
              ['🧩', 'Explore backtracking', 'graph-coloring'],
              ['🌿', 'Explore route optimization', 'tsp'],
            ].map(([icon, label, id]) => (
              <button key={id} type="button" style={styles.helperItem}
                onClick={() => navigate(`/visualizer?algo=${encodeURIComponent(id)}`)}>
                <span style={styles.helperIcon}>{icon}</span>
                <span>{label}</span>
                <span style={{ marginLeft: 'auto' }}>→</span>
              </button>
            ))}
          </div>
        </section>

        <section style={styles.quote}>
          <span style={{ fontSize: 30 }}>“</span>
          <i>Algorithms are the poetry of logic.</i>
          <span style={{ marginLeft: 'auto' }}>— Ada Lovelace ”</span>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: COLORS.cream, color: COLORS.text, paddingBottom: 70 },

  hero: {
    minHeight: 390, padding: '42px 7%', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', gap: 40, position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, #EEEADF 0%, #E3E6D6 52%, #D6DDCB 100%)',
    borderBottom: '1px solid rgba(23,58,41,0.10)',
  },

  heroInner: { maxWidth: 720, position: 'relative', zIndex: 2 },

  eyebrow: {
    display: 'inline-block', padding: '8px 14px', borderRadius: 999,
    background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(52,78,65,0.18)',
    fontSize: 13, fontWeight: 700, marginBottom: 18,
  },

  heroTitle: { margin: 0, fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 0.95, fontWeight: 900, color: COLORS.dark },
  heroSubtitle: { margin: '8px 0 10px', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', lineHeight: 1, color: COLORS.green },
  heroText: { maxWidth: 620, fontSize: 17, lineHeight: 1.65, margin: 0, color: '#2F4036' },

  heroActions: {
    display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 14, marginTop: 26, maxWidth: 820,
  },

  heroAction: {
    border: '1px solid rgba(52,78,65,0.16)', borderRadius: 16, padding: '14px 16px',
    background: 'rgba(255,255,255,0.78)', color: COLORS.dark,
    display: 'grid', gridTemplateColumns: '34px 1fr auto', gap: 10,
    alignItems: 'center', textAlign: 'left', cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(52,78,65,0.07)',
  },

  heroActionText: {
    minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    gap: 3, lineHeight: 1.2,
  },

  heroActionTextSmall: { color: COLORS.muted, fontSize: 12 },

  heroActionIcon: {
    width: 34, height: 34, borderRadius: 10, background: 'rgba(88,129,87,0.16)',
    display: 'grid', placeItems: 'center', fontWeight: 900,
  },

  heroArtwork: {
    width: 470, height: 310, position: 'relative', display: 'grid', placeItems: 'center',
  },

  bookStack: { position: 'relative', width: 310, transform: 'rotate(-2deg)', zIndex: 2 },

  book: {
    background: COLORS.dark, color: '#FFFFFF', borderRadius: '10px 16px 16px 10px',
    padding: '18px 22px', marginTop: -7, boxShadow: '0 10px 18px rgba(23,58,41,0.20)',
    fontWeight: 800, letterSpacing: 1, borderLeft: '8px solid #588157',
  },

  leaf: { position: 'absolute', right: 30, top: 10, fontSize: 115, opacity: 0.8, transform: 'rotate(-10deg)' },

  note: {
    position: 'absolute', right: 0, bottom: 12, background: '#F8F5EB', color: COLORS.dark,
    padding: '18px 22px', borderRadius: 8, boxShadow: '0 10px 22px rgba(23,58,41,0.12)',
    fontSize: 18, lineHeight: 1.35, transform: 'rotate(3deg)', zIndex: 3,
  },

  browse: { padding: '42px 4%' },

  sectionHeading: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'end',
    gap: 24, marginBottom: 22,
  },

  sectionTitle: { margin: 0, fontSize: 28, fontWeight: 850, color: COLORS.dark },
  sectionSubtext: { margin: '6px 0 0', color: COLORS.muted, fontSize: 14 },

  searchWrap: {
    minWidth: 310, maxWidth: 430, flex: 1, display: 'flex', alignItems: 'center',
    position: 'relative', zIndex: 50, pointerEvents: 'auto', userSelect: 'text',
    gap: 10, background: 'rgba(255,255,255,0.68)',
    border: '1px solid rgba(52,78,65,0.15)', borderRadius: 999, padding: '10px 16px',
    boxShadow: '0 5px 16px rgba(52,78,65,0.05)',
  },

  search: {
    width: '100%', minWidth: 0, border: 0, outline: 0, background: 'transparent',
    color: COLORS.dark, fontSize: 15, fontFamily: 'inherit',
    pointerEvents: 'auto', userSelect: 'text', cursor: 'text',
  },
  clearSearch: { border: 0, background: 'transparent', color: COLORS.green, fontSize: 22, cursor: 'pointer' },

  tabs: { display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 10, marginBottom: 16 },

  tab: {
    border: '1px solid rgba(52,78,65,0.15)', background: 'rgba(255,255,255,0.55)',
    color: COLORS.dark, borderRadius: 14, padding: '12px 10px', cursor: 'pointer',
    minHeight: 64, textAlign: 'center',
  },

  tabText: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 4, lineHeight: 1.15,
  },

  tabTextSmall: { fontSize: 11 },

  tabActive: {
    background: COLORS.dark, color: '#FFFFFF', borderColor: COLORS.dark,
    boxShadow: '0 7px 18px rgba(23,58,41,0.17)',
  },

  resultInfo: {
    display: 'flex', justifyContent: 'space-between', color: COLORS.muted,
    fontSize: 13, margin: '8px 0 14px',
  },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 },

  card: {
    background: 'rgba(255,255,255,0.70)', border: '1px solid rgba(52,78,65,0.12)',
    borderRadius: 18, padding: 18, minHeight: 315, display: 'flex',
    flexDirection: 'column', gap: 12, boxShadow: '0 8px 22px rgba(52,78,65,0.06)',
  },

  cardTop: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },

  iconBox: {
    width: 48, height: 48, borderRadius: 14, background: 'rgba(163,177,138,0.30)',
    color: COLORS.dark, display: 'grid', placeItems: 'center',
  },

  cardTitle: { margin: 0, fontSize: 17, color: COLORS.dark },
  category: { display: 'inline-block', marginTop: 5, fontSize: 11, color: COLORS.green },

  unitBadge: {
    background: 'rgba(88,129,87,0.13)', border: '1px solid rgba(88,129,87,0.18)',
    color: COLORS.dark, borderRadius: 999, padding: '4px 8px', fontSize: 10, whiteSpace: 'nowrap',
  },

  description: { margin: 0, color: '#3F4B43', fontSize: 13, lineHeight: 1.55, minHeight: 60 },

  complexityGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, fontSize: 11, color: COLORS.dark,
  },

  complexityLabel: { display: 'block', color: '#738076', fontSize: 10, marginBottom: 2 },

  actionRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 'auto' },

  learnButton: {
    border: '1px solid rgba(52,78,65,0.25)', background: '#F5F1E6',
    color: COLORS.dark, borderRadius: 10, padding: '9px 8px',
    cursor: 'pointer', fontWeight: 700, fontSize: 12,
  },

  visualizeButton: {
    border: `1px solid ${COLORS.dark}`, background: COLORS.dark, color: '#FFFFFF',
    borderRadius: 10, padding: '9px 8px', cursor: 'pointer', fontWeight: 700, fontSize: 12,
  },

  comparisonSection: {
    margin: '0 4% 24px', padding: 24, borderRadius: 20,
    background: 'rgba(255,255,255,0.62)', border: '1px solid rgba(52,78,65,0.12)',
  },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: 12 },

  helper: {
    margin: '0 4% 24px', padding: 24, borderRadius: 20, background: '#F5F1E6',
    border: '1px solid rgba(52,78,65,0.12)',
  },

  helperGrid: { marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 },

  helperItem: {
    border: '1px solid rgba(52,78,65,0.12)', background: 'rgba(163,177,138,0.14)',
    color: COLORS.dark, borderRadius: 12, padding: '12px 14px', display: 'flex',
    alignItems: 'center', gap: 9, textAlign: 'left', cursor: 'pointer', fontWeight: 650,
  },

  helperIcon: {
    width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
    background: 'rgba(52,78,65,0.10)',
  },

  quote: {
    margin: '0 4%', padding: '18px 22px', borderRadius: 18,
    background: 'rgba(163,177,138,0.18)', color: COLORS.dark,
    display: 'flex', alignItems: 'center', gap: 12,
  },

  empty: {
    minHeight: 280, display: 'grid', placeItems: 'center', textAlign: 'center',
    background: 'rgba(255,255,255,0.55)', borderRadius: 18, padding: 40, color: COLORS.muted,
  },
};

export default Algorithms;

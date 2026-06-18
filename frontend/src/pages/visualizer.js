import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Color helpers ────────────────────────────────────────
const BAR_DEFAULT   = 'linear-gradient(180deg, #7c3aed, #4c1d95)';
const BAR_COMPARING = 'linear-gradient(180deg, #f59e0b, #d97706)';
const BAR_SWAPPING  = 'linear-gradient(180deg, #ef4444, #b91c1c)';
const BAR_SORTED    = 'linear-gradient(180deg, #22c55e, #15803d)';
const BAR_PIVOT     = 'linear-gradient(180deg, #ec4899, #be185d)';
const BAR_FOUND     = 'linear-gradient(180deg, #22c55e, #15803d)';
const BAR_SEARCHING = 'linear-gradient(180deg, #f59e0b, #d97706)';
const BAR_DISCARDED = 'linear-gradient(180deg, #374151, #1f2937)';

// ─── Algorithm generators ─────────────────────────────────
function* bubbleSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...a], comparing: [j, j + 1], sorted: Array.from({length: i}, (_, k) => n - 1 - k) };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { array: [...a], swapping: [j, j + 1], sorted: Array.from({length: i}, (_, k) => n - 1 - k) };
      }
    }
  }
  yield { array: [...a], sorted: Array.from({length: n}, (_, k) => k), done: true };
}

function* selectionSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  const sortedIdx = [];
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { array: [...a], comparing: [minIdx, j], sorted: [...sortedIdx] };
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { array: [...a], swapping: [i, minIdx], sorted: [...sortedIdx] };
    }
    sortedIdx.push(i);
  }
  sortedIdx.push(n - 1);
  yield { array: [...a], sorted: sortedIdx, done: true };
}

function* insertionSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0 && a[j - 1] > a[j]) {
      yield { array: [...a], comparing: [j - 1, j], sorted: Array.from({length: i}, (_, k) => k) };
      [a[j], a[j - 1]] = [a[j - 1], a[j]];
      yield { array: [...a], swapping: [j, j - 1], sorted: Array.from({length: i}, (_, k) => k) };
      j--;
    }
  }
  yield { array: [...a], sorted: Array.from({length: n}, (_, k) => k), done: true };
}

function* mergeSortGen(arr) {
  const a = [...arr];
  const steps = [];

  function mergeSort(arr, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }

  function merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
      steps.push({ array: [...arr], comparing: [left + i, mid + 1 + j] });
      if (leftArr[i] <= rightArr[j]) {
        arr[k++] = leftArr[i++];
      } else {
        arr[k++] = rightArr[j++];
      }
      steps.push({ array: [...arr], swapping: [k - 1] });
    }
    while (i < leftArr.length) { arr[k++] = leftArr[i++]; steps.push({ array: [...arr], swapping: [k-1] }); }
    while (j < rightArr.length) { arr[k++] = rightArr[j++]; steps.push({ array: [...arr], swapping: [k-1] }); }
  }

  mergeSort(a, 0, a.length - 1);
  steps.push({ array: [...a], sorted: Array.from({length: a.length}, (_, k) => k), done: true });
  for (const step of steps) yield step;
}

function* quickSortGen(arr) {
  const a = [...arr];
  const steps = [];
  const sortedSet = new Set();

  function quickSort(arr, low, high) {
    if (low < high) {
      const pi = partition(arr, low, high);
      sortedSet.add(pi);
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    } else if (low === high) sortedSet.add(low);
  }

  function partition(arr, low, high) {
    const pivot = arr[high];
    steps.push({ array: [...arr], pivot: high, sorted: [...sortedSet] });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ array: [...arr], comparing: [j, high], pivot: high, sorted: [...sortedSet] });
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ array: [...arr], swapping: [i, j], pivot: high, sorted: [...sortedSet] });
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({ array: [...arr], swapping: [i + 1, high], sorted: [...sortedSet] });
    return i + 1;
  }

  quickSort(a, 0, a.length - 1);
  steps.push({ array: [...a], sorted: Array.from({length: a.length}, (_, k) => k), done: true });
  for (const step of steps) yield step;
}

function* binarySearchGen(arr, target) {
  const a = [...arr].sort((x, y) => x - y);
  let low = 0, high = a.length - 1;
  const discarded = new Set();

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    yield { array: [...a], searching: mid, low, high, discarded: [...discarded] };
    if (a[mid] === target) {
      yield { array: [...a], found: mid, discarded: [...discarded], done: true };
      return;
    } else if (a[mid] < target) {
      for (let i = low; i <= mid; i++) discarded.add(i);
      low = mid + 1;
    } else {
      for (let i = mid; i <= high; i++) discarded.add(i);
      high = mid - 1;
    }
  }
  yield { array: [...a], notFound: true, discarded: [...discarded], done: true };
}

// ─── Bar Component ────────────────────────────────────────
function Bar({ value, maxValue, state, index, totalBars }) {
  const heightPct = Math.max(8, (value / maxValue) * 85);
  let bg = BAR_DEFAULT;
  if (state === 'comparing') bg = BAR_COMPARING;
  else if (state === 'swapping') bg = BAR_SWAPPING;
  else if (state === 'sorted') bg = BAR_SORTED;
  else if (state === 'pivot') bg = BAR_PIVOT;
  else if (state === 'found') bg = BAR_FOUND;
  else if (state === 'searching') bg = BAR_SEARCHING;
  else if (state === 'discarded') bg = BAR_DISCARDED;

  const width = Math.max(20, Math.min(60, Math.floor(520 / totalBars) - 4));

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: '100%',
      gap: '4px',
    }}>
      <div style={{
        fontSize: totalBars > 15 ? '9px' : '11px',
        color: '#c4b5fd',
        fontWeight: '600',
      }}>{value}</div>
      <div style={{
        width: `${width}px`,
        height: `${heightPct}%`,
        background: bg,
        borderRadius: '6px 6px 2px 2px',
        transition: 'height 0.15s ease, background 0.15s ease',
        boxShadow: state !== 'default'
          ? '0 0 12px rgba(168,85,247,0.6)'
          : '0 2px 8px rgba(0,0,0,0.3)',
        position: 'relative',
      }}>
        {/* 3D shine effect */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '40%',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '6px 6px 0 0',
        }} />
      </div>
    </div>
  );
}

// ─── Main Visualizer ──────────────────────────────────────
export default function Visualizer() {
  const [algorithms, setAlgorithms] = useState([]);
  const [selectedAlgo, setSelectedAlgo] = useState(null);
  const [array, setArray] = useState([]);
  const [arrayInput, setArrayInput] = useState('');
  const [arraySize, setArraySize] = useState(10);
  const [speed, setSpeed] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [searchTarget, setSearchTarget] = useState('');
  const [stepCount, setStepCount] = useState(0);
  const [comparisons, setComparisons] = useState(0);

  const generatorRef = useRef(null);
  const timerRef = useRef(null);
  const comparisonsRef = useRef(0);

  const resetState = useCallback(() => {
    clearInterval(timerRef.current);
    setIsPlaying(false);
    setIsDone(false);
    setCurrentStep(null);
    setStepCount(0);
    setComparisons(0);
    comparisonsRef.current = 0;
    generatorRef.current = null;
  }, []);

  const generateRandom = useCallback((size) => {
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setArray(arr);
    setArrayInput(arr.join(', '));
    resetState();
  }, [resetState]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/visualizer/algorithms/')
      .then(r => r.json())
      .then(data => { setAlgorithms(data); setSelectedAlgo(data[0]); });
    generateRandom(10);
  }, [generateRandom]);

  function applyCustomArray() {
    const parsed = arrayInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
    if (parsed.length < 2) return alert('Enter at least 2 valid numbers!');
    if (parsed.length > 20) return alert('Max 20 elements for visualization!');
    setArray(parsed);
    resetState();
  }

  function getGenerator() {
    if (!selectedAlgo) return null;
    const id = selectedAlgo.id;
    if (id === 'bubble-sort') return bubbleSortGen(array);
    if (id === 'selection-sort') return selectionSortGen(array);
    if (id === 'insertion-sort') return insertionSortGen(array);
    if (id === 'merge-sort') return mergeSortGen(array);
    if (id === 'quick-sort') return quickSortGen(array);
    if (id === 'binary-search') {
      const t = parseInt(searchTarget);
      if (isNaN(t)) { alert('Enter a valid search target!'); return null; }
      return binarySearchGen(array, t);
    }
    return null;
  }

  function playPause() {
    if (isDone) return;
    if (isPlaying) {
      clearInterval(timerRef.current);
      setIsPlaying(false);
      return;
    }
    if (!generatorRef.current) {
      const gen = getGenerator();
      if (!gen) return;
      generatorRef.current = gen;
    }
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      const result = generatorRef.current.next();
      if (result.done || result.value?.done) {
        clearInterval(timerRef.current);
        setIsPlaying(false);
        setIsDone(true);
        if (result.value) setCurrentStep(result.value);
      } else {
        setCurrentStep(result.value);
        setStepCount(s => s + 1);
        if (result.value.comparing) {
          comparisonsRef.current += 1;
          setComparisons(comparisonsRef.current);
        }
      }
    }, speed);
  }

  function stepForward() {
    if (isDone) return;
    if (!generatorRef.current) {
      const gen = getGenerator();
      if (!gen) return;
      generatorRef.current = gen;
    }
    const result = generatorRef.current.next();
    if (result.done || result.value?.done) {
      setIsDone(true);
      if (result.value) setCurrentStep(result.value);
    } else {
      setCurrentStep(result.value);
      setStepCount(s => s + 1);
      if (result.value.comparing) {
        comparisonsRef.current += 1;
        setComparisons(comparisonsRef.current);
      }
    }
  }

  function reset() {
    generateRandom(arraySize);
  }

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      if (isPlaying && generatorRef.current) {
        timerRef.current = setInterval(() => {
          const result = generatorRef.current.next();
          if (result.done || result.value?.done) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            setIsDone(true);
            if (result.value) setCurrentStep(result.value);
          } else {
            setCurrentStep(result.value);
            setStepCount(s => s + 1);
            if (result.value.comparing) {
              comparisonsRef.current += 1;
              setComparisons(comparisonsRef.current);
            }
          }
        }, speed);
      }
    }
  }, [speed, isPlaying]);

  // Compute bar states
  const displayArray = currentStep?.array || array;
  const maxVal = Math.max(...displayArray, 1);

  function getBarState(i) {
    if (!currentStep) return 'default';
    if (currentStep.done && currentStep.sorted?.includes(i)) return 'sorted';
    if (currentStep.found === i) return 'found';
    if (currentStep.notFound) return 'discarded';
    if (currentStep.discarded?.includes(i)) return 'discarded';
    if (currentStep.searching === i) return 'searching';
    if (currentStep.pivot === i) return 'pivot';
    if (currentStep.swapping?.includes(i)) return 'swapping';
    if (currentStep.comparing?.includes(i)) return 'comparing';
    if (currentStep.sorted?.includes(i)) return 'sorted';
    return 'default';
  }

  const isBinarySearch = selectedAlgo?.id === 'binary-search';

  return (
    <div style={S.container}>

      {/* Header */}
      <div style={S.header}>
        <div style={S.headerBadge}>⚡ Algorithm Visualizer</div>
        <h1 style={S.title}>Visual <span style={S.highlight}>Playground</span></h1>
        <p style={S.subtitle}>Watch sorting & searching algorithms come alive — step by step</p>
      </div>

      <div style={S.body}>

        {/* Left Panel */}
        <div style={S.leftPanel}>

          {/* Algorithm selector */}
          <div style={S.panel}>
            <div style={S.panelTitle}>🧠 Algorithm</div>
            <div style={S.algoList}>
              {algorithms.map(a => (
                <button
                  key={a.id}
                  style={{ ...S.algoBtn, ...(selectedAlgo?.id === a.id ? S.algoBtnActive : {}) }}
                  onClick={() => { setSelectedAlgo(a); resetState(); setArray([...array]); }}
                >
                  <span>{a.name}</span>
                  <span style={S.algoCat}>{a.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Complexity info */}
          {selectedAlgo && (
            <div style={S.panel}>
              <div style={S.panelTitle}>📊 Complexity</div>
              <p style={S.algoDesc}>{selectedAlgo.description}</p>
              <div style={S.complexityGrid}>
                <div style={S.cRow}><span style={S.cLabel}>Best</span><span style={S.cBest}>{selectedAlgo.time_best}</span></div>
                <div style={S.cRow}><span style={S.cLabel}>Avg</span><span style={S.cAvg}>{selectedAlgo.time_avg}</span></div>
                <div style={S.cRow}><span style={S.cLabel}>Worst</span><span style={S.cWorst}>{selectedAlgo.time_worst}</span></div>
                <div style={S.cRow}><span style={S.cLabel}>Space</span><span style={S.cSpace}>{selectedAlgo.space}</span></div>
              </div>
            </div>
          )}

          {/* Legend */}
          <div style={S.panel}>
            <div style={S.panelTitle}>🎨 Legend</div>
            <div style={S.legendList}>
              {[
                { color: '#7c3aed', label: 'Default' },
                { color: '#f59e0b', label: 'Comparing' },
                { color: '#ef4444', label: 'Swapping' },
                { color: '#22c55e', label: 'Sorted / Found' },
                { color: '#ec4899', label: 'Pivot' },
                { color: '#374151', label: 'Discarded' },
              ].map(l => (
                <div key={l.label} style={S.legendRow}>
                  <div style={{ ...S.legendDot, background: l.color }} />
                  <span style={S.legendLabel}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Panel */}
        <div style={S.rightPanel}>

          {/* Controls */}
          <div style={S.controlsPanel}>

            {/* Array controls */}
            <div style={S.controlRow}>
              <div style={S.controlGroup}>
                <label style={S.label}>Array Size: {arraySize}</label>
                <input
                  type="range" min="4" max="20" value={arraySize}
                  style={S.slider}
                  onChange={e => {
                    const s = parseInt(e.target.value);
                    setArraySize(s);
                    generateRandom(s);
                  }}
                />
              </div>
              <div style={S.controlGroup}>
                <label style={S.label}>Speed</label>
                <input
                  type="range" min="50" max="1000" value={1050 - speed}
                  style={S.slider}
                  onChange={e => setSpeed(1050 - parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Custom array */}
            <div style={S.customRow}>
              <input
                style={S.input}
                placeholder="Custom array: 45, 12, 78, 34, 56 ..."
                value={arrayInput}
                onChange={e => setArrayInput(e.target.value)}
              />
              <button style={S.applyBtn} onClick={applyCustomArray}>Apply</button>
            </div>

            {/* Binary search target */}
            {isBinarySearch && (
              <div style={S.customRow}>
                <input
                  style={S.input}
                  placeholder="Search target (number)..."
                  value={searchTarget}
                  onChange={e => setSearchTarget(e.target.value)}
                />
              </div>
            )}

            {/* Play controls */}
            <div style={S.btnRow}>
              <button style={S.resetBtn} onClick={reset}>↺ Reset</button>
              <button style={S.stepBtn} onClick={stepForward} disabled={isDone}>⏭ Step</button>
              <button
                style={{ ...S.playBtn, ...(isPlaying ? S.pauseBtn : {}) }}
                onClick={playPause}
                disabled={isDone}
              >
                {isDone ? '✅ Done' : isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>

            {/* Stats */}
            <div style={S.statsRow}>
              <div style={S.stat}><span style={S.statVal}>{stepCount}</span><span style={S.statLbl}>Steps</span></div>
              <div style={S.stat}><span style={S.statVal}>{comparisons}</span><span style={S.statLbl}>Comparisons</span></div>
              <div style={S.stat}><span style={S.statVal}>{displayArray.length}</span><span style={S.statLbl}>Elements</span></div>
              <div style={S.stat}>
                <span style={{ ...S.statVal, color: isDone ? '#22c55e' : isPlaying ? '#f59e0b' : '#a855f7' }}>
                  {isDone ? 'Done' : isPlaying ? 'Running' : 'Ready'}
                </span>
                <span style={S.statLbl}>Status</span>
              </div>
            </div>

          </div>

          {/* Visualization area */}
          <div style={S.vizArea}>
            {currentStep?.notFound && (
              <div style={S.notFoundMsg}>❌ Element not found in array</div>
            )}
            {currentStep?.found !== undefined && (
              <div style={S.foundMsg}>✅ Found at index {currentStep.found}!</div>
            )}
            <div style={S.barsContainer}>
              {displayArray.map((val, i) => (
                <Bar
                  key={i}
                  value={val}
                  maxValue={maxVal}
                  state={getBarState(i)}
                  index={i}
                  totalBars={displayArray.length}
                />
              ))}
            </div>
            {isBinarySearch && currentStep && (
              <div style={S.searchInfo}>
                <span style={S.searchSpan}>Low: {currentStep.low ?? '-'}</span>
                <span style={S.searchSpan}>Mid: {currentStep.searching ?? currentStep.found ?? '-'}</span>
                <span style={S.searchSpan}>High: {currentStep.high ?? '-'}</span>
                <span style={S.searchSpan}>Target: {searchTarget}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

const S = {
  container: { backgroundColor: '#0a0010', minHeight: '100vh', paddingBottom: '60px' },
  header: {
    textAlign: 'center', padding: '50px 20px 30px',
    background: 'linear-gradient(180deg, rgba(124,58,237,0.15) 0%, transparent 100%)',
    borderBottom: '1px solid rgba(139,92,246,0.2)',
  },
  headerBadge: {
    display: 'inline-block', background: 'rgba(139,92,246,0.15)',
    border: '1px solid rgba(139,92,246,0.35)', color: '#c4b5fd',
    padding: '6px 16px', borderRadius: '20px', fontSize: '13px', marginBottom: '16px',
  },
  title: { color: 'white', fontSize: '2.8rem', fontWeight: '800', marginBottom: '10px' },
  highlight: { color: '#a855f7', textShadow: '0 0 30px rgba(168,85,247,0.5)' },
  subtitle: { color: '#9ca3af', fontSize: '1rem' },
  body: { display: 'flex', gap: '24px', padding: '30px 40px', alignItems: 'flex-start' },
  leftPanel: { width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' },
  rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' },
  panel: {
    background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '16px', padding: '20px',
  },
  panelTitle: { color: '#a855f7', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', marginBottom: '14px', textTransform: 'uppercase' },
  algoList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  algoBtn: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 14px', borderRadius: '10px',
    border: '1px solid rgba(139,92,246,0.2)', background: 'transparent',
    color: '#c4b5fd', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
  },
  algoBtnActive: {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: '1px solid #a855f7', color: 'white',
    boxShadow: '0 0 15px rgba(139,92,246,0.3)',
  },
  algoCat: { fontSize: '11px', color: '#7c3aed', background: 'rgba(124,58,237,0.15)', padding: '2px 8px', borderRadius: '10px' },
  algoDesc: { color: '#9ca3af', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '14px' },
  complexityGrid: { display: 'flex', flexDirection: 'column', gap: '8px' },
  cRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cLabel: { color: '#6b7280', fontSize: '12px' },
  cBest: { color: '#22c55e', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' },
  cAvg: { color: '#f59e0b', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' },
  cWorst: { color: '#ef4444', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' },
  cSpace: { color: '#a855f7', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' },
  legendList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  legendRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  legendDot: { width: '12px', height: '12px', borderRadius: '3px', flexShrink: 0 },
  legendLabel: { color: '#c4b5fd', fontSize: '13px' },
  controlsPanel: {
    background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
  },
  controlRow: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  controlGroup: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  label: { color: '#c4b5fd', fontSize: '13px', fontWeight: '600' },
  slider: { accentColor: '#a855f7', cursor: 'pointer', width: '100%' },
  customRow: { display: 'flex', gap: '10px' },
  input: {
    flex: 1, padding: '10px 14px', borderRadius: '10px',
    border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(0,0,0,0.3)',
    color: 'white', fontSize: '14px', outline: 'none',
  },
  applyBtn: {
    padding: '10px 20px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
  btnRow: { display: 'flex', gap: '10px' },
  resetBtn: {
    padding: '10px 20px', borderRadius: '10px',
    border: '1px solid rgba(139,92,246,0.3)', background: 'transparent',
    color: '#c4b5fd', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
  },
  stepBtn: {
    padding: '10px 20px', borderRadius: '10px',
    border: '1px solid rgba(139,92,246,0.3)', background: 'transparent',
    color: '#c4b5fd', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
  },
  playBtn: {
    flex: 1, padding: '10px 20px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: 'white', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '700',
    boxShadow: '0 0 20px rgba(139,92,246,0.4)',
  },
  pauseBtn: { background: 'linear-gradient(135deg, #d97706, #f59e0b)' },
  statsRow: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  stat: {
    flex: 1, textAlign: 'center', background: 'rgba(0,0,0,0.3)',
    borderRadius: '10px', padding: '10px', border: '1px solid rgba(139,92,246,0.15)',
  },
  statVal: { display: 'block', color: '#a855f7', fontSize: '1.4rem', fontWeight: '800' },
  statLbl: { color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' },
  vizArea: {
    background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '16px', padding: '24px', minHeight: '320px',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '12px',
    position: 'relative',
  },
  barsContainer: {
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    gap: '4px', height: '260px', width: '100%',
  },
  searchInfo: {
    display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap',
    padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px',
  },
  searchSpan: { color: '#c4b5fd', fontSize: '13px', fontWeight: '600' },
  foundMsg: {
    textAlign: 'center', color: '#22c55e', fontSize: '1rem', fontWeight: '700',
    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: '10px', padding: '10px',
  },
  notFoundMsg: {
    textAlign: 'center', color: '#ef4444', fontSize: '1rem', fontWeight: '700',
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px', padding: '10px',
  },
};

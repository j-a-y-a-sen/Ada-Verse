import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar,
} from 'recharts';

const complexityData = Array.from({ length: 12 }, (_, i) => {
  const n = (i + 1) * 4;
  return { n, 'O(1)': 1, 'O(log n)': +(Math.log2(n)).toFixed(2), 'O(n)': n, 'O(n log n)': +(n * Math.log2(n)).toFixed(2), 'O(n²)': n * n };
});
const asymptData = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  return { n, 'T(n)': +(2.5 * n + 3).toFixed(1), 'c₁·f(n)': +(1.5 * n).toFixed(1), 'c₂·f(n)': +(4 * n).toFixed(1) };
});
const barData = [
  { algo: 'Binary Search', O: 5, Ω: 1, Θ: 3 },
  { algo: 'Bubble Sort', O: 25, Ω: 5, Θ: 15 },
  { algo: 'Merge Sort', O: 17, Ω: 17, Θ: 17 },
  { algo: 'Quick Sort', O: 25, Ω: 5, Θ: 12 },
  { algo: 'Hash Lookup', O: 5, Ω: 1, Θ: 1 },
];

// ── KEY FIX: Chart wrapper that waits for DOM to be ready ──
function ChartBox({ height = 320, children }) {
  const [ready, setReady] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div ref={ref} style={{ width: '100%', height: height, minHeight: height, display: 'block', position: 'relative' }}>
      {ready && (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
}

function SectionCard({ title, children, color = '#a855f7' }) {
  return (
    <div style={{ background: 'rgba(139,92,246,0.06)', border: `1px solid ${color}33`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
      <div style={{ color, fontWeight: 800, fontSize: 15, marginBottom: 16, letterSpacing: 0.5 }}>{title}</div>
      {children}
    </div>
  );
}
function InfoBox({ label, text, color = '#a855f7' }) {
  return (
    <div style={{ background: `${color}11`, border: `1px solid ${color}44`, borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
      <div style={{ color, fontWeight: 700, fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ color: '#c4b5fd', fontSize: 13, lineHeight: 1.7 }}>{text}</div>
    </div>
  );
}
function CodeBlock({ code }) {
  return (
    <pre style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 10, padding: '14px 18px', color: '#a5f3fc', fontSize: 12, fontFamily: 'monospace', overflowX: 'auto', lineHeight: 1.8, margin: '12px 0' }}>
      {code}
    </pre>
  );
}

// ── CHARTS ──
function ComplexityChart() {
  return (
    <SectionCard title="📈 Algorithm Complexity Growth Comparison">
      <ChartBox height={320}>
        <LineChart data={complexityData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.15)" />
          <XAxis dataKey="n" stroke="#9ca3af" label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -15, fill: '#9ca3af', fontSize: 12 }} />
          <YAxis stroke="#9ca3af" width={55} />
          <Tooltip contentStyle={{ background: '#1a0030', border: '1px solid #7c3aed', borderRadius: 10, color: 'white' }} />
          <Legend wrapperStyle={{ color: '#c4b5fd', paddingTop: 16 }} />
          <Line type="monotone" dataKey="O(1)" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="O(log n)" stroke="#a855f7" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="O(n)" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="O(n log n)" stroke="#f59e0b" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="O(n²)" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartBox>
    </SectionCard>
  );
}

function AsymptoticGraph() {
  return (
    <SectionCard title="📐 Θ(n) Tight Bound — T(n) sandwiched between c₁·f(n) and c₂·f(n)">
      <ChartBox height={300}>
        <AreaChart data={asymptData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
          <defs>
            <linearGradient id="upperG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lowerG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.15)" />
          <XAxis dataKey="n" stroke="#9ca3af" label={{ value: 'n (after n₀)', position: 'insideBottom', offset: -15, fill: '#9ca3af', fontSize: 12 }} />
          <YAxis stroke="#9ca3af" width={40} />
          <Tooltip contentStyle={{ background: '#1a0030', border: '1px solid #7c3aed', borderRadius: 10, color: 'white' }} />
          <Legend wrapperStyle={{ color: '#c4b5fd', paddingTop: 16 }} />
          <Area type="monotone" dataKey="c₂·f(n)" stroke="#ef4444" fill="url(#upperG)" strokeWidth={2} strokeDasharray="6 3" dot={false} name="c₂·f(n) — Big-O upper" />
          <Area type="monotone" dataKey="T(n)" stroke="#f59e0b" fill="none" strokeWidth={3} dot={false} name="T(n) — Actual runtime" />
          <Area type="monotone" dataKey="c₁·f(n)" stroke="#22c55e" fill="url(#lowerG)" strokeWidth={2} strokeDasharray="6 3" dot={false} name="c₁·f(n) — Big-Ω lower" />
        </AreaChart>
      </ChartBox>
    </SectionCard>
  );
}

function NotationBarChart() {
  return (
    <SectionCard title="⚖️ Big-O vs Big-Ω vs Big-Θ Comparison">
      <ChartBox height={300}>
        <BarChart data={barData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.15)" />
          <XAxis dataKey="algo" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 10 }} angle={-15} textAnchor="end" />
          <YAxis stroke="#9ca3af" width={35} />
          <Tooltip contentStyle={{ background: '#1a0030', border: '1px solid #7c3aed', borderRadius: 10, color: 'white' }} />
          <Legend wrapperStyle={{ color: '#c4b5fd', paddingTop: 24 }} />
          <Bar dataKey="O" name="Big-O Worst" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Θ" name="Big-Θ Average" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Ω" name="Big-Ω Best" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartBox>
    </SectionCard>
  );
}

function BestWorstAvgTable() {
  const rows = [
    { algo: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: '✅' },
    { algo: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: '❌' },
    { algo: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: '✅' },
    { algo: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: '✅' },
    { algo: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: '❌' },
    { algo: 'Heap Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: '❌' },
    { algo: 'Binary Search', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)', stable: 'N/A' },
    { algo: 'Strassen', best: 'O(n^2.8)', avg: 'O(n^2.8)', worst: 'O(n^2.8)', space: 'O(n²)', stable: 'N/A' },
  ];
  const col = v => {
    if (v.includes('n²') || v.includes('2.8')) return '#ef4444';
    if (v.includes('n log')) return '#f59e0b';
    if (v === 'O(n)') return '#3b82f6';
    if (v.includes('log')) return '#a855f7';
    if (v === 'O(1)') return '#22c55e';
    return '#c4b5fd';
  };
  return (
    <SectionCard title="📋 Complete Complexity Reference — All Algorithms">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>{['Algorithm', 'Best', 'Average', 'Worst', 'Space', 'Stable'].map(h => (
              <th key={h} style={{ padding: '10px 14px', background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', fontWeight: 700, textAlign: 'left', borderBottom: '1px solid rgba(139,92,246,0.3)' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.algo} style={{ background: i % 2 === 0 ? 'rgba(139,92,246,0.04)' : 'transparent' }}>
                <td style={{ padding: '10px 14px', color: 'white', fontWeight: 600, borderBottom: '1px solid rgba(139,92,246,0.1)' }}>{r.algo}</td>
                {[r.best, r.avg, r.worst, r.space].map((v, j) => (
                  <td key={j} style={{ padding: '10px 14px', color: col(v), fontFamily: 'monospace', fontWeight: 700, borderBottom: '1px solid rgba(139,92,246,0.1)' }}>{v}</td>
                ))}
                <td style={{ padding: '10px 14px', color: '#c4b5fd', borderBottom: '1px solid rgba(139,92,246,0.1)', textAlign: 'center' }}>{r.stable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function SpaceComplexityVisual() {
  const data = [
    { algo: 'Bubble/Selection/Insertion', space: 'O(1)', level: 1, color: '#22c55e', note: 'In-place, no extra memory' },
    { algo: 'Binary Search (iterative)', space: 'O(1)', level: 1, color: '#22c55e', note: 'Only a few variables' },
    { algo: 'Quick Sort', space: 'O(log n)', level: 2, color: '#a855f7', note: 'Recursion stack depth' },
    { algo: 'Heap Sort', space: 'O(1)', level: 1, color: '#22c55e', note: 'In-place using heap' },
    { algo: 'Merge Sort', space: 'O(n)', level: 4, color: '#3b82f6', note: 'Needs auxiliary arrays' },
    { algo: 'Strassen', space: 'O(n²)', level: 5, color: '#ef4444', note: 'Sub-matrix storage' },
  ];
  return (
    <SectionCard title="💾 Space Complexity — Memory Usage by Algorithm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map(item => (
          <div key={item.algo} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 170, color: '#c4b5fd', fontSize: 11, textAlign: 'right', flexShrink: 0 }}>{item.algo}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} style={{ width: 26, height: 26, borderRadius: 6, background: j < item.level ? item.color : 'rgba(139,92,246,0.1)', border: `1px solid ${j < item.level ? item.color : 'rgba(139,92,246,0.2)'}`, boxShadow: j < item.level ? `0 0 8px ${item.color}66` : 'none' }} />
              ))}
            </div>
            <div style={{ color: item.color, fontWeight: 700, fontSize: 12, fontFamily: 'monospace', width: 75 }}>{item.space}</div>
            <div style={{ color: '#6b7280', fontSize: 11 }}>{item.note}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function BubbleSortDiagram() {
  const [step, setStep] = useState(0);
  const steps = [
    { arr: [64, 34, 25, 12, 22], comparing: [0, 1], label: 'Pass 1: Compare 64 and 34 → Swap!' },
    { arr: [34, 64, 25, 12, 22], comparing: [1, 2], label: 'Compare 64 and 25 → Swap!' },
    { arr: [34, 25, 64, 12, 22], comparing: [2, 3], label: 'Compare 64 and 12 → Swap!' },
    { arr: [34, 25, 12, 64, 22], comparing: [3, 4], label: 'Compare 64 and 22 → Swap! Pass 1 done.' },
    { arr: [34, 25, 12, 22, 64], comparing: [0, 1], sorted: [4], label: '64 bubbled to end. Pass 2 starts.' },
    { arr: [25, 34, 12, 22, 64], comparing: [1, 2], sorted: [4], label: 'Compare 34 and 12 → Swap!' },
    { arr: [25, 12, 34, 22, 64], comparing: [2, 3], sorted: [4], label: 'Compare 34 and 22 → Swap!' },
    { arr: [25, 12, 22, 34, 64], comparing: [], sorted: [3, 4], label: 'Pass 2 done.' },
    { arr: [12, 22, 25, 34, 64], comparing: [], sorted: [0, 1, 2, 3, 4], label: '✅ Array fully sorted!' },
  ];
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 1300);
    return () => clearInterval(t);
  }, [steps.length]);
  const s = steps[step];
  return (
    <SectionCard title="🫧 Bubble Sort — Step by Step Animation">
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
        {s.arr.map((val, idx) => (
          <div key={idx} style={{ width: 48, height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: 'white', background: s.sorted?.includes(idx) ? '#22c55e' : s.comparing?.includes(idx) ? '#f59e0b' : 'rgba(139,92,246,0.3)', border: `2px solid ${s.sorted?.includes(idx) ? '#22c55e' : s.comparing?.includes(idx) ? '#f59e0b' : 'rgba(139,92,246,0.3)'}`, transition: 'all 0.3s' }}>{val}</div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: '#c4b5fd', fontSize: 13, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 10 }}>{s.label}</div>
    </SectionCard>
  );
}

function MergeSortDiagram() {
  const [active, setActive] = useState(0);
  const nodes = [
    { items: [[38, 27, 43, 3, 9, 82, 10]], label: 'Original Array' },
    { items: [[38, 27, 43, 3], [9, 82, 10]], label: 'Divide into halves' },
    { items: [[38, 27], [43, 3], [9, 82], [10]], label: 'Divide again' },
    { items: [[38], [27], [43], [3], [9], [82], [10]], label: 'Individual elements' },
    { items: [[27, 38], [3, 43], [9, 82], [10]], label: 'Merge pairs (sorted)' },
    { items: [[3, 27, 38, 43], [9, 10, 82]], label: 'Merge halves' },
    { items: [[3, 9, 10, 27, 38, 43, 82]], label: '✅ Sorted!' },
  ];
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % nodes.length), 1100);
    return () => clearInterval(t);
  }, [nodes.length]);
  return (
    <SectionCard title="🔀 Merge Sort — Divide & Conquer Visualization">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        {nodes.map((row, ri) => (
          <div key={ri} style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {row.items.map((arr, ai) => (
                <div key={ai} style={{ display: 'flex', gap: 3, background: ri === active ? 'rgba(168,85,247,0.2)' : 'rgba(139,92,246,0.06)', border: `1px solid ${ri === active ? '#a855f7' : 'rgba(139,92,246,0.2)'}`, borderRadius: 8, padding: '6px 10px', boxShadow: ri === active ? '0 0 15px rgba(168,85,247,0.4)' : 'none', transition: 'all 0.4s' }}>
                  {arr.map((n, ni) => (
                    <div key={ni} style={{ width: 28, height: 28, background: ri === active ? 'rgba(168,85,247,0.4)' : 'rgba(139,92,246,0.15)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>{n}</div>
                  ))}
                </div>
              ))}
            </div>
            {ri < nodes.length - 1 && <div style={{ textAlign: 'center', color: '#7c3aed', fontSize: 18, marginTop: 4 }}>↓</div>}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: '#a855f7', fontSize: 13, fontWeight: 700, marginTop: 12, background: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 8 }}>
        Step: {nodes[active].label}
      </div>
    </SectionCard>
  );
}

function QuickSortDiagram() {
  const [phase, setPhase] = useState(0);
  const phases = [
    { arr: [64, 34, 25, 12, 22, 11, 90], pivot: 6, i: -1, j: 0, label: 'Initial: Pivot = 90 (last element)' },
    { arr: [64, 34, 25, 12, 22, 11, 90], pivot: 6, i: 0, j: 1, label: '64 < 90 → i=0' },
    { arr: [64, 34, 25, 12, 22, 11, 90], pivot: 6, i: 1, j: 2, label: '34 < 90 → i=1' },
    { arr: [64, 34, 25, 12, 22, 11, 90], pivot: 6, i: 2, j: 3, label: '25 < 90 → i=2' },
    { arr: [64, 34, 25, 12, 22, 11, 90], pivot: 6, i: 4, j: 5, label: 'All elements < pivot moved left' },
    { arr: [11, 12, 22, 25, 34, 64, 90], pivot: 6, i: 5, j: 6, label: '✅ Pivot at correct position!' },
  ];
  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p + 1) % phases.length), 1500);
    return () => clearInterval(t);
  }, [phases.length]);
  const p = phases[phase];
  return (
    <SectionCard title="⚡ Quick Sort — Partition Step Visualization">
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
        {p.arr.map((val, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'white', background: idx === p.pivot ? '#ec4899' : idx === p.i ? '#f59e0b' : idx === p.j ? '#3b82f6' : phase === phases.length - 1 ? '#22c55e' : 'rgba(139,92,246,0.3)', border: `2px solid ${idx === p.pivot ? '#ec4899' : idx === p.i ? '#f59e0b' : idx === p.j ? '#3b82f6' : 'rgba(139,92,246,0.3)'}`, transition: 'all 0.4s' }}>{val}</div>
            <div style={{ fontSize: 9, color: idx === p.pivot ? '#ec4899' : idx === p.i ? '#f59e0b' : idx === p.j ? '#3b82f6' : 'transparent', fontWeight: 700 }}>
              {idx === p.pivot ? 'pivot' : idx === p.i ? 'i' : idx === p.j ? 'j' : '.'}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: '#c4b5fd', fontSize: 13, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 10 }}>{p.label}</div>
    </SectionCard>
  );
}

function BinarySearchFlow() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: 'Start', color: '#22c55e', shape: 'oval' },
    { label: 'Set\nbeg=LB, end=UB', color: '#7c3aed', shape: 'rect' },
    { label: 'beg ≤ end?', color: '#f59e0b', shape: 'diamond' },
    { label: 'mid=(beg+end)/2', color: '#7c3aed', shape: 'rect' },
    { label: 'arr[mid]==key?', color: '#f59e0b', shape: 'diamond' },
    { label: 'Return mid ✅', color: '#22c55e', shape: 'oval' },
    { label: 'key<arr[mid]?', color: '#f59e0b', shape: 'diamond' },
    { label: 'end=mid-1', color: '#3b82f6', shape: 'rect' },
    { label: 'beg=mid+1', color: '#3b82f6', shape: 'rect' },
    { label: 'Return -1 ❌', color: '#ef4444', shape: 'oval' },
  ];
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 1100);
    return () => clearInterval(t);
  }, [steps.length]);
  return (
    <SectionCard title="🔍 Binary Search — Animated Flowchart">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ padding: s.shape === 'diamond' ? 0 : '8px 16px', minWidth: s.shape === 'diamond' ? 60 : 150, minHeight: s.shape === 'diamond' ? 60 : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === step ? s.color : 'rgba(139,92,246,0.1)', border: `2px solid ${s.color}`, borderRadius: s.shape === 'oval' ? 50 : s.shape === 'diamond' ? 4 : 8, transform: s.shape === 'diamond' ? 'rotate(45deg)' : 'none', boxShadow: i === step ? `0 0 20px ${s.color}` : 'none', transition: 'all 0.4s' }}>
              <div style={{ transform: s.shape === 'diamond' ? 'rotate(-45deg)' : 'none', color: i === step ? 'white' : '#c4b5fd', fontSize: 11, fontWeight: 600, textAlign: 'center', whiteSpace: 'pre-line' }}>{s.label}</div>
            </div>
            {i < steps.length - 1 && <div style={{ width: 2, height: 18, background: i < step ? '#a855f7' : 'rgba(139,92,246,0.3)', transition: 'all 0.4s' }} />}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function HeapDiagram() {
  const [heapType, setHeapType] = useState('max');
  const maxHeap = { nodes: [19, 12, 16, 1, 4, 7], type: 'Max Heap', color: '#ef4444', property: 'A[Parent(i)] ≥ A[i]' };
  const minHeap = { nodes: [1, 4, 16, 7, 12, 19], type: 'Min Heap', color: '#22c55e', property: 'A[Parent(i)] ≤ A[i]' };
  const h = heapType === 'max' ? maxHeap : minHeap;
  const positions = [{ x: 200, y: 30 }, { x: 110, y: 100 }, { x: 290, y: 100 }, { x: 60, y: 170 }, { x: 160, y: 170 }, { x: 240, y: 170 }];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  return (
    <SectionCard title="🌲 Heap Data Structure — Max & Min Heap">
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, justifyContent: 'center' }}>
        {['max', 'min'].map(t => (
          <button key={t} onClick={() => setHeapType(t)} style={{ padding: '8px 20px', borderRadius: 20, border: `2px solid ${heapType === t ? (t === 'max' ? '#ef4444' : '#22c55e') : 'rgba(139,92,246,0.3)'}`, background: heapType === t ? (t === 'max' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)') : 'transparent', color: heapType === t ? (t === 'max' ? '#ef4444' : '#22c55e') : '#9ca3af', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            {t === 'max' ? '🔴 Max Heap' : '🟢 Min Heap'}
          </button>
        ))}
      </div>
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <svg width="100%" height="220" viewBox="0 0 400 220">
          {edges.map(([a, b], i) => <line key={i} x1={positions[a].x} y1={positions[a].y + 20} x2={positions[b].x} y2={positions[b].y + 20} stroke={`${h.color}66`} strokeWidth={2} />)}
          {positions.map((pos, i) => (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y + 20} r={22} fill={`${h.color}22`} stroke={h.color} strokeWidth={2} />
              <text x={pos.x} y={pos.y + 26} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{h.nodes[i]}</text>
            </g>
          ))}
        </svg>
      </div>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <div style={{ color: h.color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{h.type}</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {h.nodes.map((n, i) => <div key={i} style={{ width: 34, height: 34, borderRadius: 6, background: `${h.color}22`, border: `1px solid ${h.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>{n}</div>)}
        </div>
        <div style={{ color: h.color, fontSize: 13, fontFamily: 'monospace', marginTop: 8, fontWeight: 700 }}>{h.property}</div>
      </div>
    </SectionCard>
  );
}

function HeapSortSteps() {
  const [step, setStep] = useState(0);
  const steps = [
    { arr: [4, 10, 3, 5, 1], label: 'Step 1: Build Max Heap from [4,10,3,5,1]', active: 'build' },
    { arr: [5, 4, 3, 1, 10], label: 'Step 2: Swap root(10) with last → Extract 10', active: 'swap', sorted: [10] },
    { arr: [4, 1, 3, 5, 10], label: 'Step 3: Heapify, extract 5', active: 'swap', sorted: [5, 10] },
    { arr: [3, 1, 4, 5, 10], label: 'Step 4: Extract 4', active: 'swap', sorted: [4, 5, 10] },
    { arr: [1, 3, 4, 5, 10], label: '✅ Sorted: [1, 3, 4, 5, 10]', active: 'done', sorted: [1, 3, 4, 5, 10] },
  ];
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 1500);
    return () => clearInterval(t);
  }, [steps.length]);
  const s = steps[step];
  return (
    <SectionCard title="🔢 Heap Sort — Step by Step Process">
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {s.arr.map((v, i) => (
          <div key={i} style={{ width: 42, height: 42, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'white', background: s.sorted?.includes(v) ? '#22c55e' : s.active === 'build' ? '#7c3aed' : '#f59e0b', border: `2px solid ${s.sorted?.includes(v) ? '#22c55e' : s.active === 'build' ? '#7c3aed' : '#f59e0b'}`, transition: 'all 0.4s' }}>{v}</div>
        ))}
      </div>
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '10px 14px', color: '#c4b5fd', fontSize: 13 }}>{s.label}</div>
    </SectionCard>
  );
}

function ComplexitySphere() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0, raf;
    const items = [
      { label: 'O(1)', color: '#22c55e', r: 20 }, { label: 'O(log n)', color: '#a855f7', r: 45 },
      { label: 'O(n)', color: '#3b82f6', r: 70 }, { label: 'O(n log n)', color: '#f59e0b', r: 100 },
      { label: 'O(n²)', color: '#ef4444', r: 135 },
    ];
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2, cy = canvas.height / 2;
      items.forEach(c => { ctx.beginPath(); ctx.ellipse(cx, cy, c.r, c.r * 0.3, angle * 0.5, 0, Math.PI * 2); ctx.strokeStyle = `${c.color}44`; ctx.lineWidth = 1; ctx.stroke(); });
      items.forEach((c, i) => {
        const a = angle + (i * Math.PI * 2) / items.length;
        const x = cx + c.r * Math.cos(a), y = cy + c.r * 0.3 * Math.sin(a);
        const g = ctx.createRadialGradient(x, y, 0, x, y, 18);
        g.addColorStop(0, c.color); g.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = c.color; ctx.fill();
        ctx.fillStyle = 'white'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
        ctx.fillText(c.label, x, y - 15);
      });
      angle += 0.015;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <SectionCard title="🔮 3D Complexity Orbits">
      <canvas ref={canvasRef} width={500} height={300} style={{ width: '100%', height: 'auto', display: 'block' }} />
    </SectionCard>
  );
}

function MasterTheoremVisual() {
  const cases = [
    { case: 'Case 1', condition: 'f(n) < n^(log_b a)', result: 'T(n) = Θ(n^log_b a)', color: '#22c55e', example: 'T(n)=8T(n/2)+n² → O(n³)' },
    { case: 'Case 2', condition: 'f(n) = n^(log_b a)', result: 'T(n) = Θ(n^log_b a · log n)', color: '#f59e0b', example: 'T(n)=2T(n/2)+n → O(n log n)' },
    { case: 'Case 3', condition: 'f(n) > n^(log_b a)', result: 'T(n) = Θ(f(n))', color: '#ef4444', example: 'T(n)=2T(n/2)+n² → O(n²)' },
  ];
  return (
    <SectionCard title="📐 Master Theorem — T(n) = aT(n/b) + f(n)">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 12, padding: '14px 20px', display: 'inline-block' }}>
          <span style={{ color: '#a855f7', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'monospace' }}>T(n) = aT(n/b) + f(n)</span>
        </div>
      </div>
      {cases.map(c => (
        <div key={c.case} style={{ border: `1px solid ${c.color}44`, background: `${c.color}0d`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ color: c.color, fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{c.case}</div>
          <div style={{ color: '#c4b5fd', fontSize: 13, fontFamily: 'monospace', marginBottom: 4 }}>When: {c.condition}</div>
          <div style={{ color: 'white', fontSize: 13, fontWeight: 700, marginBottom: 8, fontFamily: 'monospace' }}>→ {c.result}</div>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '8px 12px' }}>
            <span style={{ color: '#6b7280', fontSize: 10 }}>EXAMPLE: </span>
            <span style={{ color: '#c4b5fd', fontSize: 12, fontFamily: 'monospace' }}>{c.example}</span>
          </div>
        </div>
      ))}
    </SectionCard>
  );
}

function RecursionTreeVisual() {
  const [highlight, setHighlight] = useState(0);
  const levels = [
    { nodes: ['T(n)'], cost: 'n' }, { nodes: ['T(n/2)', 'T(n/2)'], cost: 'n' },
    { nodes: ['T(n/4)', 'T(n/4)', 'T(n/4)', 'T(n/4)'], cost: 'n' },
    { nodes: ['...×8'], cost: 'n' }, { nodes: Array(8).fill('Θ(1)'), cost: 'n' },
  ];
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { setHighlight(i % levels.length); i++; }, 1000);
    return () => clearInterval(t);
  }, [levels.length]);
  return (
    <SectionCard title="🌳 Recursion Tree — T(n)=2T(n/2)+n → O(n log n)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {levels.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
              {row.nodes.map((n, ni) => (
                <div key={ni} style={{ padding: '5px 10px', borderRadius: 8, background: ri === highlight ? 'rgba(168,85,247,0.3)' : 'rgba(139,92,246,0.1)', border: `1px solid ${ri === highlight ? '#a855f7' : 'rgba(139,92,246,0.2)'}`, color: ri === highlight ? 'white' : '#c4b5fd', fontSize: 11, fontFamily: 'monospace', fontWeight: 600, transition: 'all 0.4s' }}>{n}</div>
              ))}
            </div>
            <div style={{ background: ri === highlight ? 'rgba(168,85,247,0.2)' : 'rgba(0,0,0,0.3)', border: `1px solid ${ri === highlight ? '#a855f7' : 'rgba(139,92,246,0.2)'}`, borderRadius: 8, padding: '5px 12px', color: ri === highlight ? '#a855f7' : '#6b7280', fontSize: 12, fontFamily: 'monospace', minWidth: 80, textAlign: 'center', transition: 'all 0.4s' }}>Cost: {row.cost}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 12, color: '#9ca3af', fontSize: 12 }}>
        log n levels × n per level = <span style={{ color: '#22c55e', fontWeight: 700 }}>O(n log n)</span>
      </div>
    </SectionCard>
  );
}

function DesignStrategiesTable() {
  const data = [
    { strategy: 'Divide & Conquer', color: '#a855f7', icon: '⚔️', approach: 'Top-down', problems: 'Binary Search, Quick Sort, Merge Sort, Heap Sort, Strassen', complexity: 'O(n log n)' },
    { strategy: 'Greedy Method', color: '#22c55e', icon: '💰', approach: 'Locally optimal', problems: 'Fractional Knapsack, Kruskal, Prim, Dijkstra', complexity: 'O(n log n)' },
    { strategy: 'Dynamic Programming', color: '#3b82f6', icon: '📊', approach: 'Bottom-up', problems: "Floyd's All Pairs, Chain Matrix, LCS, 0/1 Knapsack, TSP", complexity: 'O(n²)–O(n³)' },
    { strategy: 'Backtracking', color: '#f59e0b', icon: '↩️', approach: 'Depth-first search', problems: 'N-Queens, Sum of Subsets', complexity: 'Exponential' },
    { strategy: 'Branch & Bound', color: '#ef4444', icon: '🌿', approach: 'BFS-like optimal', problems: 'Assignment Problem, TSP', complexity: 'Exponential' },
  ];
  return (
    <SectionCard title="📊 Algorithm Design Strategies">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map(d => (
          <div key={d.strategy} style={{ display: 'flex', gap: 12, background: `${d.color}0a`, border: `1px solid ${d.color}33`, borderRadius: 10, padding: '12px 16px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>{d.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: d.color, fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{d.strategy}</div>
              <div style={{ color: '#c4b5fd', fontSize: 12, marginBottom: 2 }}><span style={{ color: '#6b7280' }}>Approach: </span>{d.approach}</div>
              <div style={{ color: '#c4b5fd', fontSize: 12 }}><span style={{ color: '#6b7280' }}>Problems: </span>{d.problems}</div>
            </div>
            <div style={{ background: `${d.color}22`, border: `1px solid ${d.color}55`, borderRadius: 8, padding: '4px 10px', color: d.color, fontSize: 11, fontWeight: 700, fontFamily: 'monospace', flexShrink: 0 }}>{d.complexity}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function StrassenVisual() {
  const [show, setShow] = useState('normal');
  return (
    <SectionCard title="🧮 Strassen's Matrix Multiplication">
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, justifyContent: 'center' }}>
        {['normal', 'strassen'].map(t => (
          <button key={t} onClick={() => setShow(t)} style={{ padding: '8px 20px', borderRadius: 20, border: `2px solid ${show === t ? '#a855f7' : 'rgba(139,92,246,0.3)'}`, background: show === t ? 'rgba(168,85,247,0.15)' : 'transparent', color: show === t ? '#a855f7' : '#9ca3af', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            {t === 'normal' ? '🔴 Normal O(n³)' : '🟢 Strassen O(n^2.8)'}
          </button>
        ))}
      </div>
      {show === 'normal' ? (
        <div>
          <InfoBox label="Normal: 8 multiplications" text="T(n) = 8T(n/2) + Θ(n²) → O(n³). Uses 8 recursive multiplications." color="#ef4444" />
          <div style={{ textAlign: 'center', marginTop: 12, color: '#ef4444', fontWeight: 700 }}>8 multiplications → T(n) = Θ(n³)</div>
        </div>
      ) : (
        <div>
          <InfoBox label="Strassen: Only 7 multiplications!" text="Reduces to 7 recursive multiplications (P1–P7) saving one recursion level. T(n) = Θ(n^log₂7) ≈ Θ(n^2.81)" color="#22c55e" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
            {[['P₁','A₁₁(B₁₂−B₂₂)'],['P₂','(A₁₁+A₁₂)B₂₂'],['P₃','(A₂₁+A₂₂)B₁₁'],['P₄','A₂₂(B₂₁−B₁₁)'],['P₅','(A₁₁+A₂₂)(B₁₁+B₂₂)'],['P₆','(A₁₂−A₂₂)(B₂₁+B₂₂)'],['P₇','(A₁₁−A₂₁)(B₁₁+B₁₂)']].map(([p, f]) => (
              <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 30, color: '#a855f7', fontWeight: 800, fontFamily: 'monospace', fontSize: 13 }}>{p}</div>
                <div style={{ flex: 1, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 6, padding: '6px 12px', color: '#c4b5fd', fontFamily: 'monospace', fontSize: 12 }}>{f}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 12, color: '#22c55e', fontWeight: 700 }}>7 multiplications → T(n) = Θ(n^2.81)</div>
        </div>
      )}
    </SectionCard>
  );
}

function NotationCards() {
  const notations = [
    { symbol: 'O', name: 'Big-O (Upper Bound)', color: '#ef4444', badge: 'WORST CASE', formal: 'T(n) = O(f(n)) if ∃ c > 0, n₀ ≥ 1 : T(n) ≤ c·f(n) ∀ n ≥ n₀', desc: 'Big-O gives the UPPER BOUND — the maximum time an algorithm can take.', example: 'Linear Search → O(n): worst case checks all n elements', intuition: 'Algorithm will NEVER be slower than this.' },
    { symbol: 'Ω', name: 'Big-Omega (Lower Bound)', color: '#22c55e', badge: 'BEST CASE', formal: 'T(n) = Ω(f(n)) if ∃ c > 0, n₀ ≥ 1 : T(n) ≥ c·f(n) ∀ n ≥ n₀', desc: 'Big-Omega gives the LOWER BOUND — the minimum time an algorithm must take.', example: 'Linear Search → Ω(1): best case finds at index 0', intuition: 'Algorithm will ALWAYS take AT LEAST this long.' },
    { symbol: 'Θ', name: 'Big-Theta (Tight Bound)', color: '#f59e0b', badge: 'TIGHT BOUND', formal: 'T(n) = Θ(f(n)) if T(n) = O(f(n)) AND T(n) = Ω(f(n))', desc: 'Big-Theta gives the TIGHT BOUND — when upper and lower bounds match exactly.', example: 'Merge Sort → Θ(n log n): always in all cases', intuition: 'Algorithm ALWAYS runs in exactly this time class.' },
  ];
  return (
    <>
      {notations.map(n => (
        <div key={n.symbol} style={{ background: `${n.color}0d`, border: `1px solid ${n.color}44`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: `${n.color}22`, border: `2px solid ${n.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: n.color, fontFamily: 'serif' }}>{n.symbol}</div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>{n.name}</div>
              <div style={{ display: 'inline-block', marginTop: 4, padding: '3px 10px', borderRadius: 20, background: `${n.color}22`, border: `1px solid ${n.color}66`, color: n.color, fontSize: 11, fontWeight: 700 }}>{n.badge}</div>
            </div>
          </div>
          <p style={{ color: '#c4b5fd', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>{n.desc}</p>
          <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: '10px 14px', marginBottom: 10, fontFamily: 'monospace', fontSize: 12, color: n.color, border: `1px solid ${n.color}33` }}>{n.formal}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '8px 12px', minWidth: 160 }}>
              <div style={{ color: '#6b7280', fontSize: 10, marginBottom: 3 }}>EXAMPLE</div>
              <div style={{ color: '#e2e8f0', fontSize: 12 }}>{n.example}</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '8px 12px', minWidth: 160 }}>
              <div style={{ color: '#6b7280', fontSize: 10, marginBottom: 3 }}>INTUITION</div>
              <div style={{ color: '#e2e8f0', fontSize: 12 }}>{n.intuition}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

const topics = [
  {
    id: 'intro', icon: '📘', title: 'Introduction to Algorithms', color: '#7c3aed',
    tags: ['Definition', 'Properties', 'Design Goals', 'Techniques'],
    render: () => (
      <div>
        <SectionCard title="📖 What is an Algorithm?" color="#7c3aed">
          <p style={{ color: '#c4b5fd', fontSize: 13, lineHeight: 1.9, marginBottom: 16 }}>
            An <strong style={{ color: '#a855f7' }}>Algorithm</strong> is a finite sequence of instructions, each with clear meaning, performable in finite time. It must satisfy: Input, Output, Definiteness, Finiteness, and Effectiveness.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            {[['📥 Input','Zero or more quantities externally supplied','#7c3aed'],['📤 Output','At least one quantity is produced','#22c55e'],['🔷 Definiteness','Each instruction must be clear and unambiguous','#3b82f6'],['⏱️ Finiteness','Terminates after finite steps for ALL cases','#f59e0b'],['✅ Effectiveness','Every step doable by pencil and paper','#a855f7']].map(([t, d, c]) => (
              <div key={t} style={{ background: `${c}11`, border: `1px solid ${c}44`, borderRadius: 10, padding: 12 }}>
                <div style={{ color: c, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t}</div>
                <div style={{ color: '#9ca3af', fontSize: 12, lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="🎯 Steps for Designing an Algorithm" color="#6d28d9">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['1','Understand the Problem','Carefully read and grasp what is being asked.','#7c3aed'],['2','Decision Making','Choose capabilities, methods, data structures, strategies.','#a855f7'],['3','Specification','Write the algorithm in pseudocode.','#6d28d9'],['4','Verification','Manually trace through with test cases.','#8b5cf6'],['5','Analysis','Determine time and space complexity.','#c084fc'],['6','Implementation','Code the algorithm.','#22c55e']].map(([num, title, desc, color]) => (
              <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: `${color}0a`, border: `1px solid ${color}33`, borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{num}</div>
                <div><div style={{ color, fontWeight: 700, fontSize: 13 }}>{title}</div><div style={{ color: '#9ca3af', fontSize: 12, marginTop: 3 }}>{desc}</div></div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="🏆 Algorithm Design Goals" color="#22c55e">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[['⏱️','Save Time','Faster program = better program.','#22c55e'],['💾','Save Space','Minimize memory for constrained systems.','#3b82f6'],['😊','Save Face','Prevent bugs and crashes.','#f59e0b']].map(([icon, t, d, c]) => (
              <div key={t} style={{ background: `${c}11`, border: `1px solid ${c}44`, borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ color: c, fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{t}</div>
                <div style={{ color: '#9ca3af', fontSize: 12, lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <DesignStrategiesTable />
        <SectionCard title="📊 Classification by Running Time" color="#3b82f6">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['O(1)','Constant','#22c55e','Array index access, hash lookup.'],['O(log n)','Logarithmic','#a855f7','Binary search. n=million → only ~20 steps.'],['O(n)','Linear','#3b82f6','One pass. Linear search, traversal.'],['O(n log n)','Linearithmic','#f59e0b','Merge sort, heap sort.'],['O(n²)','Quadratic','#f97316','Double nested loop. Bubble sort.'],['O(n³)','Cubic','#ef4444','Triple nested loop. Matrix multiply.'],['O(2ⁿ)','Exponential','#dc2626','Brute-force. N-Queens, TSP.']].map(([big, name, col, desc]) => (
              <div key={big} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: `${col}0a`, border: `1px solid ${col}33`, borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ color: col, fontWeight: 800, fontFamily: 'monospace', fontSize: 13, width: 90, flexShrink: 0 }}>{big}</div>
                <div style={{ color: col, fontWeight: 600, fontSize: 12, width: 100, flexShrink: 0 }}>{name}</div>
                <div style={{ color: '#9ca3af', fontSize: 12 }}>{desc}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <ComplexityChart />
      </div>
    ),
  },
  {
    id: 'asymptotic', icon: '📊', title: 'Asymptotic Notations', color: '#a855f7',
    tags: ['Big-O', 'Big-Ω', 'Big-Θ', 'Rate of Growth'],
    render: () => (
      <div>
        <SectionCard title="📐 What is Asymptotic Analysis?" color="#a855f7">
          <p style={{ color: '#c4b5fd', fontSize: 13, lineHeight: 1.9, marginBottom: 12 }}>
            The <strong style={{ color: '#a855f7' }}>asymptotic complexity</strong> describes how resource requirements grow as input increases. It ultimately determines the size of problems an algorithm can solve.
          </p>
          <InfoBox label="Three cases of f(n)" text="• Best Case: minimum value of f(n)   • Average Case: expected value   • Worst Case: maximum value for any input" color="#a855f7" />
        </SectionCard>
        <NotationCards />
        <AsymptoticGraph />
        <NotationBarChart />
        <ComplexitySphere />
        <ComplexityChart />
        <SectionCard title="📋 Numerical Comparison" color="#3b82f6">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead><tr>{['n','log n','n·log n','n²','n³','2ⁿ'].map(h => <th key={h} style={{ padding: '8px 12px', background: 'rgba(59,130,246,0.2)', color: '#93c5fd', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid rgba(59,130,246,0.3)', fontFamily: 'monospace' }}>{h}</th>)}</tr></thead>
              <tbody>
                {[[1,'0','0',1,1,2],[2,1,2,4,8,4],[4,2,8,16,64,16],[8,3,24,64,512,256],[16,4,64,256,4096,'65,536'],[32,5,160,1024,'32,768','4.2B'],[64,6,384,4096,'262,144','Note 1'],[128,7,896,'16,384','2,097,152','Note 2']].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(59,130,246,0.04)' : 'transparent' }}>
                    {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: j===0?'white':j<3?'#86efac':j===3?'#3b82f6':j===4?'#f59e0b':'#ef4444', textAlign: 'center', borderBottom: '1px solid rgba(59,130,246,0.1)', fontFamily: 'monospace', fontWeight: j===0?700:400 }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    ),
  },
  {
    id: 'complexity', icon: '⏱️', title: 'Time & Space Complexity', color: '#c084fc',
    tags: ['Time', 'Space', 'Best/Worst/Avg'],
    render: () => (
      <div>
        <SectionCard title="⏱️ Time Complexity" color="#c084fc">
          <p style={{ color: '#c4b5fd', fontSize: 13, lineHeight: 1.9 }}>The <strong style={{ color: '#c084fc' }}>time complexity</strong> is the amount of computer time needed to run to completion, as a function of input size n.</p>
        </SectionCard>
        <SectionCard title="💾 Space Complexity — 3 Components" color="#3b82f6">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['📦','Instruction Space','Space to store compiled program instructions. Depends on compiler and target machine.','#7c3aed'],['🗃️','Data Space','Space for constants, variables, and dynamically allocated objects like arrays.','#3b82f6'],['📚','Environment Stack Space','Recursion stack — saves info to resume partially completed function calls.','#22c55e']].map(([icon, t, d, c]) => (
              <div key={t} style={{ display: 'flex', gap: 12, background: `${c}0a`, border: `1px solid ${c}33`, borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{icon}</div>
                <div><div style={{ color: c, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t}</div><div style={{ color: '#9ca3af', fontSize: 12, lineHeight: 1.6 }}>{d}</div></div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SpaceComplexityVisual />
        <BestWorstAvgTable />
        <ComplexityChart />
      </div>
    ),
  },
  {
    id: 'recurrence', icon: '🌳', title: 'Recurrence Relations', color: '#8b5cf6',
    tags: ['Master Theorem', 'Recursion Tree', 'Substitution'],
    render: () => (
      <div>
        <SectionCard title="🔄 Recurrence Relations" color="#8b5cf6">
          <p style={{ color: '#c4b5fd', fontSize: 13, lineHeight: 1.9 }}>A <strong style={{ color: '#8b5cf6' }}>recurrence relation</strong> expresses time complexity of a recursive algorithm in terms of itself on smaller inputs. Three solving methods:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginTop: 12 }}>
            {[['Substitution','Guess + prove by induction','#8b5cf6'],['Recursion Tree','Draw call tree, sum all costs','#f59e0b'],['Master Theorem','Direct formula for T(n)=aT(n/b)+f(n)','#22c55e']].map(([t, d, c]) => (
              <div key={t} style={{ background: `${c}11`, border: `1px solid ${c}44`, borderRadius: 10, padding: 12 }}>
                <div style={{ color: c, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t}</div>
                <div style={{ color: '#9ca3af', fontSize: 12 }}>{d}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <MasterTheoremVisual />
        <RecursionTreeVisual />
        <ComplexityChart />
      </div>
    ),
  },
  {
    id: 'dac', icon: '⚡', title: 'Divide and Conquer', color: '#6d28d9',
    tags: ['Binary Search', 'Merge Sort', 'Quick Sort', 'Strassen'],
    render: () => (
      <div>
        <SectionCard title="⚡ Divide and Conquer Paradigm" color="#6d28d9">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
            {[['⚔️','DIVIDE','Break into sub-problems','#ef4444'],['🧩','CONQUER','Solve recursively','#f59e0b'],['🔗','COMBINE','Merge sub-solutions','#22c55e']].map(([icon, t, d, c]) => (
              <div key={t} style={{ flex: 1, minWidth: 130, background: `${c}11`, border: `1px solid ${c}44`, borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                <div style={{ color: c, fontWeight: 800, fontSize: 13, marginBottom: 6 }}>{t}</div>
                <div style={{ color: '#9ca3af', fontSize: 12 }}>{d}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="🔍 Binary Search — O(log n)" color="#3b82f6">
          <InfoBox label="Core Idea" text="Sorted array required. mid=(beg+end)/2. Compare key with arr[mid], discard half each step." color="#3b82f6" />
          <CodeBlock code={`BinarySearch(arr, beg, end, key):
  while beg <= end:
    mid = (beg + end) / 2
    if arr[mid] == key: return mid
    else if key < arr[mid]: end = mid - 1
    else: beg = mid + 1
  return -1   // Time: O(log₂ n)`} />
        </SectionCard>
        <BinarySearchFlow />
        <SectionCard title="🔀 Merge Sort — Θ(n log n)" color="#a855f7">
          <InfoBox label="Core Idea" text="T(n)=2T(n/2)+Θ(n) → Θ(n log n) in ALL cases. Stable. Needs O(n) extra space." color="#a855f7" />
          <CodeBlock code={`MergeSort(A, p, r):
  if p < r:
    q = (p + r) / 2
    MergeSort(A, p, q)
    MergeSort(A, q+1, r)
    Merge(A, p, q, r)`} />
        </SectionCard>
        <MergeSortDiagram />
        <SectionCard title="⚡ Quick Sort" color="#f59e0b">
          <InfoBox label="Best/Avg" text="Θ(n log n) — pivot splits evenly" color="#22c55e" />
          <InfoBox label="Worst Case" text="O(n²) — already sorted array, last element pivot. T(n)=T(n-1)+Θ(n)" color="#ef4444" />
          <CodeBlock code={`QuickSort(arr, low, high):
  if low < high:
    pi = Partition(arr, low, high)
    QuickSort(arr, low, pi-1)
    QuickSort(arr, pi+1, high)`} />
        </SectionCard>
        <QuickSortDiagram />
        <BubbleSortDiagram />
        <StrassenVisual />
        <BestWorstAvgTable />
      </div>
    ),
  },
  {
    id: 'heap', icon: '🌲', title: 'Heap & Heap Sort', color: '#22c55e',
    tags: ['Max Heap', 'Min Heap', 'Heapify', 'O(n log n)'],
    render: () => (
      <div>
        <SectionCard title="🌲 Heap — Complete Binary Tree" color="#22c55e">
          <p style={{ color: '#c4b5fd', fontSize: 13, lineHeight: 1.9, marginBottom: 14 }}>
            A <strong style={{ color: '#22c55e' }}>Heap</strong> is a complete binary tree stored as array. Max Heap: parent ≥ children. Min Heap: parent ≤ children.
          </p>
          <SectionCard title="Array Index Formulas" color="#7c3aed">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[['PARENT(i)','floor(i/2)','#a855f7'],['LEFT(i)','2i','#3b82f6'],['RIGHT(i)','2i+1','#22c55e']].map(([fn, val, col]) => (
                <div key={fn} style={{ background: `${col}11`, border: `1px solid ${col}44`, borderRadius: 8, padding: '12px 20px', textAlign: 'center', minWidth: 120 }}>
                  <div style={{ color: col, fontFamily: 'monospace', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{fn}</div>
                  <div style={{ color: 'white', fontFamily: 'monospace', fontSize: 15, fontWeight: 800 }}>→ {val}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </SectionCard>
        <HeapDiagram />
        <SectionCard title="🔧 Three Heap Procedures" color="#f59e0b">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['#f59e0b','1. Heapify(A,i) — O(log n)','Compares parent with largest child. Swaps if needed. Recurses down.',`Heapify(A, i):\n  l=LEFT(i), r=RIGHT(i)\n  largest = (A[l]>A[i]) ? l : i\n  if A[r]>A[largest]: largest=r\n  if largest!=i: swap, Heapify(A,largest)`],
              ['#22c55e','2. BuildHeap(A) — O(n)','Bottom-up from floor(n/2) down to 1. Converts any array to heap.',`BuildHeap(A):\n  heapsize = length(A)\n  for i = floor(n/2) downto 1:\n    Heapify(A, i)`],
              ['#3b82f6','3. HeapSort(A) — O(n log n)','Build max heap, extract max repeatedly. In-place, no extra space.',`HeapSort(A):\n  BuildHeap(A)\n  for i = n downto 2:\n    swap A[1] and A[i]\n    heapsize--\n    Heapify(A, 1)`],
            ].map(([c, title, desc, code]) => (
              <div key={title} style={{ background: `${c}08`, border: `1px solid ${c}33`, borderRadius: 10, padding: 14 }}>
                <div style={{ color: c, fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{title}</div>
                <p style={{ color: '#9ca3af', fontSize: 12, lineHeight: 1.7, marginBottom: 8 }}>{desc}</p>
                <CodeBlock code={code} />
              </div>
            ))}
          </div>
        </SectionCard>
        <HeapSortSteps />
        <SectionCard title="📊 Heap Sort Complexity Summary" color="#a855f7">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[['Heapify','O(log n)','#f59e0b'],['Build Heap','O(n)','#22c55e'],['Heap Sort','O(n log n)','#a855f7'],['Space','O(1)','#3b82f6']].map(([op, comp, col]) => (
              <div key={op} style={{ flex: 1, minWidth: 120, background: `${col}11`, border: `1px solid ${col}44`, borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ color: '#9ca3af', fontSize: 11, marginBottom: 4 }}>{op}</div>
                <div style={{ color: col, fontWeight: 800, fontSize: 14, fontFamily: 'monospace' }}>{comp}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    ),
  },
];

export default function Notes() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  return (
    <div style={{ backgroundColor: '#0a0010', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ textAlign: 'center', padding: '60px 20px 40px', background: 'linear-gradient(180deg, rgba(124,58,237,0.15) 0%, transparent 100%)', borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', color: '#c4b5fd', padding: '6px 16px', borderRadius: 20, fontSize: 13, marginBottom: 16 }}>📖 Study Notes</div>
        <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 800, marginBottom: 10 }}>ADA <span style={{ color: '#a855f7', textShadow: '0 0 30px rgba(168,85,247,0.5)' }}>Notes</span></h1>
        <p style={{ color: '#9ca3af', fontSize: '1rem' }}>Complete Unit 1 — RGPV CS-402 · Analysis and Design of Algorithm</p>
        <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['B.Tech 4th Sem', 'CS-402', '6 Topics', 'RGPV Syllabus'].map(t => (
            <span key={t} style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 40px', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a855f7', flexShrink: 0 }} />
        <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem', flex: 1 }}>Unit 1 — Introduction · Asymptotic Analysis · Divide and Conquer · Heap Sort</span>
        <span style={{ color: '#7c3aed', fontSize: 13, background: 'rgba(124,58,237,0.15)', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(124,58,237,0.3)' }}>{topics.length} topics</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: '28px 40px' }}>
        {topics.map(topic => (
          <div key={topic.id} onClick={() => setSelectedTopic(selectedTopic?.id === topic.id ? null : topic)}
            style={{ background: 'rgba(139,92,246,0.06)', border: `1px solid ${selectedTopic?.id === topic.id ? topic.color : 'rgba(139,92,246,0.2)'}`, borderRadius: 20, padding: 22, width: 190, cursor: 'pointer', transition: 'all 0.3s', boxShadow: selectedTopic?.id === topic.id ? `0 0 30px ${topic.color}44` : 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ width: 50, height: 50, borderRadius: 13, background: `${topic.color}22`, border: `1px solid ${topic.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{topic.icon}</div>
            <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{topic.title}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {topic.tags.map(tag => <span key={tag} style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#c4b5fd', padding: '2px 7px', borderRadius: 10, fontSize: 10 }}>{tag}</span>)}
            </div>
            <div style={{ color: topic.color, fontSize: 11, fontWeight: 600, marginTop: 'auto' }}>
              {selectedTopic?.id === topic.id ? '▲ Close' : '▼ Open'}
            </div>
          </div>
        ))}
      </div>
      {selectedTopic && (
        <div style={{ margin: '0 40px 40px', background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
            <span style={{ fontSize: '1.6rem' }}>{selectedTopic.icon}</span>
            <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{selectedTopic.title}</h2>
            <span style={{ marginLeft: 'auto', color: selectedTopic.color, fontSize: 12, background: `${selectedTopic.color}22`, padding: '4px 12px', borderRadius: 20, border: `1px solid ${selectedTopic.color}44` }}>CS-402 Unit 1</span>
          </div>
          {selectedTopic.render()}
        </div>
      )}
    </div>
  );
}

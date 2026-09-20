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

function SectionCard({ title, children, color = '#5E7B59' }) {
  return (
    <div style={{ background: 'rgba(94,123,89,0.06)', border: `1px solid ${color}33`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
      <div style={{ color, fontWeight: 800, fontSize: 15, marginBottom: 16, letterSpacing: 0.5 }}>{title}</div>
      {children}
    </div>
  );
}
function InfoBox({ label, text, color = '#5E7B59' }) {
  return (
    <div style={{ background: `${color}11`, border: `1px solid ${color}44`, borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
      <div style={{ color, fontWeight: 700, fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
<div style={{ color: '#173A29', fontSize: 13, lineHeight: 1.7 }}>
  {text}
</div>    </div>
  );
}
function CodeBlock({ code }) {
  return (
    <pre style={{ background: 'rgba(23,58,41,0.50)', border: '1px solid rgba(23,58,41,0.20)', borderRadius: 10, padding: '14px 18px', color: '#D7D2BD', fontSize: 12, fontFamily: 'monospace', overflowX: 'auto', lineHeight: 1.8, margin: '12px 0' }}>
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
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,123,89,0.15)" />
          <XAxis dataKey="n" stroke="#6B8066" label={{ value: 'Input Size (n)', position: 'insideBottom', offset: -15, fill: '#6B8066', fontSize: 12 }} />
          <YAxis stroke="#6B8066" width={55} />
          <Tooltip contentStyle={{ background: '#173A29', border: '1px solid #3A6B4A', borderRadius: 10, color: 'white' }} />
          <Legend wrapperStyle={{ color: '#173A29', paddingTop: 16 }} />
          <Line type="monotone" dataKey="O(1)" stroke="#6B8E63" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="O(log n)" stroke="#5E7B59" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="O(n)" stroke="#52745A" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="O(n log n)" stroke="#A3B18A" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="O(n²)" stroke="#4A6B54" strokeWidth={2} dot={false} />
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
              <stop offset="5%" stopColor="#4A6B54" stopOpacity={0.3} /><stop offset="95%" stopColor="#4A6B54" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lowerG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6B8E63" stopOpacity={0.3} /><stop offset="95%" stopColor="#6B8E63" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,123,89,0.15)" />
          <XAxis dataKey="n" stroke="#6B8066" label={{ value: 'n (after n₀)', position: 'insideBottom', offset: -15, fill: '#6B8066', fontSize: 12 }} />
          <YAxis stroke="#6B8066" width={40} />
          <Tooltip contentStyle={{ background: '#173A29', border: '1px solid #3A6B4A', borderRadius: 10, color: 'white' }} />
          <Legend wrapperStyle={{ color: '#173A29', paddingTop: 16 }} />
          <Area type="monotone" dataKey="c₂·f(n)" stroke="#4A6B54" fill="url(#upperG)" strokeWidth={2} strokeDasharray="6 3" dot={false} name="c₂·f(n) — Big-O upper" />
          <Area type="monotone" dataKey="T(n)" stroke="#A3B18A" fill="none" strokeWidth={3} dot={false} name="T(n) — Actual runtime" />
          <Area type="monotone" dataKey="c₁·f(n)" stroke="#6B8E63" fill="url(#lowerG)" strokeWidth={2} strokeDasharray="6 3" dot={false} name="c₁·f(n) — Big-Ω lower" />
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
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,123,89,0.15)" />
          <XAxis dataKey="algo" stroke="#6B8066" tick={{ fill: '#6B8066', fontSize: 10 }} angle={-15} textAnchor="end" />
          <YAxis stroke="#6B8066" width={35} />
          <Tooltip contentStyle={{ background: '#173A29', border: '1px solid #3A6B4A', borderRadius: 10, color: 'white' }} />
          <Legend wrapperStyle={{ color: '#173A29', paddingTop: 24 }} />
          <Bar dataKey="O" name="Big-O Worst" fill="#4A6B54" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Θ" name="Big-Θ Average" fill="#A3B18A" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Ω" name="Big-Ω Best" fill="#6B8E63" radius={[4, 4, 0, 0]} />
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
    if (v.includes('n²') || v.includes('2.8')) return '#4A6B54';
    if (v.includes('n log')) return '#A3B18A';
    if (v === 'O(n)') return '#52745A';
    if (v.includes('log')) return '#5E7B59';
    if (v === 'O(1)') return '#6B8E63';
    return '#A3B18A';
  };
  return (
    <SectionCard title="📋 Complete Complexity Reference — All Algorithms">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>{['Algorithm', 'Best', 'Average', 'Worst', 'Space', 'Stable'].map(h => (
              <th key={h} style={{ padding: '10px 14px', background: 'rgba(94,123,89,0.20)', color: '#173A29', fontWeight: 700, textAlign: 'left', borderBottom: '1px solid rgba(94,123,89,0.30)' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.algo} style={{ background: i % 2 === 0 ? 'rgba(94,123,89,0.04)' : 'transparent' }}>
<td style={{ padding: '10px 14px', color: '#173A29', fontWeight: 600, borderBottom: '1px solid rgba(23,58,41,0.14)' }}>{r.algo}</td>
                {[r.best, r.avg, r.worst, r.space].map((v, j) => (
                  <td key={j} style={{ padding: '10px 14px', color: col(v), fontFamily: 'monospace', fontWeight: 700, borderBottom: '1px solid rgba(23,58,41,0.14)' }}>{v}</td>
                ))}
                <td style={{ padding: '10px 14px', color: '#173A29', borderBottom: '1px solid rgba(23,58,41,0.14)', textAlign: 'center' }}>{r.stable}</td>
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
    { algo: 'Bubble/Selection/Insertion', space: 'O(1)', level: 1, color: '#6B8E63', note: 'In-place, no extra memory' },
    { algo: 'Binary Search (iterative)', space: 'O(1)', level: 1, color: '#6B8E63', note: 'Only a few variables' },
    { algo: 'Quick Sort', space: 'O(log n)', level: 2, color: '#173A29', note: 'Recursion stack depth' },
    { algo: 'Heap Sort', space: 'O(1)', level: 1, color: '#6B8E63', note: 'In-place using heap' },
    { algo: 'Merge Sort', space: 'O(n)', level: 4, color: '#52745A', note: 'Needs auxiliary arrays' },
    { algo: 'Strassen', space: 'O(n²)', level: 5, color: '#4A6B54', note: 'Sub-matrix storage' },
  ];
  return (
    <SectionCard title="💾 Space Complexity — Memory Usage by Algorithm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map(item => (
          <div key={item.algo} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 170, color: '#173A29', fontSize: 11, textAlign: 'right', flexShrink: 0 }}>{item.algo}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} style={{ width: 26, height: 26, borderRadius: 6, background: j < item.level ? item.color : 'rgba(94,123,89,0.10)', border: `1px solid ${j < item.level ? item.color : 'rgba(94,123,89,0.20)'}`, boxShadow: j < item.level ? `0 0 8px ${item.color}66` : 'none' }} />
              ))}
            </div>
            <div style={{ color: item.color, fontWeight: 700, fontSize: 12, fontFamily: 'monospace', width: 75 }}>{item.space}</div>
            <div style={{ color: '#5D685F', fontSize: 11 }}>{item.note}</div>
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
          <div key={idx} style={{ width: 48, height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: '#173A29', background: s.sorted?.includes(idx) ? '#6B8E63' : s.comparing?.includes(idx) ? '#A3B18A' : 'rgba(94,123,89,0.30)', border: `2px solid ${s.sorted?.includes(idx) ? '#6B8E63' : s.comparing?.includes(idx) ? '#A3B18A' : 'rgba(94,123,89,0.30)'}`, transition: 'all 0.3s' }}>{val}</div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: '#173A29', fontSize: 13, background: 'rgba(23,58,41,0.30)', borderRadius: 8, padding: 10 }}>{s.label}</div>
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
                <div key={ai} style={{ display: 'flex', gap: 3, background: ri === active ? 'rgba(58,107,74,0.20)' : 'rgba(94,123,89,0.06)', border: `1px solid ${ri === active ? '#5E7B59' : 'rgba(94,123,89,0.20)'}`, borderRadius: 8, padding: '6px 10px', boxShadow: ri === active ? '0 0 15px rgba(58,107,74,0.40)' : 'none', transition: 'all 0.4s' }}>
                  {arr.map((n, ni) => (
                    <div key={ni} style={{ width: 28, height: 28, background: ri === active ? 'rgba(58,107,74,0.40)' : 'rgba(94,123,89,0.15)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#173A29', fontSize: 11, fontWeight: 700 }}>{n}</div>
                  ))}
                </div>
              ))}
            </div>
            {ri < nodes.length - 1 && <div style={{ textAlign: 'center', color: '#173A29', fontSize: 18, marginTop: 4 }}>↓</div>}
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: '#173A29', fontSize: 13, fontWeight: 700, marginTop: 12, background: 'rgba(23,58,41,0.30)', padding: 8, borderRadius: 8 }}>
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
            <div style={{ width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#173A29', background: idx === p.pivot ? '#6B8E63' : idx === p.i ? '#A3B18A' : idx === p.j ? '#52745A' : phase === phases.length - 1 ? '#6B8E63' : 'rgba(94,123,89,0.30)', border: `2px solid ${idx === p.pivot ? '#6B8E63' : idx === p.i ? '#A3B18A' : idx === p.j ? '#52745A' : 'rgba(94,123,89,0.30)'}`, transition: 'all 0.4s' }}>{val}</div>
            <div style={{ fontSize: 9, color: idx === p.pivot ? '#6B8E63' : idx === p.i ? '#A3B18A' : idx === p.j ? '#52745A' : 'transparent', fontWeight: 700 }}>
              {idx === p.pivot ? 'pivot' : idx === p.i ? 'i' : idx === p.j ? 'j' : '.'}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', color: '#173A29', fontSize: 13, background: 'rgba(23,58,41,0.30)', borderRadius: 8, padding: 10 }}>{p.label}</div>
    </SectionCard>
  );
}

function BinarySearchFlow() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: 'Start', color: '#6B8E63', shape: 'oval' },
    { label: 'Set\nbeg=LB, end=UB', color: '#173A29', shape: 'rect' },
    { label: 'beg ≤ end?', color: '#A3B18A', shape: 'diamond' },
    { label: 'mid=(beg+end)/2', color: '#173A29', shape: 'rect' },
    { label: 'arr[mid]==key?', color: '#A3B18A', shape: 'diamond' },
    { label: 'Return mid ✅', color: '#6B8E63', shape: 'oval' },
    { label: 'key<arr[mid]?', color: '#A3B18A', shape: 'diamond' },
    { label: 'end=mid-1', color: '#52745A', shape: 'rect' },
    { label: 'beg=mid+1', color: '#52745A', shape: 'rect' },
    { label: 'Return -1 ❌', color: '#4A6B54', shape: 'oval' },
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
            <div style={{ padding: s.shape === 'diamond' ? 0 : '8px 16px', minWidth: s.shape === 'diamond' ? 60 : 150, minHeight: s.shape === 'diamond' ? 60 : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === step ? s.color : 'rgba(94,123,89,0.10)', border: `2px solid ${s.color}`, borderRadius: s.shape === 'oval' ? 50 : s.shape === 'diamond' ? 4 : 8, transform: s.shape === 'diamond' ? 'rotate(45deg)' : 'none', boxShadow: i === step ? `0 0 20px ${s.color}` : 'none', transition: 'all 0.4s' }}>
              <div style={{ transform: s.shape === 'diamond' ? 'rotate(-45deg)' : 'none', color: i === step ? '#173A29' : '#A3B18A', fontSize: 11, fontWeight: 600, textAlign: 'center', whiteSpace: 'pre-line' }}>{s.label}</div>
            </div>
            {i < steps.length - 1 && <div style={{ width: 2, height: 18, background: i < step ? '#5E7B59' : 'rgba(94,123,89,0.30)', transition: 'all 0.4s' }} />}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function HeapDiagram() {
  const [heapType, setHeapType] = useState('max');
  const maxHeap = { nodes: [19, 12, 16, 1, 4, 7], type: 'Max Heap', color: '#4A6B54', property: 'A[Parent(i)] ≥ A[i]' };
  const minHeap = { nodes: [1, 4, 16, 7, 12, 19], type: 'Min Heap', color: '#6B8E63', property: 'A[Parent(i)] ≤ A[i]' };
  const h = heapType === 'max' ? maxHeap : minHeap;
  const positions = [{ x: 200, y: 30 }, { x: 110, y: 100 }, { x: 290, y: 100 }, { x: 60, y: 170 }, { x: 160, y: 170 }, { x: 240, y: 170 }];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  return (
    <SectionCard title="🌲 Heap Data Structure — Max & Min Heap">
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, justifyContent: 'center' }}>
        {['max', 'min'].map(t => (
          <button key={t} onClick={() => setHeapType(t)} style={{ padding: '8px 20px', borderRadius: 20, border: `2px solid ${heapType === t ? (t === 'max' ? '#4A6B54' : '#6B8E63') : 'rgba(94,123,89,0.30)'}`, background: heapType === t ? (t === 'max' ? 'rgba(74,107,84,0.15)' : 'rgba(107,134,99,0.15)') : 'transparent', color: heapType === t ? (t === 'max' ? '#4A6B54' : '#6B8E63') : '#6B8066', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
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
              <text x={pos.x} y={pos.y + 26} textAnchor="middle" fill="#173A29" fontSize="14" fontWeight="bold">{h.nodes[i]}</text>
            </g>
          ))}
        </svg>
      </div>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <div style={{ color: h.color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{h.type}</div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {h.nodes.map((n, i) => <div key={i} style={{ width: 34, height: 34, borderRadius: 6, background: `${h.color}22`, border: `1px solid ${h.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#173A29', fontSize: 12, fontWeight: 700 }}>{n}</div>)}
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
          <div key={i} style={{ width: 42, height: 42, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: 'white', background: s.sorted?.includes(v) ? '#6B8E63' : s.active === 'build' ? '#3A6B4A' : '#A3B18A', border: `2px solid ${s.sorted?.includes(v) ? '#6B8E63' : s.active === 'build' ? '#3A6B4A' : '#A3B18A'}`, transition: 'all 0.4s' }}>{v}</div>
        ))}
      </div>
      <div style={{ background: 'rgba(23,58,41,0.30)', borderRadius: 8, padding: '10px 14px', color: '#173A29', fontSize: 13 }}>{s.label}</div>
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
      { label: 'O(1)', color: '#6B8E63', r: 20 }, { label: 'O(log n)', color: '#173A29', r: 45 },
      { label: 'O(n)', color: '#52745A', r: 70 }, { label: 'O(n log n)', color: '#A3B18A', r: 100 },
      { label: 'O(n²)', color: '#4A6B54', r: 135 },
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
    { case: 'Case 1', condition: 'f(n) < n^(log_b a)', result: 'T(n) = Θ(n^log_b a)', color: '#6B8E63', example: 'T(n)=8T(n/2)+n² → O(n³)' },
    { case: 'Case 2', condition: 'f(n) = n^(log_b a)', result: 'T(n) = Θ(n^log_b a · log n)', color: '#A3B18A', example: 'T(n)=2T(n/2)+n → O(n log n)' },
    { case: 'Case 3', condition: 'f(n) > n^(log_b a)', result: 'T(n) = Θ(f(n))', color: '#4A6B54', example: 'T(n)=2T(n/2)+n² → O(n²)' },
  ];
  return (
    <SectionCard title="📐 Master Theorem — T(n) = aT(n/b) + f(n)">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ background: 'rgba(23,58,41,0.08)', border: '1px solid rgba(94,123,89,0.40)', borderRadius: 12, padding: '14px 20px', display: 'inline-block' }}>
          <span style={{ color: '#173A29', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'monospace' }}>T(n) = aT(n/b) + f(n)</span>
        </div>
      </div>
      {cases.map(c => (
        <div key={c.case} style={{ border: `1px solid ${c.color}44`, background: `${c.color}0d`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ color: c.color, fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{c.case}</div>
          <div style={{ color: '#173A29', fontSize: 13, fontFamily: 'monospace', marginBottom: 4 }}>When: {c.condition}</div>
          <div style={{ color: '#173A29', fontSize: 13, fontWeight: 700, marginBottom: 8, fontFamily: 'monospace' }}>→ {c.result}</div>
          <div style={{ background: 'rgba(23,58,41,0.30)', borderRadius: 8, padding: '8px 12px' }}>
            <span style={{ color: '#5D685F', fontSize: 10 }}>EXAMPLE: </span>
            <span style={{ color: '#173A29', fontSize: 12, fontFamily: 'monospace' }}>{c.example}</span>
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
                <div key={ni} style={{ padding: '5px 10px', borderRadius: 8, background: ri === highlight ? 'rgba(58,107,74,0.30)' : 'rgba(94,123,89,0.10)', border: `1px solid ${ri === highlight ? '#5E7B59' : 'rgba(94,123,89,0.20)'}`, color: ri === highlight ? 'white' : '#A3B18A', fontSize: 11, fontFamily: 'monospace', fontWeight: 600, transition: 'all 0.4s' }}>{n}</div>
              ))}
            </div>
            <div style={{ background: ri === highlight ? 'rgba(58,107,74,0.20)' : 'rgba(23,58,41,0.30)', border: `1px solid ${ri === highlight ? '#5E7B59' : 'rgba(94,123,89,0.20)'}`, borderRadius: 8, padding: '5px 12px', color: ri === highlight ? '#5E7B59' : '#5D685F', fontSize: 12, fontFamily: 'monospace', minWidth: 80, textAlign: 'center', transition: 'all 0.4s' }}>Cost: {row.cost}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 12, color: '#3F4B43', fontSize: 12 }}>
        log n levels × n per level = <span style={{ color: '#6B8E63', fontWeight: 700 }}>O(n log n)</span>
      </div>
    </SectionCard>
  );
}

function DesignStrategiesTable() {
  const data = [
    { strategy: 'Divide & Conquer', color: '#173A29', icon: '⚔️', approach: 'Top-down', problems: 'Binary Search, Quick Sort, Merge Sort, Heap Sort, Strassen', complexity: 'O(n log n)' },
    { strategy: 'Greedy Method', color: '#6B8E63', icon: '💰', approach: 'Locally optimal', problems: 'Fractional Knapsack, Kruskal, Prim, Dijkstra', complexity: 'O(n log n)' },
    { strategy: 'Dynamic Programming', color: '#52745A', icon: '📊', approach: 'Bottom-up', problems: "Floyd's All Pairs, Chain Matrix, LCS, 0/1 Knapsack, TSP", complexity: 'O(n²)–O(n³)' },
    { strategy: 'Backtracking', color: '#A3B18A', icon: '↩️', approach: 'Depth-first search', problems: 'N-Queens, Sum of Subsets', complexity: 'Exponential' },
    { strategy: 'Branch & Bound', color: '#4A6B54', icon: '🌿', approach: 'BFS-like optimal', problems: 'Assignment Problem, TSP', complexity: 'Exponential' },
  ];
  return (
    <SectionCard title="📊 Algorithm Design Strategies">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map(d => (
          <div key={d.strategy} style={{ display: 'flex', gap: 12, background: `${d.color}0a`, border: `1px solid ${d.color}33`, borderRadius: 10, padding: '12px 16px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>{d.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: d.color, fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{d.strategy}</div>
              <div style={{ color: '#173A29', fontSize: 12, marginBottom: 2 }}><span style={{ color: '#5D685F' }}>Approach: </span>{d.approach}</div>
              <div style={{ color: '#173A29', fontSize: 12 }}><span style={{ color: '#5D685F' }}>Problems: </span>{d.problems}</div>
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
          <button key={t} onClick={() => setShow(t)} style={{ padding: '8px 20px', borderRadius: 20, border: `2px solid ${show === t ? '#5E7B59' : 'rgba(94,123,89,0.30)'}`, background: show === t ? 'rgba(58,107,74,0.15)' : 'transparent', color: show === t ? '#5E7B59' : '#6B8066', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            {t === 'normal' ? '🔴 Normal O(n³)' : '🟢 Strassen O(n^2.8)'}
          </button>
        ))}
      </div>
      {show === 'normal' ? (
        <div>
          <InfoBox label="Normal: 8 multiplications" text="T(n) = 8T(n/2) + Θ(n²) → O(n³). Uses 8 recursive multiplications." color="#4A6B54" />
          <div style={{ textAlign: 'center', marginTop: 12, color: '#4A6B54', fontWeight: 700 }}>8 multiplications → T(n) = Θ(n³)</div>
        </div>
      ) : (
        <div>
          <InfoBox label="Strassen: Only 7 multiplications!" text="Reduces to 7 recursive multiplications (P1–P7) saving one recursion level. T(n) = Θ(n^log₂7) ≈ Θ(n^2.81)" color="#6B8E63" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
            {[['P₁','A₁₁(B₁₂−B₂₂)'],['P₂','(A₁₁+A₁₂)B₂₂'],['P₃','(A₂₁+A₂₂)B₁₁'],['P₄','A₂₂(B₂₁−B₁₁)'],['P₅','(A₁₁+A₂₂)(B₁₁+B₂₂)'],['P₆','(A₁₂−A₂₂)(B₂₁+B₂₂)'],['P₇','(A₁₁−A₂₁)(B₁₁+B₁₂)']].map(([p, f]) => (
              <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 30, color: '#173A29', fontWeight: 800, fontFamily: 'monospace', fontSize: 13 }}>{p}</div>
                <div style={{ flex: 1, background: 'rgba(58,107,74,0.10)', border: '1px solid rgba(58,107,74,0.30)', borderRadius: 6, padding: '6px 12px', color: '#173A29', fontFamily: 'monospace', fontSize: 12 }}>{f}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 12, color: '#6B8E63', fontWeight: 700 }}>7 multiplications → T(n) = Θ(n^2.81)</div>
        </div>
      )}
    </SectionCard>
  );
}

function NotationCards() {
  const notations = [
    { symbol: 'O', name: 'Big-O (Upper Bound)', color: '#4A6B54', badge: 'WORST CASE', formal: 'T(n) = O(f(n)) if ∃ c > 0, n₀ ≥ 1 : T(n) ≤ c·f(n) ∀ n ≥ n₀', desc: 'Big-O gives the UPPER BOUND — the maximum time an algorithm can take.', example: 'Linear Search → O(n): worst case checks all n elements', intuition: 'Algorithm will NEVER be slower than this.' },
    { symbol: 'Ω', name: 'Big-Omega (Lower Bound)', color: '#6B8E63', badge: 'BEST CASE', formal: 'T(n) = Ω(f(n)) if ∃ c > 0, n₀ ≥ 1 : T(n) ≥ c·f(n) ∀ n ≥ n₀', desc: 'Big-Omega gives the LOWER BOUND — the minimum time an algorithm must take.', example: 'Linear Search → Ω(1): best case finds at index 0', intuition: 'Algorithm will ALWAYS take AT LEAST this long.' },
    { symbol: 'Θ', name: 'Big-Theta (Tight Bound)', color: '#A3B18A', badge: 'TIGHT BOUND', formal: 'T(n) = Θ(f(n)) if T(n) = O(f(n)) AND T(n) = Ω(f(n))', desc: 'Big-Theta gives the TIGHT BOUND — when upper and lower bounds match exactly.', example: 'Merge Sort → Θ(n log n): always in all cases', intuition: 'Algorithm ALWAYS runs in exactly this time class.' },
  ];
  return (
    <>
      {notations.map(n => (
        <div key={n.symbol} style={{ background: `${n.color}0d`, border: `1px solid ${n.color}44`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: `${n.color}22`, border: `2px solid ${n.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: n.color, fontFamily: 'serif' }}>{n.symbol}</div>
            <div>
              <div style={{ color: '#173A29', fontWeight: 800, fontSize: 16 }}>{n.name}</div>
              <div style={{ display: 'inline-block', marginTop: 4, padding: '3px 10px', borderRadius: 20, background: `${n.color}22`, border: `1px solid ${n.color}66`, color: n.color, fontSize: 11, fontWeight: 700 }}>{n.badge}</div>
            </div>
          </div>
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.8, marginBottom: 12 }}>{n.desc}</p>
          <div style={{ background: 'rgba(23,58,41,0.40)', borderRadius: 10, padding: '10px 14px', marginBottom: 10, fontFamily: 'monospace', fontSize: 12, color: n.color, border: `1px solid ${n.color}33` }}>{n.formal}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, background: 'rgba(23,58,41,0.30)', borderRadius: 8, padding: '8px 12px', minWidth: 160 }}>
              <div style={{ color: '#5D685F', fontSize: 10, marginBottom: 3 }}>EXAMPLE</div>
              <div style={{ color: '#E6E1D5', fontSize: 12 }}>{n.example}</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(23,58,41,0.30)', borderRadius: 8, padding: '8px 12px', minWidth: 160 }}>
              <div style={{ color: '#5D685F', fontSize: 10, marginBottom: 3 }}>INTUITION</div>
              <div style={{ color: '#E6E1D5', fontSize: 12 }}>{n.intuition}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

// ── Reusable step-list block used by the new Unit 2–5 topics ──
function StepList({ steps, color = '#5E7B59' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {steps.map(([num, title, desc], i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: `${color}0a`, border: `1px solid ${color}33`, borderRadius: 10, padding: '10px 14px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{num}</div>
          <div><div style={{ color, fontWeight: 700, fontSize: 13 }}>{title}</div><div style={{ color: '#3F4B43', fontSize: 12, marginTop: 3 }}>{desc}</div></div>
        </div>
      ))}
    </div>
  );
}

// ── Reusable complexity summary strip used by the new Unit 2–5 topics ──
function ComplexityStrip({ items }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {items.map(([label, val, color], i) => (
        <div key={i} style={{ flex: 1, minWidth: 120, background: `${color}11`, border: `1px solid ${color}44`, borderRadius: 10, padding: 14, textAlign: 'center' }}>
          <div style={{ color: '#3F4B43', fontSize: 11, marginBottom: 4 }}>{label}</div>
          <div style={{ color, fontWeight: 800, fontSize: 14, fontFamily: 'monospace' }}>{val}</div>
        </div>
      ))}
    </div>
  );
}

// ── Reusable sample input/output block used by the new Unit 2–5 topics ──
function SampleIO({ input, output, color = '#5E7B59' }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ color, fontWeight: 700, fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Sample Input</div>
        <pre style={{ background: 'rgba(23,58,41,0.40)', border: `1px solid ${color}33`, borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 12, fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0 }}>{input}</pre>
      </div>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ color, fontWeight: 700, fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Output</div>
        <pre style={{ background: 'rgba(23,58,41,0.40)', border: `1px solid ${color}33`, borderRadius: 10, padding: '10px 14px', color: 'white', fontSize: 12, fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0 }}>{output}</pre>
      </div>
    </div>
  );
}

// ══════════════════════════ UNIT 1 TOPICS (unchanged) ══════════════════════════
const unit1Topics = [
  {
    id: 'intro', icon: '📘', title: 'Introduction to Algorithms', color: '#173A29',
    tags: ['Definition', 'Properties', 'Design Goals', 'Techniques'],
    render: () => (
      <div>
        <SectionCard title="📖 What is an Algorithm?" color="#3A6B4A">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9, marginBottom: 16 }}>
            An <strong style={{ color: '#173A29' }}>Algorithm</strong> is a finite sequence of instructions, each with clear meaning, performable in finite time. It must satisfy: Input, Output, Definiteness, Finiteness, and Effectiveness.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            {[['📥 Input','Zero or more quantities externally supplied','#3A6B4A'],['📤 Output','At least one quantity is produced','#6B8E63'],['🔷 Definiteness','Each instruction must be clear and unambiguous','#52745A'],['⏱️ Finiteness','Terminates after finite steps for ALL cases','#A3B18A'],['✅ Effectiveness','Every step doable by pencil and paper','#5E7B59']].map(([t, d, c]) => (
              <div key={t} style={{ background: `${c}11`, border: `1px solid ${c}44`, borderRadius: 10, padding: 12 }}>
                <div style={{ color: c, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t}</div>
                <div style={{ color: '#3F4B43', fontSize: 12, lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="🎯 Steps for Designing an Algorithm" color="#2D523D">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['1','Understand the Problem','Carefully read and grasp what is being asked.','#3A6B4A'],['2','Decision Making','Choose capabilities, methods, data structures, strategies.','#5E7B59'],['3','Specification','Write the algorithm in pseudocode.','#2D523D'],['4','Verification','Manually trace through with test cases.','#6F8F68'],['5','Analysis','Determine time and space complexity.','#7A936F'],['6','Implementation','Code the algorithm.','#6B8E63']].map(([num, title, desc, color]) => (
              <div key={num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: `${color}0a`, border: `1px solid ${color}33`, borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{num}</div>
                <div><div style={{ color, fontWeight: 700, fontSize: 13 }}>{title}</div><div style={{ color: '#3F4B43', fontSize: 12, marginTop: 3 }}>{desc}</div></div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="🏆 Algorithm Design Goals" color="#6B8E63">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[['⏱️','Save Time','Faster program = better program.','#6B8E63'],['💾','Save Space','Minimize memory for constrained systems.','#52745A'],['😊','Save Face','Prevent bugs and crashes.','#A3B18A']].map(([icon, t, d, c]) => (
              <div key={t} style={{ background: `${c}11`, border: `1px solid ${c}44`, borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ color: c, fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{t}</div>
                <div style={{ color: '#3F4B43', fontSize: 12, lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <DesignStrategiesTable />
        <SectionCard title="📊 Classification by Running Time" color="#52745A">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['O(1)','Constant','#6B8E63','Array index access, hash lookup.'],['O(log n)','Logarithmic','#5E7B59','Binary search. n=million → only ~20 steps.'],['O(n)','Linear','#52745A','One pass. Linear search, traversal.'],['O(n log n)','Linearithmic','#A3B18A','Merge sort, heap sort.'],['O(n²)','Quadratic','#7A8E70','Double nested loop. Bubble sort.'],['O(n³)','Cubic','#4A6B54','Triple nested loop. Matrix multiply.'],['O(2ⁿ)','Exponential','#35553F','Brute-force. N-Queens, TSP.']].map(([big, name, col, desc]) => (
              <div key={big} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: `${col}0a`, border: `1px solid ${col}33`, borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ color: col, fontWeight: 800, fontFamily: 'monospace', fontSize: 13, width: 90, flexShrink: 0 }}>{big}</div>
                <div style={{ color: col, fontWeight: 600, fontSize: 12, width: 100, flexShrink: 0 }}>{name}</div>
                <div style={{ color: '#3F4B43', fontSize: 12 }}>{desc}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <ComplexityChart />
      </div>
    ),
  },
  {
    id: 'asymptotic', icon: '📊', title: 'Asymptotic Notations', color: '#173A29',
    tags: ['Big-O', 'Big-Ω', 'Big-Θ', 'Rate of Growth'],
    render: () => (
      <div>
        <SectionCard title="📐 What is Asymptotic Analysis?" color="#5E7B59">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9, marginBottom: 12 }}>
            The <strong style={{ color: '#173A29' }}>asymptotic complexity</strong> describes how resource requirements grow as input increases. It ultimately determines the size of problems an algorithm can solve.
          </p>
          <InfoBox label="Three cases of f(n)" text="• Best Case: minimum value of f(n)   • Average Case: expected value   • Worst Case: maximum value for any input" color="#5E7B59" />
        </SectionCard>
        <NotationCards />
        <AsymptoticGraph />
        <NotationBarChart />
        <ComplexitySphere />
        <ComplexityChart />
        <SectionCard title="📋 Numerical Comparison" color="#52745A">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead><tr>{['n','log n','n·log n','n²','n³','2ⁿ'].map(h => <th key={h} style={{ padding: '8px 12px', background: 'rgba(82,116,90,0.20)', color: '#789477', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid rgba(82,116,90,0.30)', fontFamily: 'monospace' }}>{h}</th>)}</tr></thead>
              <tbody>
                {[[1,'0','0',1,1,2],[2,1,2,4,8,4],[4,2,8,16,64,16],[8,3,24,64,512,256],[16,4,64,256,4096,'65,536'],[32,5,160,1024,'32,768','4.2B'],[64,6,384,4096,'262,144','Note 1'],[128,7,896,'16,384','2,097,152','Note 2']].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(82,116,90,0.04)' : 'transparent' }}>
                    {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: j===0?'white':j<3?'#8AA681':j===3?'#52745A':j===4?'#A3B18A':'#4A6B54', textAlign: 'center', borderBottom: '1px solid rgba(82,116,90,0.10)', fontFamily: 'monospace', fontWeight: j===0?700:400 }}>{cell}</td>)}
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
    id: 'complexity', icon: '⏱️', title: 'Time & Space Complexity', color: '#7A936F',
    tags: ['Time', 'Space', 'Best/Worst/Avg'],
    render: () => (
      <div>
        <SectionCard title="⏱️ Time Complexity" color="#7A936F">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9 }}>The <strong style={{ color: '#7A936F' }}>time complexity</strong> is the amount of computer time needed to run to completion, as a function of input size n.</p>
        </SectionCard>
        <SectionCard title="💾 Space Complexity — 3 Components" color="#52745A">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['📦','Instruction Space','Space to store compiled program instructions. Depends on compiler and target machine.','#3A6B4A'],['🗃️','Data Space','Space for constants, variables, and dynamically allocated objects like arrays.','#52745A'],['📚','Environment Stack Space','Recursion stack — saves info to resume partially completed function calls.','#6B8E63']].map(([icon, t, d, c]) => (
              <div key={t} style={{ display: 'flex', gap: 12, background: `${c}0a`, border: `1px solid ${c}33`, borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{icon}</div>
                <div><div style={{ color: c, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t}</div><div style={{ color: '#3F4B43', fontSize: 12, lineHeight: 1.6 }}>{d}</div></div>
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
    id: 'recurrence', icon: '🌳', title: 'Recurrence Relations', color: '#6F8F68',
    tags: ['Master Theorem', 'Recursion Tree', 'Substitution'],
    render: () => (
      <div>
        <SectionCard title="🔄 Recurrence Relations" color="#6F8F68">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9 }}>A <strong style={{ color: '#6F8F68' }}>recurrence relation</strong> expresses time complexity of a recursive algorithm in terms of itself on smaller inputs. Three solving methods:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginTop: 12 }}>
            {[['Substitution','Guess + prove by induction','#6F8F68'],['Recursion Tree','Draw call tree, sum all costs','#A3B18A'],['Master Theorem','Direct formula for T(n)=aT(n/b)+f(n)','#6B8E63']].map(([t, d, c]) => (
              <div key={t} style={{ background: `${c}11`, border: `1px solid ${c}44`, borderRadius: 10, padding: 12 }}>
                <div style={{ color: c, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t}</div>
                <div style={{ color: '#3F4B43', fontSize: 12 }}>{d}</div>
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
    id: 'dac', icon: '⚡', title: 'Divide and Conquer', color: '#2D523D',
    tags: ['Binary Search', 'Merge Sort', 'Quick Sort', 'Strassen'],
    render: () => (
      <div>
        <SectionCard title="⚡ Divide and Conquer Paradigm" color="#2D523D">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
            {[['⚔️','DIVIDE','Break into sub-problems','#4A6B54'],['🧩','CONQUER','Solve recursively','#A3B18A'],['🔗','COMBINE','Merge sub-solutions','#6B8E63']].map(([icon, t, d, c]) => (
              <div key={t} style={{ flex: 1, minWidth: 130, background: `${c}11`, border: `1px solid ${c}44`, borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                <div style={{ color: c, fontWeight: 800, fontSize: 13, marginBottom: 6 }}>{t}</div>
                <div style={{ color: '#3F4B43', fontSize: 12 }}>{d}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="🔍 Binary Search — O(log n)" color="#52745A">
          <InfoBox label="Core Idea" text="Sorted array required. mid=(beg+end)/2. Compare key with arr[mid], discard half each step." color="#52745A" />
          <CodeBlock code={`BinarySearch(arr, beg, end, key):
  while beg <= end:
    mid = (beg + end) / 2
    if arr[mid] == key: return mid
    else if key < arr[mid]: end = mid - 1
    else: beg = mid + 1
  return -1   // Time: O(log₂ n)`} />
        </SectionCard>
        <BinarySearchFlow />
        <SectionCard title="🔀 Merge Sort — Θ(n log n)" color="#5E7B59">
          <InfoBox label="Core Idea" text="T(n)=2T(n/2)+Θ(n) → Θ(n log n) in ALL cases. Stable. Needs O(n) extra space." color="#5E7B59" />
          <CodeBlock code={`MergeSort(A, p, r):
  if p < r:
    q = (p + r) / 2
    MergeSort(A, p, q)
    MergeSort(A, q+1, r)
    Merge(A, p, q, r)`} />
        </SectionCard>
        <MergeSortDiagram />
        <SectionCard title="⚡ Quick Sort" color="#A3B18A">
          <InfoBox label="Best/Avg" text="Θ(n log n) — pivot splits evenly" color="#6B8E63" />
          <InfoBox label="Worst Case" text="O(n²) — already sorted array, last element pivot. T(n)=T(n-1)+Θ(n)" color="#4A6B54" />
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
    id: 'heap', icon: '🌲', title: 'Heap & Heap Sort', color: '#6B8E63',
    tags: ['Max Heap', 'Min Heap', 'Heapify', 'O(n log n)'],
    render: () => (
      <div>
        <SectionCard title="🌲 Heap — Complete Binary Tree" color="#6B8E63">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9, marginBottom: 14 }}>
            A <strong style={{ color: '#6B8E63' }}>Heap</strong> is a complete binary tree stored as array. Max Heap: parent ≥ children. Min Heap: parent ≤ children.
          </p>
          <SectionCard title="Array Index Formulas" color="#3A6B4A">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[['PARENT(i)','floor(i/2)','#5E7B59'],['LEFT(i)','2i','#52745A'],['RIGHT(i)','2i+1','#6B8E63']].map(([fn, val, col]) => (
                <div key={fn} style={{ background: `${col}11`, border: `1px solid ${col}44`, borderRadius: 8, padding: '12px 20px', textAlign: 'center', minWidth: 120 }}>
                  <div style={{ color: col, fontFamily: 'monospace', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{fn}</div>
                  <div style={{ color: '#173A29', fontFamily: 'monospace', fontSize: 15, fontWeight: 800 }}>→ {val}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </SectionCard>
        <HeapDiagram />
        <SectionCard title="🔧 Three Heap Procedures" color="#A3B18A">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['#A3B18A','1. Heapify(A,i) — O(log n)','Compares parent with largest child. Swaps if needed. Recurses down.',`Heapify(A, i):\n  l=LEFT(i), r=RIGHT(i)\n  largest = (A[l]>A[i]) ? l : i\n  if A[r]>A[largest]: largest=r\n  if largest!=i: swap, Heapify(A,largest)`],
              ['#6B8E63','2. BuildHeap(A) — O(n)','Bottom-up from floor(n/2) down to 1. Converts any array to heap.',`BuildHeap(A):\n  heapsize = length(A)\n  for i = floor(n/2) downto 1:\n    Heapify(A, i)`],
              ['#52745A','3. HeapSort(A) — O(n log n)','Build max heap, extract max repeatedly. In-place, no extra space.',`HeapSort(A):\n  BuildHeap(A)\n  for i = n downto 2:\n    swap A[1] and A[i]\n    heapsize--\n    Heapify(A, 1)`],
            ].map(([c, title, desc, code]) => (
              <div key={title} style={{ background: `${c}08`, border: `1px solid ${c}33`, borderRadius: 10, padding: 14 }}>
                <div style={{ color: c, fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{title}</div>
                <p style={{ color: '#3F4B43', fontSize: 12, lineHeight: 1.7, marginBottom: 8 }}>{desc}</p>
                <CodeBlock code={code} />
              </div>
            ))}
          </div>
        </SectionCard>
        <HeapSortSteps />
        <SectionCard title="📊 Heap Sort Complexity Summary" color="#5E7B59">
          <ComplexityStrip items={[['Heapify','O(log n)','#A3B18A'],['Build Heap','O(n)','#6B8E63'],['Heap Sort','O(n log n)','#5E7B59'],['Space','O(1)','#52745A']]} />
        </SectionCard>
      </div>
    ),
  },
];


function TheoryTopic({ color, sections, complexity }) {
  return (
    <div>
      {sections.map((section, index) => (
        <SectionCard key={index} title={section.title} color={color}>
          {section.type === 'steps' ? (
            <StepList color={color} steps={section.items} />
          ) : section.type === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
              {section.items.map((item, i) => (
                <div key={i} style={{ background: `${color}0d`, border: `1px solid ${color}33`, borderRadius: 10, padding: 12 }}>
                  <div style={{ color, fontWeight: 700, fontSize: 13, marginBottom: 5 }}>{item[0]}</div>
                  <div style={{ color: '#3F4B43', fontSize: 12, lineHeight: 1.65 }}>{item[1]}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#173A29', fontSize: 13, lineHeight: 1.85 }}>
              {section.items.map((item, i) => (
                <div key={i} style={{ marginBottom: i === section.items.length - 1 ? 0 : 9 }}>
                  {item[0] && <strong style={{ color: '#173A29' }}>{item[0]} </strong>}
                  {item[1]}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      ))}
      {complexity && (
        <SectionCard title="📊 Quick Revision — Complexity" color={color}>
          <ComplexityStrip items={complexity} />
        </SectionCard>
      )}
    </div>
  );
}

// ══════════════════════════ UNIT 2 TOPICS (new — Greedy Method) ══════════════════════════
const unit2Topics = [
  {
    id: 'merge-pattern', icon: '📦', title: 'Disaster Relief Supply Distribution (Optimal Merge Pattern)', color: '#6B8E63',
    tags: ['Greedy', 'Min-Heap', 'Priority Queue'],
    render: () => (
      <div>
        <SectionCard title="📖 Problem Statement" color="#6B8E63">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9 }}>
            Relief camps hold supply files of different sizes that must all be merged into one master file. Each merge of two files costs the sum of their sizes. The goal is to merge everything at the <strong style={{ color: '#6B8E63' }}>minimum total cost</strong> — the classic Optimal Merge Pattern problem.
          </p>
        </SectionCard>
        <SectionCard title="💡 Greedy Strategy" color="#6B8E63">
          <StepList color="#6B8E63" steps={[
            ['1', 'Insert all sizes into a min-priority queue', 'So the two smallest files are always available at the top.'],
            ['2', 'Repeatedly remove the two smallest', 'Merge them, add their sum back to the cost, and push the merged size back in.'],
            ['3', 'Stop when one file remains', 'That means every original file has been merged exactly once into the final result.'],
          ]} />
          <InfoBox label="Why greedy works" text="Always combining the two currently-smallest piles keeps large files from being re-merged too many times, which minimizes the total weighted merge cost (this is the same idea behind Huffman coding)." color="#6B8E63" />
        </SectionCard>
        <SectionCard title="💻 C++ Code" color="#6B8E63">
          <CodeBlock code={`#include <iostream>
#include <queue>
using namespace std;
int main(){
 int n,x,cost=0;
 cin>>n;
 priority_queue<int,vector<int>,greater<int>> pq;
 for(int i=0;i<n;i++){cin>>x;pq.push(x);}
 while(pq.size()>1){
 int a=pq.top(); pq.pop();
 int b=pq.top(); pq.pop();
 cost+=a+b;
 pq.push(a+b);
 }
 cout<<"Minimum Cost = "<<cost;
 return 0;
}`} />
        </SectionCard>
        <SectionCard title="📊 Complexity" color="#6B8E63">
          <ComplexityStrip items={[['Build Heap', 'O(n)', '#6B8E63'], ['Each Merge', 'O(log n)', '#5E7B59'], ['Total', 'O(n log n)', '#A3B18A'], ['Space', 'O(n)', '#52745A']]} />
        </SectionCard>
        <SectionCard title="🧪 Sample Run" color="#6B8E63">
          <SampleIO color="#6B8E63" input={"4\n10 20 30 40"} output={"Minimum Cost = 190"} />
        </SectionCard>
      </div>
    ),
  },
  {
    id: 'prim-mst', icon: '🌐', title: "Smart City Fiber Network (MST — Prim's Algorithm)", color: '#52745A',
    tags: ['Greedy', 'MST', 'Adjacency Matrix'],
    render: () => (
      <div>
        <SectionCard title="📖 Problem Statement" color="#52745A">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9 }}>
            A smart city wants to connect every locality with fiber cable at the <strong style={{ color: '#52745A' }}>lowest total installation cost</strong>, without any redundant loops. This is a Minimum Spanning Tree problem, solved here with Prim's Algorithm.
          </p>
        </SectionCard>
        <SectionCard title="💡 Prim's Greedy Strategy" color="#52745A">
          <StepList color="#52745A" steps={[
            ['1', 'Start from any node', 'Mark it visited; it forms the initial (single-node) tree.'],
            ['2', 'Pick the cheapest crossing edge', 'Among all edges from a visited node to an unvisited node, pick the minimum-cost one.'],
            ['3', 'Grow the tree', 'Add that edge and mark the new node visited. Repeat until n−1 edges are chosen.'],
          ]} />
          <InfoBox label="Why greedy works" text="The cut property guarantees the cheapest edge crossing any partition of visited/unvisited nodes is always safe to add to some MST." color="#52745A" />
        </SectionCard>
        <SectionCard title="💻 C++ Code" color="#52745A">
          <CodeBlock code={`#include <iostream>
using namespace std;
int main(){
 int n;
 cin>>n;
 int cost[20][20],vis[20]={0};
 for(int i=0;i<n;i++)
 for(int j=0;j<n;j++) cin>>cost[i][j];
 vis[0]=1;
 int edges=0,total=0;
 while(edges<n-1){
 int min=999,a=-1,b=-1;
 for(int i=0;i<n;i++) if(vis[i])
 for(int j=0;j<n;j++)
 if(!vis[j]&&cost[i][j]&&cost[i][j]<min){
 min=cost[i][j]; a=i; b=j;
 }
 cout<<a<<" - "<<b<<" = "<<min<<endl;
 total+=min;
 vis[b]=1;
 edges++;
 }
 cout<<"Minimum Cost = "<<total;
}`} />
        </SectionCard>
        <SectionCard title="📊 Complexity" color="#52745A">
          <ComplexityStrip items={[['Adjacency Matrix', 'O(n²)', '#52745A'], ['With Min-Heap', 'O(E log V)', '#5E7B59'], ['Space', 'O(n²)', '#A3B18A']]} />
        </SectionCard>
        <SectionCard title="🧪 Sample Run" color="#52745A">
          <SampleIO color="#52745A" input={"(Adjacency cost matrix of the network)"} output={"Selected edges with minimum total cost."} />
        </SectionCard>
      </div>
    ),
  },
  {
    id: "greedy-fundamentals", icon: "\ud83d\udcb0", title: "Greedy Method \u2014 Fundamentals", color: "#6B8E63",
    tags: ["Greedy", "Optimality", "Theory"],
    render: () => <TheoryTopic color={"#6B8E63"} sections={[{"title": "What is Greedy Method?", "type": "text", "items": [["Definition:", "A greedy algorithm builds a solution step by step and chooses the locally best feasible option at each step."]]}, {"title": "Key Characteristics", "type": "grid", "items": [["Greedy Choice Property", "A globally optimal solution can be reached by making a locally optimal choice first."], ["Optimal Substructure", "An optimal solution contains optimal solutions to its subproblems."], ["Feasibility", "The selected choice must satisfy the problem constraints."], ["Irrevocability", "A choice is normally not reconsidered after it is made."]]}, {"title": "Generic Greedy Procedure", "type": "steps", "items": [["1", "Define the candidate set", "List the available choices."], ["2", "Define the selection rule", "Choose the best current candidate according to the greedy criterion."], ["3", "Check feasibility", "Reject the candidate if it violates constraints."], ["4", "Add the choice", "Include the feasible candidate in the partial solution."], ["5", "Repeat", "Continue until the required solution is complete."]]}]} complexity={[["Time", "Depends on sorting/data structure", "#5E7B59"], ["Space", "Depends on implementation", "#52745A"]]} />,
  },
  {
    id: "optimal-merge-example", icon: "\ud83e\udde9", title: "Optimal Merge Pattern \u2014 Worked Example", color: "#6B8E63",
    tags: ["Greedy", "Min-Heap", "Worked Example"],
    render: () => <TheoryTopic color={"#6B8E63"} sections={[{"title": "Worked Calculation", "type": "text", "items": [["Problem:", "Merge files with sizes 10, 20, 30 and 40 at minimum total cost. The cost of every merge is the sum of the two files."], ["Step 1:", "Merge 10 + 20 = 30; total cost = 30."], ["Step 2:", "Merge 30 + 30 = 60; total cost = 90."], ["Step 3:", "Merge 40 + 60 = 100; total cost = 190."], ["Answer:", "Minimum total merge cost = 190."]]}, {"title": "Exam Points", "type": "grid", "items": [["Rule", "Always remove the two smallest files."], ["Data Structure", "Min-priority queue / min-heap."], ["Why", "Large files are kept from participating in many expensive merges."], ["Application", "File merging and the same greedy principle used in Huffman coding."]]}]} complexity={[["Time", "O(n log n)", "#6B8E63"], ["Space", "O(n)", "#52745A"]]} />,
  },
  {
    id: "kruskal-mst", icon: "\ud83d\udd17", title: "Minimum Spanning Tree \u2014 Kruskal's Algorithm", color: "#52745A",
    tags: ["Greedy", "MST", "Kruskal"],
    render: () => <TheoryTopic color={"#52745A"} sections={[{"title": "Concept", "type": "text", "items": [["Definition:", "Kruskal's algorithm constructs an MST by considering edges in increasing order of weight."], ["Core Rule:", "Add the smallest edge if it does not create a cycle."], ["Termination:", "For a connected graph with V vertices, stop after V−1 edges have been selected."]]}, {"title": "Algorithm Steps", "type": "steps", "items": [["1", "Sort all edges", "Arrange edges from smallest to largest weight."], ["2", "Select the smallest edge", "Take the next edge in sorted order."], ["3", "Check for a cycle", "Use Disjoint Set Union / Union-Find to test whether its endpoints are already connected."], ["4", "Add or reject", "Add the edge if it does not form a cycle; otherwise skip it."], ["5", "Finish at V−1 edges", "The selected edges form the MST."]]}, {"title": "Prim vs Kruskal", "type": "grid", "items": [["Prim", "Starts with a vertex and grows one tree."], ["Kruskal", "Starts with edges and combines components."], ["Prim Data Structure", "Priority queue is commonly used."], ["Kruskal Data Structure", "Sorting + Disjoint Set Union."]]}]} complexity={[["Sorting", "O(E log E)", "#52745A"], ["DSU Operations", "Near O(E) amortized", "#6B8E63"], ["Overall", "O(E log E)", "#A3B18A"]]} />,
  },
  {
    id: "fractional-knapsack", icon: "\ud83c\udf92", title: "Fractional Knapsack", color: "#A3B18A",
    tags: ["Greedy", "Knapsack", "Ratio"],
    render: () => <TheoryTopic color={"#A3B18A"} sections={[{"title": "Concept", "type": "text", "items": [["Definition:", "In Fractional Knapsack, an item may be divided and a fraction of it can be selected."], ["Greedy Rule:", "Sort items by decreasing value/weight ratio and take the highest ratio first."], ["Important:", "This greedy strategy is optimal because fractions are allowed. It is not generally valid for 0/1 Knapsack."]]}, {"title": "Algorithm Steps", "type": "steps", "items": [["1", "Calculate ratio", "For every item calculate value ÷ weight."], ["2", "Sort by ratio", "Arrange items from highest ratio to lowest."], ["3", "Fill capacity", "Take a complete item while it fits."], ["4", "Take a fraction", "If the next item does not fully fit, take the required fraction and stop."]]}, {"title": "Comparison", "type": "grid", "items": [["Fractional", "Items can be split."], ["0/1", "Each item is either selected or rejected."], ["Greedy", "Optimal for fractional version."], ["DP", "Used for the standard 0/1 version."]]}]} complexity={[["Sorting", "O(n log n)", "#A3B18A"], ["Selection", "O(n) after sorting", "#6B8E63"], ["Total", "O(n log n)", "#5E7B59"]]} />,
  },

];

// ══════════════════════════ UNIT 3 TOPICS (new — Dynamic Programming) ══════════════════════════
const unit3Topics = [
  {
    id: 'knapsack', icon: '🚀', title: 'Space Mission Payload Selection (0/1 Knapsack)', color: '#A3B18A',
    tags: ['DP', '0/1 Knapsack', 'Table Method'],
    render: () => (
      <div>
        <SectionCard title="📖 Problem Statement" color="#A3B18A">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9 }}>
            A spacecraft has a fixed payload weight capacity <strong style={{ color: '#A3B18A' }}>W</strong>. Each candidate instrument has a weight and a scientific value, and each item can be taken whole or left behind (no fractions) — the 0/1 Knapsack problem.
          </p>
        </SectionCard>
        <SectionCard title="💡 Dynamic Programming Approach" color="#A3B18A">
          <StepList color="#A3B18A" steps={[
            ['1', 'Define the state', 'dp[i][w] = maximum value achievable using the first i items with capacity w.'],
            ['2', 'Write the recurrence', 'If item i fits (wt[i] ≤ w): dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w-wt[i]]); else dp[i][w] = dp[i-1][w].'],
            ['3', 'Fill the table bottom-up', 'For every item, for every capacity from 0 to W. The answer is dp[n][W].'],
          ]} />
          <InfoBox label="Why DP (not greedy)" text="Unlike Fractional Knapsack, taking the highest value/weight ratio item first does not always give the optimal 0/1 solution — overlapping subproblems make DP necessary." color="#A3B18A" />
        </SectionCard>
        <SectionCard title="💻 C++ Code" color="#A3B18A">
          <CodeBlock code={`#include <iostream>
using namespace std;
int main() {
 int n,W;
 cin>>n>>W;
 int wt[100],val[100],dp[101][101]={0};
 for(int i=1;i<=n;i++) cin>>wt[i]>>val[i];
 for(int i=1;i<=n;i++)
 for(int w=0;w<=W;w++)
 if(wt[i]<=w)
 dp[i][w]=max(dp[i-1][w], val[i]+dp[i-1][w-wt[i]]);
 else
 dp[i][w]=dp[i-1][w];
 cout<<"Maximum Value = "<<dp[n][W];
 return 0;
}`} />
        </SectionCard>
        <SectionCard title="📊 Complexity" color="#A3B18A">
          <ComplexityStrip items={[['Time', 'O(n·W)', '#A3B18A'], ['Space', 'O(n·W)', '#52745A'], ['Optimized Space', 'O(W)', '#6B8E63']]} />
        </SectionCard>
        <SectionCard title="🧪 Sample Run" color="#A3B18A">
          <SampleIO color="#A3B18A" input={"3 50\n10 60\n20 100\n30 120"} output={"Maximum Value = 220"} />
        </SectionCard>
      </div>
    ),
  },
  {
    id: 'multistage', icon: '🗺️', title: 'Tourist Route Planner (Multistage Graph)', color: '#6F8F68',
    tags: ['DP', 'Stages', 'Backward Recursion'],
    render: () => (
      <div>
        <SectionCard title="📖 Problem Statement" color="#6F8F68">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9 }}>
            A tourist route is organized into stages (start city → intermediate stops → destination), where travel only moves forward stage by stage. The goal is the <strong style={{ color: '#6F8F68' }}>minimum-cost path</strong> from the first stage to the last — a Multistage Graph problem.
          </p>
        </SectionCard>
        <SectionCard title="💡 Dynamic Programming Approach" color="#6F8F68">
          <StepList color="#6F8F68" steps={[
            ['1', 'Work backward from the destination', 'dist[n-1] = 0, since the last node needs no further travel.'],
            ['2', 'Fill dist[i] for every earlier node', 'dist[i] = min over all edges (i, j) of cost[i][j] + dist[j].'],
            ['3', 'Read the answer at dist[0]', 'That value is the minimum cost from the source to the destination across all stages.'],
          ]} />
          <InfoBox label="Why backward DP" text="Because edges only go forward stage-to-stage, computing costs from the last stage back to the first guarantees dist[j] is already finalized whenever it's needed." color="#6F8F68" />
        </SectionCard>
        <SectionCard title="💻 C++ Code" color="#6F8F68">
          <CodeBlock code={`#include <iostream>
using namespace std;
const int INF=9999;
int main(){
 int n;
 cin>>n;
 int cost[20][20],dist[20];
 for(int i=0;i<n;i++)
 for(int j=0;j<n;j++) cin>>cost[i][j];
 dist[n-1]=0;
 for(int i=n-2;i>=0;i--){
 dist[i]=INF;
 for(int j=i+1;j<n;j++)
 if(cost[i][j]!=0 && dist[i]>cost[i][j]+dist[j])
 dist[i]=cost[i][j]+dist[j];
 }
 cout<<"Minimum Cost = "<<dist[0];
 return 0;
}`} />
        </SectionCard>
        <SectionCard title="📊 Complexity" color="#6F8F68">
          <ComplexityStrip items={[['Time', 'O(n²)', '#6F8F68'], ['Space', 'O(n²)', '#52745A']]} />
        </SectionCard>
        <SectionCard title="🧪 Sample Run" color="#6F8F68">
          <SampleIO color="#6F8F68" input={"(Stage-wise cost matrix)"} output={"Minimum Cost = (depends on input graph)"} />
        </SectionCard>
      </div>
    ),
  },
  {
    id: "dp-fundamentals", icon: "\ud83d\udcca", title: "Dynamic Programming \u2014 Fundamentals", color: "#52745A",
    tags: ["DP", "Theory", "Memoization"],
    render: () => <TheoryTopic color={"#52745A"} sections={[{"title": "What is DP?", "type": "text", "items": [["Definition:", "Dynamic Programming solves a problem by breaking it into subproblems and storing their results so the same work is not repeated."], ["Two Conditions:", "The problem should have optimal substructure and overlapping subproblems."]]}, {"title": "Important Terms", "type": "grid", "items": [["Memoization", "Top-down recursion with a table/cache for already solved states."], ["Tabulation", "Bottom-up filling of a table from smaller states to larger states."], ["Optimal Substructure", "An optimal solution can be built from optimal subproblem solutions."], ["Overlapping Subproblems", "The same subproblems occur repeatedly."]]}, {"title": "How to Design a DP", "type": "steps", "items": [["1", "Identify the state", "Decide what each dp entry represents."], ["2", "Find recurrence", "Express the current state using smaller states."], ["3", "Set base cases", "Initialize the smallest or boundary states."], ["4", "Choose evaluation order", "Fill states only after their dependencies are known."], ["5", "Read the answer", "The required state contains the final optimum."]]}]} complexity={[["Typical Time", "Number of states × transition cost", "#52745A"], ["Memory", "Number of stored states", "#5E7B59"]]} />,
  },
  {
    id: "knapsack-table", icon: "\ud83c\udf92", title: "0/1 Knapsack \u2014 DP Table", color: "#A3B18A",
    tags: ["DP", "Knapsack", "Recurrence"],
    render: () => <TheoryTopic color={"#A3B18A"} sections={[{"title": "Formula", "type": "text", "items": [["State:", "dp[i][w] represents the maximum value obtained using the first i items with capacity w."], ["Choice:", "For item i, either exclude it or include it if its weight fits."], ["Recurrence:", "dp[i][w] = max(dp[i−1][w], value[i] + dp[i−1][w−weight[i]]) when weight[i] ≤ w."], ["Base Case:", "dp[0][w] = 0 and dp[i][0] = 0."]]}, {"title": "Table Filling", "type": "steps", "items": [["1", "Create the table", "Rows represent items; columns represent capacities."], ["2", "Initialize zero row/column", "No items or zero capacity gives value 0."], ["3", "Check weight", "If the current item is too heavy, copy the previous row."], ["4", "Compare two choices", "Take the maximum of exclude and include cases."], ["5", "Final answer", "The optimum is stored in dp[n][W]."]]}, {"title": "Exam Points", "type": "grid", "items": [["0/1", "No item can be split."], ["State Count", "Approximately n×W states."], ["Advantage", "Guarantees the optimum for integer capacity/value formulation."], ["Optimization", "A 1-D array can reduce space to O(W)."]]}]} complexity={[["Time", "O(nW)", "#A3B18A"], ["2-D Space", "O(nW)", "#52745A"], ["1-D Space", "O(W)", "#6B8E63"]]} />,
  },
  {
    id: "floyd-warshall", icon: "\ud83d\udee3\ufe0f", title: "Floyd\u2013Warshall Algorithm", color: "#6F8F68",
    tags: ["DP", "All Pairs", "Shortest Path"],
    render: () => <TheoryTopic color={"#6F8F68"} sections={[{"title": "Concept", "type": "text", "items": [["Purpose:", "Floyd–Warshall finds shortest-path distances between every pair of vertices."], ["Idea:", "Gradually allow vertices 1...k to be used as intermediate vertices."], ["Recurrence:", "D[i][j] = min(D[i][j], D[i][k] + D[k][j])."], ["Initialization:", "D[i][i] = 0; direct edge weights are used for D[i][j]."]]}, {"title": "Algorithm Steps", "type": "steps", "items": [["1", "Initialize matrix", "Store direct edge costs and zero on the diagonal."], ["2", "Choose intermediate k", "Allow vertex k as a possible intermediate."], ["3", "Relax every pair", "Check whether i→k→j is cheaper than i→j."], ["4", "Repeat for every k", "After all k values, every shortest path is represented."]]}, {"title": "Important Notes", "type": "grid", "items": [["All-Pairs", "Finds distances for every source-destination pair."], ["Negative Edges", "Can handle negative edge weights."], ["Negative Cycle", "A negative diagonal value after processing indicates a negative cycle."], ["Not for negative cycle paths", "Distances become undefined when a reachable negative cycle exists."]]}]} complexity={[["Time", "O(V³)", "#6F8F68"], ["Space", "O(V²)", "#52745A"]]} />,
  },
  {
    id: "lcs", icon: "\ud83d\udd24", title: "Longest Common Subsequence (LCS)", color: "#66856A",
    tags: ["DP", "String", "LCS"],
    render: () => <TheoryTopic color={"#66856A"} sections={[{"title": "Concept", "type": "text", "items": [["Definition:", "LCS finds the longest sequence that appears in the same relative order in two strings, but not necessarily contiguously."], ["If characters match:", "dp[i][j] = 1 + dp[i−1][j−1]."], ["If they differ:", "dp[i][j] = max(dp[i−1][j], dp[i][j−1])."], ["Base Case:", "If either prefix length is zero, the LCS length is zero."]]}, {"title": "Method", "type": "steps", "items": [["1", "Create DP table", "Rows correspond to one string and columns to the other."], ["2", "Compare characters", "Match uses the diagonal state; mismatch uses the larger neighboring state."], ["3", "Fill bottom-up", "Continue until the complete strings are processed."], ["4", "Backtrack if needed", "Trace the table backwards to reconstruct the actual subsequence."]]}, {"title": "LCS vs Substring", "type": "grid", "items": [["Application", "File comparison and version-difference analysis."], ["Subsequence", "Characters need not be adjacent."], ["Substring", "Characters must be contiguous."], ["Output", "Can return either LCS length or the sequence itself."]]}]} complexity={[["Time", "O(mn)", "#66856A"], ["Space", "O(mn)", "#52745A"]]} />,
  },

];

// ══════════════════════════ UNIT 4 TOPICS (new — Backtracking & Branch-and-Bound) ══════════════════════════
const unit4Topics = [
  {
    id: 'graph-coloring', icon: '🎨', title: 'University Examination Seating Planner (Graph Coloring)', color: '#4A6B54',
    tags: ['Backtracking', 'Graph Coloring', 'm-Coloring'],
    render: () => (
      <div>
        <SectionCard title="📖 Problem Statement" color="#4A6B54">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9 }}>
            Subjects with overlapping students must never be scheduled in the same exam slot. Modeling subjects as graph nodes and conflicts as edges, we need the minimum number of slots (colors) so no two <strong style={{ color: '#4A6B54' }}>adjacent</strong> subjects share a slot — the m-Coloring problem.
          </p>
        </SectionCard>
        <SectionCard title="💡 Backtracking Approach" color="#4A6B54">
          <StepList color="#4A6B54" steps={[
            ['1', 'Try a color for the current subject', 'Starting from color 1 up to m, for subject/vertex v.'],
            ['2', "Check safety", 'A color is safe if no adjacent subject already uses it (checked via the conflict/adjacency matrix).'],
            ['3', 'Recurse or backtrack', 'If safe, assign it and recurse to the next subject; if the recursion fails, undo the assignment and try the next color.'],
          ]} />
          <InfoBox label="Why backtracking" text="There's no greedy shortcut that always finds the true minimum number of colors, so we systematically explore assignments and prune as soon as a conflict is detected." color="#4A6B54" />
        </SectionCard>
        <SectionCard title="💻 C++ Code" color="#4A6B54">
          <CodeBlock code={`#include <iostream>
using namespace std;
int g[20][20],color[20],n,m;
bool safe(int v,int c){
 for(int i=0;i<n;i++)
 if(g[v][i] && color[i]==c) return false;
 return true;
}
bool solve(int v){
 if(v==n) return true;
 for(int c=1;c<=m;c++){
 if(safe(v,c)){
 color[v]=c;
 if(solve(v+1)) return true;
 color[v]=0;
 }
 }
 return false;
}
int main(){
 cin>>n>>m;
 for(int i=0;i<n;i++)
 for(int j=0;j<n;j++) cin>>g[i][j];
 if(solve(0)){
 for(int i=0;i<n;i++)
 cout<<"Subject "<<i<<" -> Slot "<<color[i]<<endl;
 }else
 cout<<"No solution";
}`} />
        </SectionCard>
        <SectionCard title="📊 Complexity" color="#4A6B54">
          <ComplexityStrip items={[['Time (worst)', 'O(mⁿ)', '#4A6B54'], ['Space', 'O(n)', '#52745A']]} />
        </SectionCard>
        <SectionCard title="🧪 Sample Run" color="#4A6B54">
          <SampleIO color="#4A6B54" input={"(Conflict graph matrix and number of slots m)"} output={"Subject 0 -> Slot 1\nSubject 1 -> Slot 2\nSubject 2 -> Slot 1"} />
        </SectionCard>
      </div>
    ),
  },
  {
    id: 'tsp', icon: '🧳', title: 'International Salesperson Route Optimization (TSP)', color: '#35553F',
    tags: ['Backtracking', 'Branch & Bound', 'Permutations'],
    render: () => (
      <div>
        <SectionCard title="📖 Problem Statement" color="#35553F">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9 }}>
            A salesperson must visit every city exactly once and return to the start city, minimizing total travel cost — the classic <strong style={{ color: '#35553F' }}>Travelling Salesperson Problem</strong>.
          </p>
        </SectionCard>
        <SectionCard title="💡 Recursive Branch-and-Bound Approach" color="#35553F">
          <StepList color="#35553F" steps={[
            ['1', 'Start at city 0, mark it visited', 'Recursively try extending the current partial tour to every unvisited city.'],
            ['2', 'Track running sum', 'Add the edge cost as each new city is visited; keep a running count of cities visited so far.'],
            ['3', 'Close the tour and update the best', 'Once all n cities are visited, add the cost back to city 0 and update the global minimum ans if this tour is cheaper.'],
          ]} />
          <InfoBox label="Why branch and bound" text="Every full permutation of cities is a candidate tour, so the search explores all valid routes recursively; bounding (pruning) can be added to cut off partial tours already worse than the current best." color="#35553F" />
        </SectionCard>
        <SectionCard title="💻 C++ Code" color="#35553F">
          <CodeBlock code={`#include <iostream>
#include <climits>
using namespace std;
int cost[10][10],n,vis[10],ans=INT_MAX;
void tsp(int city,int cnt,int sum){
 if(cnt==n && cost[city][0]){
 ans=min(ans,sum+cost[city][0]);
 return; }
 for(int i=0;i<n;i++)
 if(!vis[i]&&cost[city][i]){
 vis[i]=1;
 tsp(i,cnt+1,sum+cost[city][i]);
 vis[i]=0;
 }
}
int main(){
 cin>>n;
 for(int i=0;i<n;i++)
 for(int j=0;j<n;j++) cin>>cost[i][j];
 vis[0]=1;
 tsp(0,1,0);
 cout<<"Minimum Travel Cost = "<<ans;
}`} />
        </SectionCard>
        <SectionCard title="📊 Complexity" color="#35553F">
          <ComplexityStrip items={[['Time (worst)', 'O(n!)', '#35553F'], ['Space', 'O(n)', '#52745A']]} />
        </SectionCard>
        <SectionCard title="🧪 Sample Run" color="#35553F">
          <SampleIO color="#35553F" input={"(City-to-city cost matrix)"} output={"Minimum Travel Cost = 80 (depends on input graph)"} />
        </SectionCard>
      </div>
    ),
  },
  {
    id: "backtracking-fundamentals", icon: "\u21a9\ufe0f", title: "Backtracking \u2014 Fundamentals", color: "#4A6B54",
    tags: ["Backtracking", "State Space"],
    render: () => <TheoryTopic color={"#4A6B54"} sections={[{"title": "What is Backtracking?", "type": "text", "items": [["Definition:", "Backtracking builds a candidate solution incrementally and abandons a partial candidate as soon as it cannot lead to a valid solution."], ["Core Idea:", "Choose → Check → Recurse → Undo."]]}, {"title": "Generic Procedure", "type": "steps", "items": [["1", "Choose", "Select one candidate for the current position."], ["2", "Check", "Test whether the partial solution is promising or safe."], ["3", "Explore", "Recurse to construct the next part."], ["4", "Undo", "Remove the current choice when the branch fails."], ["5", "Continue", "Try the next available candidate."]]}, {"title": "Key Terms", "type": "grid", "items": [["State Space Tree", "Represents all possible choices."], ["Pruning", "Cuts branches that cannot produce a valid answer."], ["Typical Problems", "N-Queens, Graph Coloring, Sum of Subsets."], ["Worst Case", "Often exponential because many combinations may be explored."]]}]} complexity={[["Worst Case", "Often exponential", "#4A6B54"], ["Auxiliary Space", "Usually O(depth)", "#52745A"]]} />,
  },
  {
    id: "n-queens", icon: "\u265b", title: "N-Queens Problem", color: "#A3B18A",
    tags: ["Backtracking", "N-Queens"],
    render: () => <TheoryTopic color={"#A3B18A"} sections={[{"title": "Concept", "type": "text", "items": [["Problem:", "Place N queens on an N×N chessboard so that no two queens attack each other."], ["Safety Conditions:", "No two queens may share the same column, diagonal, or row."], ["Backtracking:", "Place one queen row by row; if a position is unsafe, try the next column."]]}, {"title": "Algorithm Steps", "type": "steps", "items": [["1", "Start with row 0", "Try each column in the first row."], ["2", "Check safety", "Ensure the column and both diagonals contain no previously placed queen."], ["3", "Place queen", "Mark the position and recurse to the next row."], ["4", "Backtrack", "If no column works in a later row, remove the previous queen and try another position."], ["5", "Complete", "When all N rows are filled, one solution is found."]]}, {"title": "Safety Test", "type": "grid", "items": [["Same Column", "Reject if another queen is already there."], ["Main Diagonal", "For cells on the same diagonal, row−column is equal."], ["Other Diagonal", "For cells on the other diagonal, row+column is equal."], ["Use", "Classic example of state-space search."]]}]} complexity={[["Worst Case", "Exponential / commonly expressed O(N!)", "#4A6B54"], ["Recursion Depth", "O(N)", "#52745A"]]} />,
  },
  {
    id: "graph-coloring-theory", icon: "\ud83c\udfa8", title: "Graph Coloring \u2014 Theory", color: "#4A6B54",
    tags: ["Backtracking", "Graph Coloring"],
    render: () => <TheoryTopic color={"#4A6B54"} sections={[{"title": "Concept", "type": "text", "items": [["Definition:", "Graph coloring assigns colors to vertices so that adjacent vertices receive different colors."], ["m-Coloring:", "Determine whether a graph can be colored using at most m colors."], ["Scheduling Connection:", "Conflicting subjects can be represented as adjacent vertices, while colors represent exam slots."]]}, {"title": "Backtracking Process", "type": "steps", "items": [["1", "Select a vertex", "Process vertices one at a time."], ["2", "Try a color", "Consider colors from 1 to m."], ["3", "Check adjacent vertices", "The color is valid only when no adjacent colored vertex has the same color."], ["4", "Recurse", "Move to the next vertex."], ["5", "Backtrack", "Remove the color if later vertices cannot be assigned."]]}, {"title": "Mapping", "type": "grid", "items": [["Vertex", "Represents a subject/task."], ["Edge", "Represents a conflict."], ["Color", "Represents a time slot/resource."], ["Goal", "Use no more than m colors without conflicts."]]}]} complexity={[["Worst Case", "O(m^V)", "#4A6B54"], ["Space", "O(V)", "#52745A"]]} />,
  },
  {
    id: "branch-bound-fundamentals", icon: "\ud83c\udf3f", title: "Branch and Bound \u2014 Fundamentals", color: "#35553F",
    tags: ["Branch & Bound", "Optimization"],
    render: () => <TheoryTopic color={"#35553F"} sections={[{"title": "Concept", "type": "text", "items": [["Definition:", "Branch and Bound is an optimization technique that divides the solution space into branches and uses bounds to eliminate branches that cannot improve the best known solution."], ["Difference from Backtracking:", "Backtracking primarily prunes infeasible solutions; Branch and Bound also prunes solutions that cannot beat the current best objective value."]]}, {"title": "Process", "type": "steps", "items": [["1", "Branch", "Generate possible next decisions."], ["2", "Compute bound", "Estimate the best possible result obtainable from the partial solution."], ["3", "Compare with incumbent", "If the bound cannot beat the current best solution, prune the branch."], ["4", "Expand promising node", "Continue searching from the most useful remaining node."], ["5", "Update optimum", "Whenever a better complete solution is found, update the incumbent."]]}, {"title": "Terminology", "type": "grid", "items": [["Branch", "Split the problem into subproblems."], ["Bound", "Upper/lower estimate used for pruning."], ["Incumbent", "Best complete solution found so far."], ["Pruning", "Discard a branch that cannot improve the incumbent."]]}]} complexity={[["Worst Case", "Exponential", "#35553F"], ["Benefit", "Can greatly reduce practical search", "#6B8E63"]]} />,
  },
  {
    id: "tsp-dp", icon: "\ud83e\udded", title: "TSP \u2014 Dynamic Programming Idea", color: "#35553F",
    tags: ["TSP", "DP", "Optimization"],
    render: () => <TheoryTopic color={"#35553F"} sections={[{"title": "Concept", "type": "text", "items": [["Problem:", "Find a minimum-cost tour that visits every city exactly once and returns to the starting city."], ["DP Approach:", "Use a state containing the set of visited cities and the current city."], ["State:", "dp[mask][i] can represent the minimum cost of reaching city i after visiting the cities represented by mask."], ["Transition:", "Extend the tour to an unvisited city and add the corresponding travel cost."]]}, {"title": "Methods", "type": "grid", "items": [["Brute Force", "Enumerates tours and has factorial growth."], ["Branch & Bound", "Prunes expensive partial tours using bounds."], ["DP / Held-Karp", "Uses subset states to avoid repeating the same subproblems."], ["Use Case", "Route optimization and tour planning."]]}]} complexity={[["DP Time", "O(n²·2ⁿ)", "#35553F"], ["DP Space", "O(n·2ⁿ)", "#52745A"], ["Brute Force", "O(n!)", "#4A6B54"]]} />,
  },

];

// ══════════════════════════ UNIT 5 TOPICS (new — Graphs & Trees) ══════════════════════════
const unit5Topics = [
  {
    id: 'bfs-dfs', icon: '🔍', title: 'Social Media Friend Explorer (BFS & DFS)', color: '#66856A',
    tags: ['BFS', 'DFS', 'Queue', 'Recursion'],
    render: () => (
      <div>
        <SectionCard title="📖 Problem Statement" color="#66856A">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9 }}>
            A social network is modeled as an undirected graph where nodes are users and edges are friendships. Starting from one user, we want to explore all reachable friends — using both <strong style={{ color: '#66856A' }}>Breadth First Search</strong> and <strong style={{ color: '#66856A' }}>Depth First Search</strong>.
          </p>
        </SectionCard>
        <SectionCard title="💡 Traversal Strategies" color="#66856A">
          <StepList color="#66856A" steps={[
            ['1', 'BFS — explore level by level', 'Use a queue: visit the start node, push all its unvisited neighbors, then repeat for each dequeued node — friends-of-friends come out in order of distance.'],
            ['2', 'DFS — explore as deep as possible first', 'Use recursion (or a stack): visit a node, then immediately recurse into an unvisited neighbor before backtracking.'],
            ['3', 'Track visited nodes', 'Both traversals need a visited[] array so no user is processed twice, avoiding infinite loops in cyclic graphs.'],
          ]} />
          <InfoBox label="BFS vs DFS" text="BFS finds the shortest path (fewest hops) in an unweighted graph and explores broadly; DFS uses less memory in wide graphs and is natural for exploring one connection chain fully." color="#66856A" />
        </SectionCard>
        <SectionCard title="💻 C++ Code" color="#66856A">
          <CodeBlock code={`#include <iostream>
#include <vector>
#include <queue>
using namespace std;
vector<int> g[100]; bool vis[100];
void BFS(int s){
 queue<int> q; q.push(s); vis[s]=1;
 while(!q.empty()){
 int u=q.front(); q.pop();
 cout<<u<<" ";
 for(int v:g[u]) if(!vis[v]) vis[v]=1,q.push(v);
 }
}
void DFS(int u){
 vis[u]=1; cout<<u<<" ";
 for(int v:g[u]) if(!vis[v]) DFS(v);
}
int main(){
 int n,e,u,v,s;
 cin>>n>>e;
 while(e--){cin>>u>>v; g[u].push_back(v); g[v].push_back(u);}
 cin>>s;
 fill(vis,vis+n,false); cout<<"BFS: "; BFS(s);
 fill(vis,vis+n,false); cout<<"\\nDFS: "; DFS(s);
}`} />
        </SectionCard>
        <SectionCard title="📊 Complexity" color="#66856A">
          <ComplexityStrip items={[['BFS', 'O(V + E)', '#66856A'], ['DFS', 'O(V + E)', '#52745A'], ['Space', 'O(V)', '#A3B18A']]} />
        </SectionCard>
        <SectionCard title="🧪 Sample Run" color="#66856A">
          <SampleIO color="#66856A" input={"(Number of nodes, edges, edge list, start node)"} output={"BFS: 0 1 2 3 4\nDFS: 0 1 3 4 2"} />
        </SectionCard>
      </div>
    ),
  },
  {
    id: 'bst', icon: '🌳', title: 'Online Bookstore Search Engine (Binary Search Tree)', color: '#6B8E63',
    tags: ['Insert', 'Search', 'Delete', 'Inorder'],
    render: () => (
      <div>
        <SectionCard title="📖 Problem Statement" color="#6B8E63">
          <p style={{ color: '#173A29', fontSize: 13, lineHeight: 1.9 }}>
            An online bookstore catalogs books by ID so customers can quickly search, browse in sorted order, insert new arrivals, and remove out-of-stock titles — a natural fit for a <strong style={{ color: '#6B8E63' }}>Binary Search Tree</strong>.
          </p>
        </SectionCard>
        <SectionCard title="💡 BST Operations" color="#6B8E63">
          <StepList color="#6B8E63" steps={[
            ['1', 'Insert(k)', 'Go left if k is smaller than the current node, right if larger, until an empty spot is found — keeps the tree sorted.'],
            ['2', 'Search(k)', 'Same left/right comparison walk; returns the node if found or null once a leaf is passed.'],
            ['3', 'Inorder Display', 'Recursively visit left subtree, print node, then right subtree — always yields sorted (ascending) order.'],
            ['4', 'Delete(k)', 'Leaf: remove directly. One child: replace with that child. Two children: replace with the inorder successor (minimum of right subtree), then delete that successor.'],
          ]} />
          <InfoBox label="Why BST" text="Average-case operations run in O(log n) by halving the search space at each step, though a skewed (unbalanced) tree can degrade to O(n)." color="#6B8E63" />
        </SectionCard>
        <SectionCard title="💻 C++ Code" color="#6B8E63">
          <CodeBlock code={`#include <iostream>
using namespace std;
struct Node{int key; Node *l,*r; Node(int k){key=k;l=r=NULL;}};
Node* insert(Node* r,int k){
 if(!r) return new Node(k);
 if(k<r->key) r->l=insert(r->l,k);
 else if(k>r->key) r->r=insert(r->r,k);
 return r;
}
Node* search(Node* r,int k){
 if(!r||r->key==k) return r;
 return k<r->key?search(r->l,k):search(r->r,k);
}
Node* minNode(Node* r){while(r->l)r=r->l; return r;}
Node* del(Node* r,int k){ if(!r) return r;
 if(k<r->key) r->l=del(r->l,k);
 else if(k>r->key) r->r=del(r->r,k);
 else{
 if(!r->l) return r->r;
 if(!r->r) return r->l;
 Node* t=minNode(r->r); r->key=t->key; r->r=del(r->r,t->key);
 }
 return r;
}
void inorder(Node* r){if(r){inorder(r->l); cout<<r->key<<" "; inorder(r->r);}}
int main(){
 Node* root=NULL;
 root=insert(root,50); insert(root,30); insert(root,70); insert(root,20); insert(root,40);
 cout<<"Books: "; inorder(root);
 cout<<"\\nFound? "<<(search(root,40)?"Yes":"No");
 root=del(root,30);
 cout<<"\\nAfter Delete: "; inorder(root);
}`} />
        </SectionCard>
        <SectionCard title="📊 Complexity" color="#6B8E63">
          <ComplexityStrip items={[['Average', 'O(log n)', '#6B8E63'], ['Worst (skewed)', 'O(n)', '#4A6B54'], ['Space', 'O(n)', '#52745A']]} />
        </SectionCard>
        <SectionCard title="🧪 Sample Run" color="#6B8E63">
          <SampleIO color="#6B8E63" input={"(Insert keys: 50, 30, 70, 20, 40)"} output={"Books: 20 30 40 50 70\nFound? Yes\nAfter Delete: 20 40 50 70"} />
        </SectionCard>
      </div>
    ),
  },
  {
    id: "graph-terminology", icon: "\ud83d\udd78\ufe0f", title: "Graph Terminology", color: "#66856A",
    tags: ["Graph", "Vertices", "Edges"],
    render: () => <TheoryTopic color={"#66856A"} sections={[{"title": "Basic Terms", "type": "grid", "items": [["Vertex", "A node in a graph."], ["Edge", "A connection between two vertices."], ["Degree", "Number of edges incident on a vertex in an undirected graph."], ["Path", "A sequence of vertices connected by edges."], ["Cycle", "A path that starts and ends at the same vertex without repeating internal vertices."], ["Connected Graph", "Every pair of vertices has a path between them."]]}, {"title": "Types of Graphs", "type": "text", "items": [["Directed Graph:", "Edges have a direction."], ["Undirected Graph:", "Edges represent two-way connections."], ["Weighted Graph:", "Edges carry costs, distances, or weights."], ["Unweighted Graph:", "Edges do not carry numerical weights."]]}]} complexity={[["Adjacency Matrix", "O(V²) space", "#52745A"], ["Adjacency List", "O(V+E) space", "#6B8E63"]]} />,
  },
  {
    id: "bfs-theory", icon: "\ud83d\udd35", title: "BFS \u2014 Theory and Applications", color: "#66856A",
    tags: ["BFS", "Queue", "Traversal"],
    render: () => <TheoryTopic color={"#66856A"} sections={[{"title": "Concept", "type": "text", "items": [["Definition:", "Breadth First Search explores a graph level by level from a starting vertex."], ["Data Structure:", "A queue is used to process vertices in first-in-first-out order."], ["Visited Array:", "Prevents repeated processing and infinite traversal around cycles."]]}, {"title": "Algorithm Steps", "type": "steps", "items": [["1", "Choose source", "Mark the starting vertex visited and enqueue it."], ["2", "Remove front vertex", "Process the vertex at the front of the queue."], ["3", "Visit neighbors", "For each unvisited neighbor, mark it visited and enqueue it."], ["4", "Repeat", "Continue until the queue becomes empty."]]}, {"title": "Applications", "type": "grid", "items": [["Shortest Path", "Finds minimum number of edges from a source in an unweighted graph."], ["Level Order", "Naturally processes vertices by distance from the source."], ["Applications", "Social-network connections, broadcasting, web crawling."], ["Disconnected Graph", "Run BFS again from every unvisited vertex to cover the whole graph."]]}]} complexity={[["Time", "O(V+E) with adjacency list", "#66856A"], ["Space", "O(V)", "#52745A"]]} />,
  },
  {
    id: "dfs-theory", icon: "\ud83d\udd37", title: "DFS \u2014 Theory and Applications", color: "#52745A",
    tags: ["DFS", "Stack", "Recursion"],
    render: () => <TheoryTopic color={"#52745A"} sections={[{"title": "Concept", "type": "text", "items": [["Definition:", "Depth First Search explores as far as possible along one branch before backtracking."], ["Implementation:", "Can be implemented using recursion or an explicit stack."], ["Visited Array:", "Ensures each reachable vertex is processed once."]]}, {"title": "Algorithm Steps", "type": "steps", "items": [["1", "Choose source", "Mark the starting vertex visited."], ["2", "Process vertex", "Perform the required operation on the current vertex."], ["3", "Choose unvisited neighbor", "Move deeper into the graph."], ["4", "Backtrack", "When no unvisited neighbor remains, return to the previous vertex."], ["5", "Repeat", "Continue until all reachable vertices are visited."]]}, {"title": "Applications", "type": "grid", "items": [["Cycle Detection", "Useful for detecting cycles with suitable visited/state tracking."], ["Topological Sort", "DFS finishing times can be used for DAG topological ordering."], ["Connected Components", "Run DFS from each unvisited vertex."], ["Maze Solving", "Naturally explores one possible route deeply."]]}]} complexity={[["Time", "O(V+E) with adjacency list", "#52745A"], ["Space", "O(V)", "#A3B18A"]]} />,
  },
  {
    id: "bfs-vs-dfs", icon: "\u2696\ufe0f", title: "BFS vs DFS \u2014 Exam Comparison", color: "#6F8F68",
    tags: ["BFS", "DFS", "Comparison"],
    render: () => <TheoryTopic color={"#6F8F68"} sections={[{"title": "Direct Comparison", "type": "grid", "items": [["Traversal", "BFS → level by level; DFS → depth first."], ["Data Structure", "BFS → Queue; DFS → Stack/Recursion."], ["Shortest Path", "BFS is suitable for unweighted shortest path."], ["Memory", "BFS can store a wide frontier; DFS stores a path/stack."], ["Backtracking", "DFS naturally supports backtracking."], ["Complexity", "Both are O(V+E) with adjacency lists."]]}, {"title": "Quick Memory Trick", "type": "text", "items": [["Remember:", "BFS = Breadth = Queue. DFS = Depth = Stack."], ["Exam Tip:", "For shortest path in an unweighted graph, prefer BFS; for deep exploration, cycle checks, and topological ordering, DFS is commonly used."]]}]} complexity={[["BFS", "O(V+E)", "#66856A"], ["DFS", "O(V+E)", "#52745A"]]} />,
  },
  {
    id: "bst-theory", icon: "\ud83c\udf33", title: "Binary Search Tree \u2014 Detailed Theory", color: "#6B8E63",
    tags: ["BST", "Tree", "Search"],
    render: () => <TheoryTopic color={"#6B8E63"} sections={[{"title": "Concept", "type": "text", "items": [["Definition:", "A Binary Search Tree is a binary tree in which keys in the left subtree are smaller than the node key and keys in the right subtree are larger, under the usual unique-key convention."], ["Main Advantage:", "The ordering property makes search, insertion, and deletion efficient when the tree remains balanced."]]}, {"title": "Operations", "type": "steps", "items": [["1", "Search", "Compare the target with the current node and move left or right."], ["2", "Insert", "Follow the same comparison rule until an empty child position is found."], ["3", "Delete leaf", "Remove the node directly."], ["4", "Delete one-child node", "Replace the node by its only child."], ["5", "Delete two-child node", "Replace the node by its inorder successor or predecessor, then delete that replacement node."]]}, {"title": "Traversal and Shape", "type": "grid", "items": [["Inorder", "Produces keys in sorted ascending order."], ["Preorder", "Root → Left → Right."], ["Postorder", "Left → Right → Root."], ["Balanced BST", "Height is O(log n), giving efficient operations."], ["Skewed BST", "Height can become O(n), degrading operations."]]}]} complexity={[["Average Search", "O(log n)", "#6B8E63"], ["Worst Search", "O(n)", "#4A6B54"], ["Insert/Delete Average", "O(log n)", "#5E7B59"], ["Inorder Traversal", "O(n)", "#52745A"]]} />,
  },

];

// ══════════════════════════ ALL UNITS ══════════════════════════
const units = [
  { id: 1, label: 'Unit 1', subtitle: 'Introduction · Asymptotic Analysis · Divide and Conquer · Heap Sort', topics: unit1Topics },
  { id: 2, label: 'Unit 2', subtitle: 'Greedy Method — Optimal Merge Pattern · Minimum Spanning Tree', topics: unit2Topics },
  { id: 3, label: 'Unit 3', subtitle: 'Dynamic Programming — 0/1 Knapsack · Multistage Graph', topics: unit3Topics },
  { id: 4, label: 'Unit 4', subtitle: 'Backtracking & Branch-and-Bound — Graph Coloring · TSP', topics: unit4Topics },
  { id: 5, label: 'Unit 5', subtitle: 'Graphs & Trees — BFS/DFS · Binary Search Tree', topics: unit5Topics },
];

export default function Notes() {
  const params = new URLSearchParams(window.location.search);
  const requestedUnit = Number(params.get('unit'));
  const requestedTopic = params.get('topic');

  const initialUnit =
    Number.isInteger(requestedUnit) && requestedUnit >= 1 && requestedUnit <= 5
      ? requestedUnit
      : 1;

  const [selectedUnitId, setSelectedUnitId] = useState(initialUnit);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const activeUnit = units.find(u => u.id === selectedUnitId) || units[0];

  useEffect(() => {
    if (!requestedTopic) return;

    const targetUnit = units.find(u => u.id === initialUnit);
    const targetTopic = targetUnit?.topics.find(t => t.id === requestedTopic);

    if (targetTopic) {
      setSelectedTopic(targetTopic);
      setTimeout(() => {
        document.getElementById('selected-note-topic')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
    }
  }, [initialUnit, requestedTopic]);

  const handleUnitSelect = (unitId) => {
    setSelectedUnitId(unitId);
    setSelectedTopic(null);
  };

  return (
    <div style={{ backgroundColor: '#E6E1D5', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ textAlign: 'center', padding: '60px 20px 40px', background: 'linear-gradient(180deg, #D7D2BD 0%, #EEEADF 100%)', borderBottom: '1px solid rgba(23,58,41,0.18)' }}>
        <div style={{ display: 'inline-block', background: 'rgba(23,58,41,0.08)', border: '1px solid rgba(23,58,41,0.22)', color: '#173A29', padding: '6px 16px', borderRadius: 20, fontSize: 13, marginBottom: 16 }}>📖 Study Notes</div>
        <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 800, marginBottom: 10 }}>ADA <span style={{ color: '#173A29', textShadow: 'none' }}>Notes</span></h1>
        <p style={{ color: '#3F4B43', fontSize: '1rem' }}>Complete {activeUnit.label} — RGPV CS-402 · Analysis and Design of Algorithm</p>
        <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['B.Tech 4th Sem', 'CS-402', `${activeUnit.topics.length} Topics`, 'RGPV Syllabus'].map(t => (
            <span key={t} style={{ background: 'rgba(23,58,41,0.07)', border: '1px solid rgba(23,58,41,0.20)', color: '#173A29', padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* UNIT TABS — new, lets you switch between Units 1–5 */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', padding: '20px 40px', borderBottom: '1px solid rgba(23,58,41,0.14)' }}>
        {units.map(unit => (
          <button
            key={unit.id}
            onClick={() => handleUnitSelect(unit.id)}
            style={{
              padding: '8px 18px',
              borderRadius: 12,
              border: `1px solid ${selectedUnitId === unit.id ? '#173A29' : 'rgba(23,58,41,0.22)'}`,
              background: selectedUnitId === unit.id ? '#173A29' : 'rgba(23,58,41,0.06)',
              color: selectedUnitId === unit.id ? 'white' : '#173A29',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.25s',
            }}
          >
            {unit.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 40px', borderBottom: '1px solid rgba(23,58,41,0.14)' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#5E7B59', flexShrink: 0 }} />
        <span style={{ color: '#173A29', fontWeight: 700, fontSize: '1rem', flex: 1 }}>{activeUnit.label} — {activeUnit.subtitle}</span>
        <span style={{ color: '#173A29', fontSize: 13, background: 'rgba(23,58,41,0.10)', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(23,58,41,0.20)' }}>{activeUnit.topics.length} topics</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: '28px 40px' }}>
        {activeUnit.topics.map(topic => (
          <div key={topic.id} onClick={() => setSelectedTopic(selectedTopic?.id === topic.id ? null : topic)}
            style={{ background: '#173A29', border: `1px solid ${selectedTopic?.id === topic.id ? '#A3B18A' : 'rgba(163,177,138,0.35)'}`, borderRadius: 20, padding: 22, width: 190, cursor: 'pointer', transition: 'all 0.3s', boxShadow: selectedTopic?.id === topic.id ? '0 0 30px rgba(163,177,138,0.28)' : '0 8px 20px rgba(23,58,41,0.12)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ width: 50, height: 50, borderRadius: 13, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{topic.icon}</div>
            <h3 style={{ color: '#F3F0E8', fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{topic.title}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {topic.tags.map(tag => <span key={tag} style={{ background: 'rgba(23,58,41,0.08)', border: '1px solid rgba(23,58,41,0.20)', color: '#F3F0E8', padding: '2px 7px', borderRadius: 10, fontSize: 10 }}>{tag}</span>)}
            </div>
            <div style={{ color: '#F3F0E8', fontSize: 11, fontWeight: 600, marginTop: 'auto' }}>
              {selectedTopic?.id === topic.id ? '▲ Close' : '▼ Open'}
            </div>
          </div>
        ))}
      </div>
      {selectedTopic && (
        <div id="selected-note-topic" style={{ margin: '0 40px 40px', background: 'rgba(94,123,89,0.04)', border: '1px solid rgba(94,123,89,0.20)', borderRadius: 20, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(23,58,41,0.18)' }}>
            <span style={{ fontSize: '1.6rem' }}>{selectedTopic.icon}</span>
            <h2 style={{ color: '#173A29', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{selectedTopic.title}</h2>
            <span style={{ marginLeft: 'auto', color: selectedTopic.color, fontSize: 12, background: `${selectedTopic.color}22`, padding: '4px 12px', borderRadius: 20, border: `1px solid ${selectedTopic.color}44` }}>CS-402 {activeUnit.label}</span>
          </div>
          {selectedTopic.render()}
        </div>
      )}
    </div>
  );
}
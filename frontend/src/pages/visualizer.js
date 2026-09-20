import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Color helpers ────────────────────────────────────────
const BAR_DEFAULT   = 'linear-gradient(180deg, #18392B, #18392B)';
const BAR_COMPARING = 'linear-gradient(180deg, #A3B18A, #3A5A40)';
const BAR_SWAPPING  = 'linear-gradient(180deg, #6E5340, #566061)';
const BAR_SORTED    = 'linear-gradient(180deg, #3A5A40, #344E41)';
const BAR_PIVOT     = 'linear-gradient(180deg, #6E5340, #566061)';
const BAR_FOUND     = 'linear-gradient(180deg, #3A5A40, #344E41)';
const BAR_SEARCHING = 'linear-gradient(180deg, #A3B18A, #3A5A40)';
const BAR_DISCARDED = 'linear-gradient(180deg, #566061, #566061)';

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

function* heapSortGen(arr) {
  const a = [...arr];
  const n = a.length;

  function* heapify(size, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      yield { array: [...a], comparing: [root, left], heapSize: size };
      if (a[left] > a[largest]) largest = left;
    }

    if (right < size) {
      yield { array: [...a], comparing: [largest, right], heapSize: size };
      if (a[right] > a[largest]) largest = right;
    }

    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];
      yield { array: [...a], swapping: [root, largest], heapSize: size };
      yield* heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    yield {
      array: [...a],
      swapping: [0, end],
      sorted: Array.from({ length: n - end }, (_, k) => end + k),
      heapSize: end
    };
    yield* heapify(end, 0);
  }

  yield {
    array: [...a],
    sorted: Array.from({ length: n }, (_, k) => k),
    done: true
  };
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

// ─── Unit 2–5 algorithm generators ──────────────────────────
// These use small, deterministic examples so every algorithm can be
// visualized step-by-step without requiring a second graph/table editor.

const EXTRA_ALGORITHMS = [
  { id:'heap-sort', name:'Heap Sort', category:'Unit 1 · Heap & Sorting', description:'Build a max heap and repeatedly extract the maximum element to sort the array in place.', time_best:'O(n log n)', time_avg:'O(n log n)', time_worst:'O(n log n)', space:'O(1)' },
  { id:'optimal-merge', name:'Optimal Merge Pattern', category:'Unit 2 · Greedy', description:'Repeatedly merge the two smallest files to minimize total merge cost.', time_best:'O(n log n)', time_avg:'O(n log n)', time_worst:'O(n log n)', space:'O(n)' },
  { id:'prim-mst', name:"Prim's MST", category:'Unit 2 · Greedy', description:'Build a minimum spanning tree by repeatedly choosing the cheapest edge from the visited set.', time_best:'O(V²)', time_avg:'O(V²)', time_worst:'O(V²)', space:'O(V)' },
  { id:'knapsack', name:'0/1 Knapsack', category:'Unit 3 · DP', description:'Use dynamic programming to maximize value without exceeding the capacity.', time_best:'O(nW)', time_avg:'O(nW)', time_worst:'O(nW)', space:'O(nW)' },
  { id:'multistage', name:'Multistage Graph', category:'Unit 3 · DP', description:'Compute the minimum-cost path from the first stage to the last stage using dynamic programming.', time_best:'O(E)', time_avg:'O(E)', time_worst:'O(E)', space:'O(V)' },
  { id:'graph-coloring', name:'Graph Coloring', category:'Unit 4 · Backtracking', description:'Assign colors to vertices so adjacent vertices never share the same color.', time_best:'O(m^V)', time_avg:'O(m^V)', time_worst:'O(m^V)', space:'O(V)' },
  { id:'tsp', name:'Travelling Salesman Problem', category:'Unit 4 · Branch & Bound', description:'Explore feasible tours and keep the minimum Hamiltonian cycle cost.', time_best:'O(n!)', time_avg:'O(n!)', time_worst:'O(n!)', space:'O(n)' },
  { id:'bfs', name:'Breadth First Search', category:'Unit 5 · Graph', description:'Visit a graph level-by-level using a queue.', time_best:'O(V+E)', time_avg:'O(V+E)', time_worst:'O(V+E)', space:'O(V)' },
  { id:'dfs', name:'Depth First Search', category:'Unit 5 · Graph', description:'Explore as deeply as possible before backtracking using recursion/stack.', time_best:'O(V+E)', time_avg:'O(V+E)', time_worst:'O(V+E)', space:'O(V)' },
  { id:'bst', name:'Binary Search Tree', category:'Unit 5 · Tree', description:'Demonstrate BST insertion, search, inorder traversal and deletion.', time_best:'O(log n)', time_avg:'O(log n)', time_worst:'O(n)', space:'O(n)' },
];

function* optimalMergeGen(input) {
  let heap = [...(input.length >= 4 ? input.slice(0,4) : [10,20,30,40])].sort((a,b)=>a-b);
  let total = 0;
  while (heap.length > 1) {
    yield { type:'merge', heap:[...heap], pair:[heap[0],heap[1]], total };
    const sum = heap[0] + heap[1];
    total += sum;
    heap = heap.slice(2);
    heap.push(sum);
    heap.sort((a,b)=>a-b);
    yield { type:'merge', heap:[...heap], merged:sum, total };
  }
  yield { type:'merge', heap:[...heap], total, done:true };
}

const PRIM_GRAPH = [
  [0,2,3,0,0], [2,0,1,4,0], [3,1,0,5,6],
  [0,4,5,0,2], [0,0,6,2,0]
];

function* primMstGen() {
  const n=PRIM_GRAPH.length, visited=[0], edges=[];
  let total=0;
  while(edges.length<n-1){
    let best=null;
    for(const u of visited) for(let v=0;v<n;v++){
      const w=PRIM_GRAPH[u][v];
      if(w && !visited.includes(v) && (!best || w<best.w)) best={u,v,w};
    }
    if(!best) break;
    visited.push(best.v); edges.push(best); total+=best.w;
    yield {type:'prim', visited:[...visited], edges:[...edges], active:best, total};
  }
  yield {type:'prim', visited:[...visited], edges:[...edges], total, done:true};
}

function* knapsackGen() {
  const weights=[10,20,30], values=[60,100,120], W=50;
  const dp=Array.from({length:4},()=>Array(W+1).fill(0));
  for(let i=1;i<=3;i++){
    for(let w=0;w<=W;w++){
      dp[i][w]=w>=weights[i-1] ? Math.max(dp[i-1][w],values[i-1]+dp[i-1][w-weights[i-1]]) : dp[i-1][w];
      if(w%10===0) yield {type:'knapsack',dp:dp.map(r=>[...r]),item:i,capacity:w,weights,values,best:dp[i][w]};
    }
  }
  yield {type:'knapsack',dp:dp.map(r=>[...r]),item:3,capacity:W,weights,values,best:dp[3][W],done:true};
}

const MULTI_GRAPH = [
  {u:0,v:1,w:2},{u:0,v:2,w:1},{u:1,v:3,w:2},{u:1,v:4,w:3},
  {u:2,v:3,w:5},{u:2,v:4,w:2},{u:3,v:5,w:2},{u:4,v:5,w:3}
];

function* multistageGen(){
  const n=6, dist=Array(n).fill(Infinity), next=Array(n).fill(null);
  dist[5]=0;
  for(let u=n-2;u>=0;u--){
    const outgoing=MULTI_GRAPH.filter(e=>e.u===u);
    for(const e of outgoing){
      const candidate=e.w+dist[e.v];
      if(candidate<dist[u]){dist[u]=candidate;next[u]=e.v;}
      yield {type:'multistage',dist:[...dist],active:e,next:[...next]};
    }
  }
  const path=[]; let cur=0;
  while(cur!==null && cur<n){path.push(cur);cur=next[cur]; if(path.length>n)break;}
  yield {type:'multistage',dist:[...dist],next:[...next],path,total:dist[0],done:true};
}

function* graphColoringGen(){
  const g=[[0,1,1,1,0],[1,0,1,0,1],[1,1,0,1,1],[1,0,1,0,1],[0,1,1,1,0]];
  const colors=Array(5).fill(0), m=3;
  function safe(v,c){for(let u=0;u<5;u++)if(g[v][u]&&colors[u]===c)return false;return true;}
  function* solve(v){
    if(v===5){yield {type:'coloring',colors:[...colors],vertex:v-1,done:true};return true;}
    for(let c=1;c<=m;c++){
      yield {type:'coloring',colors:[...colors],vertex:v,trying:c};
      if(safe(v,c)){
        colors[v]=c; yield {type:'coloring',colors:[...colors],vertex:v,accepted:c};
        const child=solve(v+1);
        for(const s of child){yield s;if(s.done)return true;}
        colors[v]=0; yield {type:'coloring',colors:[...colors],vertex:v,backtrack:true};
      }
    }
    return false;
  }
  yield* solve(0);
}

const TSP_GRAPH=[
  [0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]
];

function* tspGen(){
  const n=4, used=[true,false,false,false], path=[0];
  let best=Infinity,bestPath=[];
  function* search(){
    if(path.length===n){
      const total=path.reduce((s,u,i)=>i?s+TSP_GRAPH[path[i-1]][u]:0,0)+TSP_GRAPH[path[n-1]][0];
      yield {type:'tsp',path:[...path,0],currentCost:total,best,bestPath:[...bestPath]};
      if(total<best){best=total;bestPath=[...path,0];yield {type:'tsp',path:[...path,0],currentCost:total,best,bestPath:[...bestPath],improved:true};}
      return;
    }
    for(let v=1;v<n;v++) if(!used[v]){
      used[v]=true; path.push(v);
      yield* search();
      path.pop(); used[v]=false;
    }
  }
  yield* search();
  yield {type:'tsp',path:bestPath,currentCost:best,best,bestPath,done:true};
}

const GRAPH = [[1,2],[0,3,4],[0,3,4],[1,2,4],[1,2,3]];

function* bfsGen(){
  const visited=Array(5).fill(false), q=[0], order=[];
  visited[0]=true;
  while(q.length){
    const u=q.shift(); order.push(u);
    yield {type:'bfs',visited:[...visited],queue:[...q],current:u,order:[...order]};
    for(const v of GRAPH[u]) if(!visited[v]){visited[v]=true;q.push(v);yield {type:'bfs',visited:[...visited],queue:[...q],current:u,order:[...order],discover:v};}
  }
  yield {type:'bfs',visited:[...visited],queue:[],order:[...order],done:true};
}

function* dfsGen(){
  const visited=Array(5).fill(false), order=[];
  function* visit(u){
    visited[u]=true;order.push(u);
    yield {type:'dfs',visited:[...visited],current:u,order:[...order]};
    for(const v of GRAPH[u]) if(!visited[v]) yield* visit(v);
    yield {type:'dfs',visited:[...visited],current:u,order:[...order],backtrack:true};
  }
  yield* visit(0);
  yield {type:'dfs',visited:[...visited],order:[...order],done:true};
}

function* bstGen(){
  let root=null;
  const ops=[50,30,70,20,40,60,80];
  function insert(node,key){if(!node)return {key,left:null,right:null};if(key<node.key)node.left=insert(node.left,key);else if(key>node.key)node.right=insert(node.right,key);return node;}
  function clone(n){return n?{key:n.key,left:clone(n.left),right:clone(n.right)}:null;}
  for(const key of ops){root=insert(root,key);yield {type:'bst',root:clone(root),operation:`Insert ${key}`};}
  const target=40;let cur=root;
  while(cur){yield {type:'bst',root:clone(root),operation:`Search ${target}`,search:cur.key};if(cur.key===target)break;cur=target<cur.key?cur.left:cur.right;}
  function minNode(n){while(n.left)n=n.left;return n;}
  function del(n,key){if(!n)return n;if(key<n.key)n.left=del(n.left,key);else if(key>n.key)n.right=del(n.right,key);else{if(!n.left)return n.right;if(!n.right)return n.left;const t=minNode(n.right);n.key=t.key;n.right=del(n.right,t.key);}return n;}
  root=del(root,30);
  yield {type:'bst',root:clone(root),operation:'Delete 30',done:true};
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
        color: '#000000',
        fontWeight: '600',
      }}>{value}</div>
      <div style={{
        width: `${width}px`,
        height: `${heightPct}%`,
        background: bg,
        borderRadius: '6px 6px 2px 2px',
        transition: 'height 0.15s ease, background 0.15s ease',
        boxShadow: state !== 'default'
          ? '0 0 12px rgba(52,78,65,0.6)'
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


function GraphScene({ step }) {
  const nodes = [0,1,2,3,4];
  const positions = [[15,50],[38,20],[38,80],[70,25],[70,75]];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,3],[2,4],[3,4]];
  const visited = step.visited || [];
  const order = step.order || [];
  return (
    <div style={S.scene}>
      <div style={S.sceneTitle}>{step.type === 'bfs' ? 'BFS — Queue / Level Order' : step.type === 'dfs' ? 'DFS — Depth First Traversal' : 'Graph Traversal'}</div>
      <div style={S.graphWrap}>
        <svg viewBox="0 0 100 100" style={{width:'100%',height:'260px',maxWidth:'560px'}}>
          {edges.map(([a,b],i)=><line key={i} x1={positions[a][0]} y1={positions[a][1]} x2={positions[b][0]} y2={positions[b][1]} stroke="rgba(58,90,64,.35)" strokeWidth="1.2"/>)}
          {nodes.map(n=><g key={n}>
            <circle cx={positions[n][0]} cy={positions[n][1]} r="7" fill={step.current===n?'#A3B18A':visited[n]?'#3A5A40':'#344E41'} stroke="#3A5A40" strokeWidth="1.2"/>
            <text x={positions[n][0]} y={positions[n][1]+1.5} textAnchor="middle" fontSize="6" fill="white">{n}</text>
          </g>)}
        </svg>
      </div>
      <div style={S.tokenRow}><b>Visited:</b> {visited.map((v,i)=>v?<span key={i} style={S.token}>{i}</span>:null)} </div>
      <div style={S.tokenRow}><b>Order:</b> {order.map((v,i)=><span key={i} style={S.token}>{i+':'+v}</span>)}</div>
      {step.queue && <div style={S.tokenRow}><b>Queue:</b> {step.queue.length ? step.queue.map((v,i)=><span key={i} style={S.token}>{v}</span>) : ' empty'}</div>}
      {step.backtrack && <div style={S.sceneNote}>↩ Backtracking from vertex {step.current}</div>}
    </div>
  );
}

function TableScene({ step }) {
  if (step.type === 'bfs' || step.type === 'dfs') return <GraphScene step={step} />;
  if (step.type === 'merge') return (
    <div style={S.scene}>
      <div style={S.sceneTitle}>Optimal Merge Pattern — Min Heap</div>
      <div style={S.heapRow}>{step.heap.map((v,i)=><div key={i} style={{...S.heapBox, ...(step.pair?.includes(v)?S.heapActive:{})}}>{v}</div>)}</div>
      {step.pair && <div style={S.sceneNote}>Merge two smallest: <b>{step.pair[0]} + {step.pair[1]} = {step.pair[0]+step.pair[1]}</b></div>}
      <div style={S.totalBox}>Total merge cost: <b>{step.total}</b></div>
      {step.merged && <div style={S.sceneNote}>Inserted merged file <b>{step.merged}</b> back into the min-heap.</div>}
    </div>
  );

  if (step.type === 'prim') return (
    <div style={S.scene}>
      <div style={S.sceneTitle}>Prim's Algorithm — Minimum Spanning Tree</div>
      <div style={S.tokenRow}><b>Visited:</b> {step.visited.map(v=><span key={v} style={S.token}>{v}</span>)}</div>
      <div style={S.edgeList}>{step.edges.map((e,i)=><div key={i} style={S.edgeRow}><span>Edge {i+1}</span><b>{e.u} — {e.v}</b><span>weight = {e.w}</span></div>)}</div>
      {step.active && <div style={S.sceneNote}>Selected minimum crossing edge: <b>{step.active.u} — {step.active.v}</b> (weight {step.active.w})</div>}
      <div style={S.totalBox}>MST total cost: <b>{step.total}</b> / Need {4} edges</div>
    </div>
  );

  if (step.type === 'knapsack') {
    const rows=step.dp||[];
    return <div style={S.scene}>
      <div style={S.sceneTitle}>0/1 Knapsack — DP Table</div>
      <div style={S.itemRow}>{step.weights.map((w,i)=><span key={i} style={S.itemChip}>Item {i+1}: W={w}, V={step.values[i]}</span>)}</div>
      <div style={S.tableScroll}><table style={S.dpTable}><thead><tr><th>Item ↓ / Cap →</th>{[0,10,20,30,40,50].map(w=><th key={w}>{w}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}><th>{i}</th>{[0,10,20,30,40,50].map(w=><td key={w} style={i===step.item&&w===step.capacity?S.cellActive:{}}>{r[w]}</td>)}</tr>)}</tbody></table></div>
      <div style={S.totalBox}>Current best value: <b>{step.best}</b> &nbsp; Capacity: <b>{step.capacity}</b></div>
    </div>;
  }

  if (step.type === 'multistage') return (
    <div style={S.scene}>
      <div style={S.sceneTitle}>Multistage Graph — Minimum Cost DP</div>
      <div style={S.stageRow}>{step.dist.map((d,i)=><div key={i} style={{...S.stageBox, ...(step.active?.u===i?S.boxActive:{})}}><b>V{i}</b><span>{Number.isFinite(d)?d:'∞'}</span></div>)}</div>
      {step.active && <div style={S.sceneNote}>Relax edge <b>{step.active.u} → {step.active.v}</b> with cost {step.active.w}</div>}
      {step.path && <div style={S.totalBox}>Optimal path: <b>{step.path.join(' → ')}</b> &nbsp; Minimum cost: <b>{step.total}</b></div>}
    </div>
  );

  if (step.type === 'coloring') return (
    <div style={S.scene}>
      <div style={S.sceneTitle}>Graph Coloring — Backtracking</div>
      <div style={S.colorNodes}>{step.colors.map((c,i)=><div key={i} style={{...S.colorNode, borderColor:c?'#344E41':'#566061', background:c?'rgba(24,57,43,.25)':'rgba(0,0,0,.25)'}}><b>V{i}</b><span>{c||'—'}</span></div>)}</div>
      <div style={S.sceneNote}>{step.backtrack ? `↩ Backtrack from V${step.vertex}` : step.accepted ? `✓ Assign color ${step.accepted} to V${step.vertex}` : step.trying ? `Try color ${step.trying} for V${step.vertex}` : step.done ? 'Valid coloring found!' : 'Checking colors...'}</div>
      <div style={S.totalBox}>Colors available: <b>3</b></div>
    </div>
  );

  if (step.type === 'tsp') return (
    <div style={S.scene}>
      <div style={S.sceneTitle}>Travelling Salesman Problem — Branch & Bound Style Search</div>
      <div style={S.routeBox}>{step.path?.length ? step.path.join(' → ') : 'Searching...'}</div>
      <div style={S.sceneNote}>Current tour cost: <b>{step.currentCost ?? '—'}</b></div>
      <div style={S.totalBox}>Best tour: <b>{step.bestPath?.length ? step.bestPath.join(' → ') : '—'}</b> &nbsp; Best cost: <b>{Number.isFinite(step.best)?step.best:'—'}</b></div>
    </div>
  );

  if (step.type === 'bst') return (
    <div style={S.scene}>
      <div style={S.sceneTitle}>Binary Search Tree — {step.operation}</div>
      <div style={S.bstWrap}>
        <BSTNode node={step.root} depth={0} />
      </div>
      {step.search !== undefined && <div style={S.sceneNote}>Searching node <b>{step.search}</b>...</div>}
      {step.done && <div style={S.totalBox}>✓ Operation complete — inorder sequence remains a sorted order.</div>}
    </div>
  );
  return null;
}

function BSTNode({ node, depth=0 }) {
  if (!node) return null;
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
      <div style={S.bstCircle}>{node.key}</div>
      {(node.left||node.right) && <div style={{display:'flex',gap:28,alignItems:'flex-start'}}>
        <div style={{minWidth:55}}>{node.left ? <BSTNode node={node.left} depth={depth+1}/> : <span style={S.emptyNode}>∅</span>}</div>
        <div style={{minWidth:55}}>{node.right ? <BSTNode node={node.right} depth={depth+1}/> : <span style={S.emptyNode}>∅</span>}</div>
      </div>}
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
      .then(data => {
        const byId = new Map(EXTRA_ALGORITHMS.map(a => [a.id, a]));
        data.forEach(a => byId.set(a.id, { ...byId.get(a.id), ...a }));
        const merged = Array.from(byId.values());
        setAlgorithms(merged);

        const requestedId = new URLSearchParams(window.location.search).get('algo');
        const requestedAlgo = requestedId
          ? merged.find(a => a.id === requestedId)
          : null;

        setSelectedAlgo(requestedAlgo || merged[0]);
      })
      .catch(() => {
        setAlgorithms(EXTRA_ALGORITHMS);
        setSelectedAlgo(EXTRA_ALGORITHMS[0]);
      });
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
    if (id === 'heap-sort') return heapSortGen(array);
    if (id === 'merge-sort') return mergeSortGen(array);
    if (id === 'quick-sort') return quickSortGen(array);
    if (id === 'binary-search') {
      const t = parseInt(searchTarget);
      if (isNaN(t)) { alert('Enter a valid search target!'); return null; }
      return binarySearchGen(array, t);
    }
    if (id === 'optimal-merge') return optimalMergeGen(array);
    if (id === 'prim-mst') return primMstGen();
    if (id === 'knapsack') return knapsackGen();
    if (id === 'multistage') return multistageGen();
    if (id === 'graph-coloring') return graphColoringGen();
    if (id === 'tsp') return tspGen();
    if (id === 'bfs') return bfsGen();
    if (id === 'dfs') return dfsGen();
    if (id === 'bst') return bstGen();
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
                { color: '#18392B', label: 'Default' },
                { color: '#A3B18A', label: 'Comparing' },
                { color: '#6E5340', label: 'Swapping' },
                { color: '#3A5A40', label: 'Sorted / Found' },
                { color: '#6E5340', label: 'Pivot' },
                { color: '#566061', label: 'Discarded' },
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
                <span style={{ ...S.statVal, color: isDone ? '#3A5A40' : isPlaying ? '#A3B18A' : '#344E41' }}>
                  {isDone ? 'Done' : isPlaying ? 'Running' : 'Ready'}
                </span>
                <span style={S.statLbl}>Status</span>
              </div>
            </div>

          </div>

          {/* Visualization area */}
          <div style={S.vizArea}>
            {currentStep?.type ? (
              <TableScene step={currentStep} />
            ) : (
              <>
                {currentStep?.notFound && <div style={S.notFoundMsg}>❌ Element not found in array</div>}
                {currentStep?.found !== undefined && <div style={S.foundMsg}>✅ Found at index {currentStep.found}!</div>}
                <div style={S.barsContainer}>
                  {displayArray.map((val, i) => (
                    <Bar key={i} value={val} maxValue={maxVal} state={getBarState(i)} index={i} totalBars={displayArray.length} />
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
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

const S = {
  container: { backgroundColor: '#C5BEA9', minHeight: '100vh', paddingBottom: '60px' },
  header: {
    textAlign: 'center', padding: '50px 20px 30px',
    background: 'linear-gradient(180deg, rgba(24,57,43,0.15) 0%, transparent 100%)',
    borderBottom: '1px solid rgba(52,78,65,0.2)',
  },
  headerBadge: {
    display: 'inline-block', background: 'rgba(52,78,65,0.15)',
    border: '1px solid rgba(52,78,65,0.35)', color: '#000000',
    padding: '6px 16px', borderRadius: '20px', fontSize: '13px', marginBottom: '16px',
  },
  title: { color: 'white', fontSize: '2.8rem', fontWeight: '800', marginBottom: '10px' },
  highlight: { color: '#344E41', textShadow: '0 0 30px rgba(52,78,65,0.5)' },
  subtitle: { color: '#344E41', fontSize: '1rem' },
  body: { display: 'flex', gap: '24px', padding: '30px 40px', alignItems: 'flex-start' },
  leftPanel: { width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' },
  rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' },
  panel: {
    background: 'rgba(52,78,65,0.06)', border: '1px solid rgba(52,78,65,0.2)',
    borderRadius: '16px', padding: '20px',
  },
  panelTitle: { color: '#344E41', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', marginBottom: '14px', textTransform: 'uppercase' },
  algoList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  algoBtn: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 14px', borderRadius: '10px',
    border: '1px solid rgba(52,78,65,0.2)', background: 'transparent',
    color: '#000000', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
  },
  algoBtnActive: {
    background: 'linear-gradient(135deg, #18392B, #344E41)',
    border: '1px solid #344E41', color: 'white',
    boxShadow: '0 0 15px rgba(52,78,65,0.3)',
  },
  algoCat: { fontSize: '11px', color: '#18392B', background: 'rgba(24,57,43,0.15)', padding: '2px 8px', borderRadius: '10px' },
  algoDesc: { color: '#344E41', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '14px' },
  complexityGrid: { display: 'flex', flexDirection: 'column', gap: '8px' },
  cRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cLabel: { color: '#344E41', fontSize: '12px' },
  cBest: { color: '#3A5A40', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' },
  cAvg: { color: '#A3B18A', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' },
  cWorst: { color: '#6E5340', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' },
  cSpace: { color: '#344E41', fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' },
  legendList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  legendRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  legendDot: { width: '12px', height: '12px', borderRadius: '3px', flexShrink: 0 },
  legendLabel: { color: '#000000', fontSize: '13px' },
  controlsPanel: {
    background: 'rgba(52,78,65,0.06)', border: '1px solid rgba(52,78,65,0.2)',
    borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
  },
  controlRow: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
  controlGroup: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
  label: { color: '#000000', fontSize: '13px', fontWeight: '600' },
  slider: { accentColor: '#344E41', cursor: 'pointer', width: '100%' },
  customRow: { display: 'flex', gap: '10px' },
  input: {
    flex: 1, padding: '10px 14px', borderRadius: '10px',
    border: '1px solid rgba(52,78,65,0.3)', background: 'rgba(0,0,0,0.3)',
    color: 'white', fontSize: '14px', outline: 'none',
  },
  applyBtn: {
    padding: '10px 20px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #18392B, #344E41)',
    color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
  btnRow: { display: 'flex', gap: '10px' },
  resetBtn: {
    padding: '10px 20px', borderRadius: '10px',
    border: '1px solid rgba(52,78,65,0.3)', background: 'transparent',
    color: '#000000', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
  },
  stepBtn: {
    padding: '10px 20px', borderRadius: '10px',
    border: '1px solid rgba(52,78,65,0.3)', background: 'transparent',
    color: '#000000', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
  },
  playBtn: {
    flex: 1, padding: '10px 20px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #18392B, #344E41)',
    color: 'white', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '700',
    boxShadow: '0 0 20px rgba(52,78,65,0.4)',
  },
  pauseBtn: { background: 'linear-gradient(135deg, #3A5A40, #A3B18A)' },
  statsRow: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  stat: {
    flex: 1, textAlign: 'center', background: 'rgba(0,0,0,0.3)',
    borderRadius: '10px', padding: '10px', border: '1px solid rgba(52,78,65,0.15)',
  },
  statVal: { display: 'block', color: '#344E41', fontSize: '1.4rem', fontWeight: '800' },
  statLbl: { color: '#344E41', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' },
  vizArea: {
    background: 'rgba(52,78,65,0.04)', border: '1px solid rgba(52,78,65,0.2)',
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
  searchSpan: { color: '#000000', fontSize: '13px', fontWeight: '600' },
  foundMsg: {
    textAlign: 'center', color: '#3A5A40', fontSize: '1rem', fontWeight: '700',
    background: 'rgba(58,90,64,0.1)', border: '1px solid rgba(58,90,64,0.3)',
    borderRadius: '10px', padding: '10px',
  },
  scene: { width:'100%', minHeight:'280px', color:'#000000', display:'flex', flexDirection:'column', gap:'14px' },
  sceneTitle: { color:'#000000', fontSize:'16px', fontWeight:'800', textAlign:'center' },
  graphWrap: { display:'flex', justifyContent:'center', background:'rgba(0,0,0,.2)', borderRadius:'12px', padding:'8px' },
  tokenRow: { display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap', fontSize:'13px' },
  token: { padding:'4px 9px', borderRadius:'8px', background:'rgba(24,57,43,.2)', border:'1px solid rgba(58,90,64,.3)', color:'#000000', fontWeight:'700' },
  sceneNote: { textAlign:'center', padding:'10px', borderRadius:'10px', background:'rgba(24,57,43,.08)', color:'#000000', fontSize:'13px' },
  totalBox: { textAlign:'center', padding:'11px', borderRadius:'10px', background:'rgba(58,90,64,.08)', border:'1px solid rgba(58,90,64,.22)', color:'#3A5A40', fontSize:'13px' },
  heapRow: { display:'flex', justifyContent:'center', gap:'10px', flexWrap:'wrap', padding:'25px 10px' },
  heapBox: { minWidth:'58px', padding:'13px 10px', textAlign:'center', borderRadius:'10px', background:'rgba(24,57,43,.18)', border:'1px solid rgba(58,90,64,.3)', color:'white', fontWeight:'800' },
  heapActive: { background:'rgba(163,177,138,.2)', border:'1px solid #A3B18A', boxShadow:'0 0 14px rgba(163,177,138,.25)' },
  edgeList: { display:'flex', flexDirection:'column', gap:'7px', maxWidth:'520px', width:'100%', margin:'0 auto' },
  edgeRow: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', padding:'9px 12px', borderRadius:'8px', background:'rgba(0,0,0,.22)', fontSize:'12px' },
  itemRow: { display:'flex', justifyContent:'center', gap:'8px', flexWrap:'wrap' },
  itemChip: { padding:'7px 10px', borderRadius:'8px', background:'rgba(24,57,43,.15)', border:'1px solid rgba(58,90,64,.25)', fontSize:'11px' },
  tableScroll: { overflowX:'auto', maxWidth:'100%' },
  dpTable: { borderCollapse:'collapse', margin:'0 auto', fontSize:'11px', color:'#000000' },
  cellActive: { background:'rgba(163,177,138,.25)', color:'#DAD7CD', fontWeight:'800' },
  stageRow: { display:'flex', justifyContent:'center', gap:'8px', flexWrap:'wrap', padding:'30px 5px' },
  stageBox: { width:'68px', padding:'12px 5px', textAlign:'center', borderRadius:'10px', background:'rgba(24,57,43,.15)', border:'1px solid rgba(58,90,64,.3)', display:'flex', flexDirection:'column', gap:'5px' },
  boxActive: { border:'1px solid #A3B18A', background:'rgba(163,177,138,.18)' },
  colorNodes: { display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap', padding:'35px 5px' },
  colorNode: { width:'60px', height:'60px', borderRadius:'50%', border:'2px solid', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'white', gap:'3px' },
  routeBox: { textAlign:'center', padding:'18px', borderRadius:'12px', background:'rgba(110,83,64,.09)', border:'1px solid rgba(110,83,64,.25)', color:'#6E5340', fontSize:'18px', fontWeight:'800' },
  bstWrap: { display:'flex', justifyContent:'center', overflowX:'auto', padding:'10px' },
  bstCircle: { width:'44px', height:'44px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#18392B,#18392B)', border:'2px solid #3A5A40', color:'white', fontWeight:'800', fontSize:'12px' },
  emptyNode: { display:'block', color:'#566061', textAlign:'center', padding:'14px' },
  notFoundMsg: {
    textAlign: 'center', color: '#6E5340', fontSize: '1rem', fontWeight: '700',
    background: 'rgba(110,83,64,0.1)', border: '1px solid rgba(110,83,64,0.3)',
    borderRadius: '10px', padding: '10px',
  },
};

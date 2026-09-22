import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/*
  ADAverse - Full User-Input Algorithm Visualizer

  Supported algorithms:
  Unit 1:
    - Bubble Sort
    - Selection Sort
    - Insertion Sort
    - Merge Sort
    - Quick Sort
    - Heap Sort

  Unit 2:
    - Optimal Merge Pattern
    - Prim's MST

  Unit 3:
    - 0/1 Knapsack
    - Multistage Graph

  Unit 4:
    - Graph Coloring
    - Travelling Salesman Problem

  Unit 5:
    - BFS
    - DFS
    - Binary Search
    - Binary Search Tree

  Every algorithm has an input form appropriate to that algorithm.
  No algorithm depends on the old hard-coded demo data.
*/

/* ============================================================
   COLORS
   ============================================================ */

const BAR_DEFAULT = 'linear-gradient(180deg, #18392B, #18392B)';
const BAR_COMPARING = 'linear-gradient(180deg, #A3B18A, #3A5A40)';
const BAR_SWAPPING = 'linear-gradient(180deg, #6E5340, #566061)';
const BAR_SORTED = 'linear-gradient(180deg, #3A5A40, #344E41)';
const BAR_PIVOT = 'linear-gradient(180deg, #6E5340, #566061)';
const BAR_FOUND = 'linear-gradient(180deg, #3A5A40, #344E41)';
const BAR_SEARCHING = 'linear-gradient(180deg, #A3B18A, #3A5A40)';
const BAR_DISCARDED = 'linear-gradient(180deg, #566061, #566061)';

/* ============================================================
   SORTING GENERATORS
   ============================================================ */

function* bubbleSortGen(arr) {
  const a = [...arr];
  const n = a.length;

  if (n < 2) {
    yield {
      array: [...a],
      sorted: Array.from({ length: n }, (_, i) => i),
      done: true,
    };
    return;
  }

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...a],
        comparing: [j, j + 1],
        sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
      };

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;

        yield {
          array: [...a],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
        };
      }
    }

    if (!swapped) break;
  }

  yield {
    array: [...a],
    sorted: Array.from({ length: n }, (_, k) => k),
    done: true,
  };
}

function* selectionSortGen(arr) {
  const a = [...arr];
  const n = a.length;
  const sortedIdx = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      yield {
        array: [...a],
        comparing: [minIdx, j],
        sorted: [...sortedIdx],
      };

      if (a[j] < a[minIdx]) minIdx = j;
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];

      yield {
        array: [...a],
        swapping: [i, minIdx],
        sorted: [...sortedIdx],
      };
    }

    sortedIdx.push(i);
  }

  if (n > 0) sortedIdx.push(n - 1);

  yield {
    array: [...a],
    sorted: sortedIdx,
    done: true,
  };
}

function* insertionSortGen(arr) {
  const a = [...arr];
  const n = a.length;

  for (let i = 1; i < n; i++) {
    let j = i;

    while (j > 0 && a[j - 1] > a[j]) {
      yield {
        array: [...a],
        comparing: [j - 1, j],
        sorted: Array.from({ length: i }, (_, k) => k),
      };

      [a[j], a[j - 1]] = [a[j - 1], a[j]];

      yield {
        array: [...a],
        swapping: [j, j - 1],
        sorted: Array.from({ length: i }, (_, k) => k),
      };

      j--;
    }
  }

  yield {
    array: [...a],
    sorted: Array.from({ length: n }, (_, k) => k),
    done: true,
  };
}

function* mergeSortGen(arr) {
  const a = [...arr];
  const steps = [];

  function mergeSort(left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  function merge(left, mid, right) {
    const leftArr = a.slice(left, mid + 1);
    const rightArr = a.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        array: [...a],
        comparing: [left + i, mid + 1 + j],
      });

      if (leftArr[i] <= rightArr[j]) {
        a[k++] = leftArr[i++];
      } else {
        a[k++] = rightArr[j++];
      }

      steps.push({
        array: [...a],
        swapping: [k - 1],
      });
    }

    while (i < leftArr.length) {
      a[k++] = leftArr[i++];
      steps.push({
        array: [...a],
        swapping: [k - 1],
      });
    }

    while (j < rightArr.length) {
      a[k++] = rightArr[j++];
      steps.push({
        array: [...a],
        swapping: [k - 1],
      });
    }
  }

  if (a.length > 1) mergeSort(0, a.length - 1);

  steps.push({
    array: [...a],
    sorted: Array.from({ length: a.length }, (_, k) => k),
    done: true,
  });

  for (const step of steps) yield step;
}

function* quickSortGen(arr) {
  const a = [...arr];
  const steps = [];
  const sortedSet = new Set();

  function quickSort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      sortedSet.add(pi);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      sortedSet.add(low);
    }
  }

  function partition(low, high) {
    const pivot = a[high];

    steps.push({
      array: [...a],
      pivot: high,
      sorted: [...sortedSet],
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...a],
        comparing: [j, high],
        pivot: high,
        sorted: [...sortedSet],
      });

      if (a[j] <= pivot) {
        i++;

        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];

          steps.push({
            array: [...a],
            swapping: [i, j],
            pivot: high,
            sorted: [...sortedSet],
          });
        }
      }
    }

    [a[i + 1], a[high]] = [a[high], a[i + 1]];

    steps.push({
      array: [...a],
      swapping: [i + 1, high],
      pivot: i + 1,
      sorted: [...sortedSet],
    });

    return i + 1;
  }

  if (a.length > 1) quickSort(0, a.length - 1);

  steps.push({
    array: [...a],
    sorted: Array.from({ length: a.length }, (_, k) => k),
    done: true,
  });

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
      yield {
        array: [...a],
        comparing: [root, left],
        heapSize: size,
      };

      if (a[left] > a[largest]) largest = left;
    }

    if (right < size) {
      yield {
        array: [...a],
        comparing: [largest, right],
        heapSize: size,
      };

      if (a[right] > a[largest]) largest = right;
    }

    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];

      yield {
        array: [...a],
        swapping: [root, largest],
        heapSize: size,
      };

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
      heapSize: end,
    };

    yield* heapify(end, 0);
  }

  yield {
    array: [...a],
    sorted: Array.from({ length: n }, (_, k) => k),
    done: true,
  };
}

/* ============================================================
   SEARCH GENERATOR
   ============================================================ */

function* binarySearchGen(arr, target) {
  const a = [...arr].sort((x, y) => x - y);
  let low = 0;
  let high = a.length - 1;
  const discarded = new Set();

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    yield {
      array: [...a],
      searching: mid,
      low,
      high,
      discarded: [...discarded],
    };

    if (a[mid] === target) {
      yield {
        array: [...a],
        found: mid,
        low,
        high,
        discarded: [...discarded],
        done: true,
      };
      return;
    }

    if (a[mid] < target) {
      for (let i = low; i <= mid; i++) discarded.add(i);
      low = mid + 1;
    } else {
      for (let i = mid; i <= high; i++) discarded.add(i);
      high = mid - 1;
    }
  }

  yield {
    array: [...a],
    notFound: true,
    discarded: [...discarded],
    done: true,
  };
}

/* ============================================================
   OPTIMAL MERGE
   ============================================================ */

function* optimalMergeGen(input) {
  let heap = [...input].sort((a, b) => a - b);
  let total = 0;

  while (heap.length > 1) {
    yield {
      type: 'merge',
      heap: [...heap],
      pair: [heap[0], heap[1]],
      total,
    };

    const sum = heap[0] + heap[1];
    total += sum;

    heap = heap.slice(2);
    heap.push(sum);
    heap.sort((a, b) => a - b);

    yield {
      type: 'merge',
      heap: [...heap],
      merged: sum,
      total,
    };
  }

  yield {
    type: 'merge',
    heap: [...heap],
    total,
    done: true,
  };
}

/* ============================================================
   GRAPH HELPERS
   ============================================================ */

function parseEdges(text, directed = false) {
  const edges = [];
  const tokens = String(text || '')
    .split(/[\n,;]+/)
    .map(s => s.trim())
    .filter(Boolean);

  for (const token of tokens) {
    const match = token.match(
      /^(-?\d+)\s*(?:-|->|=>|:)\s*(-?\d+)(?:\s*(?:,|:|\s)\s*(-?\d+(?:\.\d+)?))?$/
    );

    if (!match) continue;

    const u = Number(match[1]);
    const v = Number(match[2]);
    const w = match[3] === undefined ? 1 : Number(match[3]);

    if (!Number.isFinite(u) || !Number.isFinite(v) || !Number.isFinite(w)) continue;

    edges.push({ u, v, w });

    if (!directed && u !== v) {
      edges.push({ u: v, v: u, w });
    }
  }

  return edges;
}

function getVertices(edges) {
  return [...new Set(edges.flatMap(e => [e.u, e.v]))].sort((a, b) => a - b);
}

/* ============================================================
   PRIM'S MST
   ============================================================ */

function* primMstGen(edges, start) {
  const vertices = getVertices(edges);

  if (!vertices.length) {
    yield {
      type: 'prim',
      visited: [],
      edges: [],
      total: 0,
      done: true,
    };
    return;
  }

  const source = vertices.includes(start) ? start : vertices[0];
  const visited = [source];
  const chosen = [];
  let total = 0;

  while (visited.length < vertices.length) {
    let best = null;

    for (const u of visited) {
      for (const edge of edges) {
        if (edge.u !== u) continue;
        if (visited.includes(edge.v)) continue;

        if (!best || edge.w < best.w) {
          best = edge;
        }
      }
    }

    if (!best) break;

    visited.push(best.v);
    chosen.push(best);
    total += best.w;

    yield {
      type: 'prim',
      visited: [...visited],
      edges: [...chosen],
      active: best,
      total,
    };
  }

  yield {
    type: 'prim',
    visited: [...visited],
    edges: [...chosen],
    total,
    connected: visited.length === vertices.length,
    done: true,
  };
}

/* ============================================================
   0/1 KNAPSACK
   ============================================================ */

function* knapsackGen(weights, values, capacity) {
  const n = weights.length;
  const W = capacity;
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (w >= weights[i - 1]) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          values[i - 1] + dp[i - 1][w - weights[i - 1]]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }

      yield {
        type: 'knapsack',
        dp: dp.map(row => [...row]),
        item: i,
        capacity: w,
        weights: [...weights],
        values: [...values],
        best: dp[i][w],
      };
    }
  }

  const selected = [];
  let w = W;

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(i - 1);
      w -= weights[i - 1];
    }
  }

  selected.reverse();

  yield {
    type: 'knapsack',
    dp: dp.map(row => [...row]),
    item: n,
    capacity: W,
    weights: [...weights],
    values: [...values],
    best: dp[n][W],
    selected,
    done: true,
  };
}

/* ============================================================
   MULTISTAGE GRAPH
   ============================================================ */

function* multistageGen(edges, source, sink) {
  const vertices = getVertices(edges);

  if (!vertices.length) {
    yield {
      type: 'multistage',
      dist: [],
      next: [],
      done: true,
    };
    return;
  }

  const sourceNode = vertices.includes(source) ? source : vertices[0];
  const sinkNode = vertices.includes(sink)
    ? sink
    : vertices[vertices.length - 1];

  const dist = {};
  const next = {};

  vertices.forEach(v => {
    dist[v] = Infinity;
    next[v] = null;
  });

  dist[sinkNode] = 0;

  const reverseVertices = [...vertices].reverse();

  for (const u of reverseVertices) {
    if (u === sinkNode) continue;

    const outgoing = edges.filter(e => e.u === u);

    for (const edge of outgoing) {
      if (!Number.isFinite(dist[edge.v])) continue;

      const candidate = edge.w + dist[edge.v];

      if (candidate < dist[u]) {
        dist[u] = candidate;
        next[u] = edge.v;
      }

      yield {
        type: 'multistage',
        dist: { ...dist },
        next: { ...next },
        active: edge,
      };
    }
  }

  const path = [];
  let current = sourceNode;
  const seen = new Set();

  while (current !== null && !seen.has(current)) {
    seen.add(current);
    path.push(current);

    if (current === sinkNode) break;
    current = next[current];
  }

  yield {
    type: 'multistage',
    dist: { ...dist },
    next: { ...next },
    path,
    total: Number.isFinite(dist[sourceNode]) ? dist[sourceNode] : null,
    source: sourceNode,
    sink: sinkNode,
    done: true,
  };
}

/* ============================================================
   GRAPH COLORING
   ============================================================ */

function* graphColoringGen(edges, colorCount) {
  const vertices = getVertices(edges);
  const colors = {};
  const adjacency = {};

  vertices.forEach(v => {
    colors[v] = 0;
    adjacency[v] = [];
  });

  for (const edge of edges) {
    if (!adjacency[edge.u]) adjacency[edge.u] = [];
    if (!adjacency[edge.v]) adjacency[edge.v] = [];

    adjacency[edge.u].push(edge.v);
    adjacency[edge.v].push(edge.u);
  }

  function safe(vertex, color) {
    return !(adjacency[vertex] || []).some(
      neighbor => colors[neighbor] === color
    );
  }

  function* solve(index) {
    if (index >= vertices.length) {
      yield {
        type: 'coloring',
        colors: { ...colors },
        vertices: [...vertices],
        done: true,
      };
      return true;
    }

    const vertex = vertices[index];

    for (let c = 1; c <= colorCount; c++) {
      yield {
        type: 'coloring',
        colors: { ...colors },
        vertices: [...vertices],
        vertex,
        trying: c,
      };

      if (safe(vertex, c)) {
        colors[vertex] = c;

        yield {
          type: 'coloring',
          colors: { ...colors },
          vertices: [...vertices],
          vertex,
          accepted: c,
        };

        const child = solve(index + 1);

        for (const step of child) {
          yield step;

          if (step.done) return true;
        }

        colors[vertex] = 0;

        yield {
          type: 'coloring',
          colors: { ...colors },
          vertices: [...vertices],
          vertex,
          backtrack: true,
        };
      }
    }

    return false;
  }

  yield* solve(0);
}

/* ============================================================
   TSP
   ============================================================ */

function parseMatrix(text) {
  return String(text || '')
    .trim()
    .split(/\n+/)
    .map(row =>
      row
        .split(/[\s,;]+/)
        .map(Number)
        .filter(Number.isFinite)
    )
    .filter(row => row.length);
}

function* tspGen(matrix) {
  const n = matrix.length;

  if (n < 2 || matrix.some(row => row.length !== n)) {
    yield {
      type: 'tsp',
      error: 'Enter a valid square distance matrix.',
      done: true,
    };
    return;
  }

  const used = Array(n).fill(false);
  const path = [0];
  used[0] = true;

  let best = Infinity;
  let bestPath = [];

  function* search() {
    if (path.length === n) {
      const last = path[path.length - 1];
      const total =
        path.reduce(
          (sum, vertex, index) =>
            index === 0 ? sum : sum + matrix[path[index - 1]][vertex],
          0
        ) + matrix[last][0];

      yield {
        type: 'tsp',
        path: [...path, 0],
        currentCost: total,
        best,
        bestPath: [...bestPath],
      };

      if (total < best) {
        best = total;
        bestPath = [...path, 0];

        yield {
          type: 'tsp',
          path: [...path, 0],
          currentCost: total,
          best,
          bestPath: [...bestPath],
          improved: true,
        };
      }

      return;
    }

    for (let v = 1; v < n; v++) {
      if (used[v]) continue;

      used[v] = true;
      path.push(v);

      yield* search();

      path.pop();
      used[v] = false;
    }
  }

  yield* search();

  yield {
    type: 'tsp',
    path: bestPath,
    currentCost: best,
    best,
    bestPath,
    done: true,
  };
}

/* ============================================================
   BFS / DFS
   ============================================================ */

function* bfsGen(edges, start) {
  const vertices = getVertices(edges);

  if (!vertices.length) {
    yield {
      type: 'bfs',
      visited: [],
      queue: [],
      order: [],
      done: true,
    };
    return;
  }

  const source = vertices.includes(start) ? start : vertices[0];
  const adjacency = {};

  vertices.forEach(v => {
    adjacency[v] = [];
  });

  for (const edge of edges) {
    if (!adjacency[edge.u]) adjacency[edge.u] = [];
    adjacency[edge.u].push(edge.v);
  }

  const visited = new Set([source]);
  const queue = [source];
  const order = [];

  while (queue.length) {
    const u = queue.shift();
    order.push(u);

    yield {
      type: 'bfs',
      vertices: [...vertices],
      visited: [...visited],
      queue: [...queue],
      current: u,
      order: [...order],
    };

    for (const v of adjacency[u] || []) {
      if (visited.has(v)) continue;

      visited.add(v);
      queue.push(v);

      yield {
        type: 'bfs',
        vertices: [...vertices],
        visited: [...visited],
        queue: [...queue],
        current: u,
        discover: v,
        order: [...order],
      };
    }
  }

  yield {
    type: 'bfs',
    vertices: [...vertices],
    visited: [...visited],
    queue: [],
    order: [...order],
    done: true,
  };
}

function* dfsGen(edges, start) {
  const vertices = getVertices(edges);

  if (!vertices.length) {
    yield {
      type: 'dfs',
      visited: [],
      order: [],
      done: true,
    };
    return;
  }

  const source = vertices.includes(start) ? start : vertices[0];
  const adjacency = {};

  vertices.forEach(v => {
    adjacency[v] = [];
  });

  for (const edge of edges) {
    if (!adjacency[edge.u]) adjacency[edge.u] = [];
    adjacency[edge.u].push(edge.v);
  }

  const visited = new Set();
  const order = [];

  function* visit(u) {
    visited.add(u);
    order.push(u);

    yield {
      type: 'dfs',
      vertices: [...vertices],
      visited: [...visited],
      current: u,
      order: [...order],
    };

    for (const v of adjacency[u] || []) {
      if (!visited.has(v)) {
        yield* visit(v);
      }
    }

    yield {
      type: 'dfs',
      vertices: [...vertices],
      visited: [...visited],
      current: u,
      order: [...order],
      backtrack: true,
    };
  }

  yield* visit(source);

  yield {
    type: 'dfs',
    vertices: [...vertices],
    visited: [...visited],
    order: [...order],
    done: true,
  };
}

/* ============================================================
   BST
   ============================================================ */

function* bstGen(values, searchValue, deleteValue) {
  let root = null;

  function insert(node, key) {
    if (!node) return { key, left: null, right: null };

    if (key < node.key) {
      node.left = insert(node.left, key);
    } else if (key > node.key) {
      node.right = insert(node.right, key);
    }

    return node;
  }

  function clone(node) {
    return node
      ? {
          key: node.key,
          left: clone(node.left),
          right: clone(node.right),
        }
      : null;
  }

  for (const value of values) {
    root = insert(root, value);

    yield {
      type: 'bst',
      root: clone(root),
      operation: `Insert ${value}`,
    };
  }

  if (Number.isFinite(searchValue)) {
    let current = root;

    while (current) {
      yield {
        type: 'bst',
        root: clone(root),
        operation: `Search ${searchValue}`,
        search: current.key,
      };

      if (current.key === searchValue) break;

      current =
        searchValue < current.key ? current.left : current.right;
    }
  }

  function minNode(node) {
    let current = node;
    while (current && current.left) current = current.left;
    return current;
  }

  function deleteNode(node, key) {
    if (!node) return node;

    if (key < node.key) {
      node.left = deleteNode(node.left, key);
    } else if (key > node.key) {
      node.right = deleteNode(node.right, key);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      const successor = minNode(node.right);
      node.key = successor.key;
      node.right = deleteNode(node.right, successor.key);
    }

    return node;
  }

  if (Number.isFinite(deleteValue)) {
    root = deleteNode(root, deleteValue);

    yield {
      type: 'bst',
      root: clone(root),
      operation: `Delete ${deleteValue}`,
      done: true,
    };
  } else {
    yield {
      type: 'bst',
      root: clone(root),
      operation: 'BST complete',
      done: true,
    };
  }
}

/* ============================================================
   ALGORITHM METADATA
   ============================================================ */

const EXTRA_ALGORITHMS = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Unit 1 · Sorting',
    description: 'Repeatedly compare adjacent elements and swap them when they are out of order.',
    time_best: 'O(n)',
    time_avg: 'O(n²)',
    time_worst: 'O(n²)',
    space: 'O(1)',
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'Unit 1 · Sorting',
    description: 'Repeatedly select the smallest remaining element and place it in its final position.',
    time_best: 'O(n²)',
    time_avg: 'O(n²)',
    time_worst: 'O(n²)',
    space: 'O(1)',
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'Unit 1 · Sorting',
    description: 'Build the sorted portion one element at a time by inserting each value into its correct position.',
    time_best: 'O(n)',
    time_avg: 'O(n²)',
    time_worst: 'O(n²)',
    space: 'O(1)',
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Unit 1 · Divide & Conquer',
    description: 'Divide the array into smaller parts and merge sorted parts back together.',
    time_best: 'O(n log n)',
    time_avg: 'O(n log n)',
    time_worst: 'O(n log n)',
    space: 'O(n)',
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'Unit 1 · Divide & Conquer',
    description: 'Partition the array around a pivot and recursively sort the two partitions.',
    time_best: 'O(n log n)',
    time_avg: 'O(n log n)',
    time_worst: 'O(n²)',
    space: 'O(log n)',
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'Unit 1 · Heap & Sorting',
    description: 'Build a max heap and repeatedly extract the maximum element.',
    time_best: 'O(n log n)',
    time_avg: 'O(n log n)',
    time_worst: 'O(n log n)',
    space: 'O(1)',
  },
  {
    id: 'optimal-merge',
    name: 'Optimal Merge Pattern',
    category: 'Unit 2 · Greedy',
    description: 'Repeatedly merge the two smallest files to minimize the total merge cost.',
    time_best: 'O(n log n)',
    time_avg: 'O(n log n)',
    time_worst: 'O(n log n)',
    space: 'O(n)',
  },
  {
    id: 'prim-mst',
    name: "Prim's MST",
    category: 'Unit 2 · Greedy',
    description: 'Construct a minimum spanning tree by repeatedly selecting the cheapest edge crossing the visited set.',
    time_best: 'O(V²)',
    time_avg: 'O(V²)',
    time_worst: 'O(V²)',
    space: 'O(V)',
  },
  {
    id: 'knapsack',
    name: '0/1 Knapsack',
    category: 'Unit 3 · DP',
    description: 'Use dynamic programming to maximize value without exceeding the capacity.',
    time_best: 'O(nW)',
    time_avg: 'O(nW)',
    time_worst: 'O(nW)',
    space: 'O(nW)',
  },
  {
    id: 'multistage',
    name: 'Multistage Graph',
    category: 'Unit 3 · DP',
    description: 'Compute the minimum-cost path through a directed multistage graph.',
    time_best: 'O(E)',
    time_avg: 'O(E)',
    time_worst: 'O(E)',
    space: 'O(V)',
  },
  {
    id: 'graph-coloring',
    name: 'Graph Coloring',
    category: 'Unit 4 · Backtracking',
    description: 'Assign colors to vertices so adjacent vertices never share a color.',
    time_best: 'O(m^V)',
    time_avg: 'O(m^V)',
    time_worst: 'O(m^V)',
    space: 'O(V)',
  },
  {
    id: 'tsp',
    name: 'Travelling Salesman Problem',
    category: 'Unit 4 · Branch & Bound',
    description: 'Explore possible tours and keep the minimum Hamiltonian cycle.',
    time_best: 'O(n!)',
    time_avg: 'O(n!)',
    time_worst: 'O(n!)',
    space: 'O(n)',
  },
  {
    id: 'bfs',
    name: 'Breadth First Search',
    category: 'Unit 5 · Graph',
    description: 'Visit a graph level-by-level using a queue.',
    time_best: 'O(V+E)',
    time_avg: 'O(V+E)',
    time_worst: 'O(V+E)',
    space: 'O(V)',
  },
  {
    id: 'dfs',
    name: 'Depth First Search',
    category: 'Unit 5 · Graph',
    description: 'Explore as deeply as possible before backtracking.',
    time_best: 'O(V+E)',
    time_avg: 'O(V+E)',
    time_worst: 'O(V+E)',
    space: 'O(V)',
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Unit 5 · Searching',
    description: 'Search a sorted array by repeatedly halving the remaining search interval.',
    time_best: 'O(1)',
    time_avg: 'O(log n)',
    time_worst: 'O(log n)',
    space: 'O(1)',
  },
  {
    id: 'bst',
    name: 'Binary Search Tree',
    category: 'Unit 5 · Tree',
    description: 'Demonstrate insertion, searching and deletion in a binary search tree.',
    time_best: 'O(log n)',
    time_avg: 'O(log n)',
    time_worst: 'O(n)',
    space: 'O(n)',
  },
];

/* ============================================================
   VISUAL COMPONENTS
   ============================================================ */

function Bar({ value, maxValue, state, totalBars }) {
  const safeMax = Math.max(maxValue, 1);
  const heightPct = Math.max(8, (value / safeMax) * 85);

  let bg = BAR_DEFAULT;

  if (state === 'comparing') bg = BAR_COMPARING;
  else if (state === 'swapping') bg = BAR_SWAPPING;
  else if (state === 'sorted') bg = BAR_SORTED;
  else if (state === 'pivot') bg = BAR_PIVOT;
  else if (state === 'found') bg = BAR_FOUND;
  else if (state === 'searching') bg = BAR_SEARCHING;
  else if (state === 'discarded') bg = BAR_DISCARDED;

  const width = Math.max(
    20,
    Math.min(60, Math.floor(520 / Math.max(totalBars, 1)) - 4)
  );

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
      }}>
        {value}
      </div>

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
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '6px 6px 0 0',
        }} />
      </div>
    </div>
  );
}

function BSTNode({ node }) {
  if (!node) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    }}>
      <div style={S.bstCircle}>{node.key}</div>

      {(node.left || node.right) && (
        <div style={{
          display: 'flex',
          gap: 28,
          alignItems: 'flex-start',
        }}>
          <div style={{ minWidth: 55, textAlign: 'center' }}>
            {node.left
              ? <BSTNode node={node.left} />
              : <span style={S.emptyNode}>∅</span>}
          </div>

          <div style={{ minWidth: 55, textAlign: 'center' }}>
            {node.right
              ? <BSTNode node={node.right} />
              : <span style={S.emptyNode}>∅</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function GraphScene({ step }) {
  const vertices = step.vertices || [];
  const visited = new Set(step.visited || []);
  const order = step.order || [];

  const count = Math.max(vertices.length, 1);
  const positions = vertices.map((_, index) => {
    const angle = (2 * Math.PI * index) / count - Math.PI / 2;
    return [
      50 + Math.cos(angle) * 35,
      50 + Math.sin(angle) * 35,
    ];
  });

  const indexOf = new Map(vertices.map((v, i) => [v, i]));

  return (
    <div style={S.scene}>
      <div style={S.sceneTitle}>
        {step.type === 'bfs'
          ? 'BFS — Queue / Level Order'
          : 'DFS — Depth First Traversal'}
      </div>

      <div style={S.graphWrap}>
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '280px',
            maxWidth: '620px',
          }}
        >
          {(step.edges || []).map((edge, i) => {
            const a = indexOf.get(edge.u);
            const b = indexOf.get(edge.v);

            if (a === undefined || b === undefined) return null;

            return (
              <line
                key={i}
                x1={positions[a][0]}
                y1={positions[a][1]}
                x2={positions[b][0]}
                y2={positions[b][1]}
                stroke="rgba(58,90,64,.45)"
                strokeWidth="1.2"
              />
            );
          })}

          {vertices.map((vertex, i) => (
            <g key={vertex}>
              <circle
                cx={positions[i][0]}
                cy={positions[i][1]}
                r="7"
                fill={
                  step.current === vertex
                    ? '#A3B18A'
                    : visited.has(vertex)
                      ? '#3A5A40'
                      : '#344E41'
                }
                stroke="#3A5A40"
                strokeWidth="1.2"
              />

              <text
                x={positions[i][0]}
                y={positions[i][1] + 1.5}
                textAnchor="middle"
                fontSize="5.5"
                fill="white"
              >
                {vertex}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div style={S.tokenRow}>
        <b>Visited:</b>
        {[...visited].map(v => (
          <span key={v} style={S.token}>{v}</span>
        ))}
      </div>

      <div style={S.tokenRow}>
        <b>Order:</b>
        {order.map((v, i) => (
          <span key={`${v}-${i}`} style={S.token}>
            {i + ': ' + v}
          </span>
        ))}
      </div>

      {step.queue && (
        <div style={S.tokenRow}>
          <b>Queue:</b>
          {step.queue.length
            ? step.queue.map((v, i) => (
                <span key={`${v}-${i}`} style={S.token}>{v}</span>
              ))
            : ' empty'}
        </div>
      )}

      {step.backtrack && (
        <div style={S.sceneNote}>
          ↩ Backtracking from vertex {step.current}
        </div>
      )}
    </div>
  );
}

function TableScene({ step }) {
  if (step.type === 'bfs' || step.type === 'dfs') {
    return <GraphScene step={step} />;
  }

  if (step.type === 'merge') {
    return (
      <div style={S.scene}>
        <div style={S.sceneTitle}>
          Optimal Merge Pattern — Min Heap
        </div>

        <div style={S.heapRow}>
          {step.heap.map((v, i) => (
            <div
              key={`${v}-${i}`}
              style={{
                ...S.heapBox,
                ...(step.pair?.includes(v) ? S.heapActive : {}),
              }}
            >
              {v}
            </div>
          ))}
        </div>

        {step.pair && (
          <div style={S.sceneNote}>
            Merge two smallest:{' '}
            <b>
              {step.pair[0]} + {step.pair[1]} ={' '}
              {step.pair[0] + step.pair[1]}
            </b>
          </div>
        )}

        <div style={S.totalBox}>
          Total merge cost: <b>{step.total}</b>
        </div>

        {step.merged !== undefined && (
          <div style={S.sceneNote}>
            Inserted merged file <b>{step.merged}</b> into the min-heap.
          </div>
        )}
      </div>
    );
  }

  if (step.type === 'prim') {
    return (
      <div style={S.scene}>
        <div style={S.sceneTitle}>
          Prim's Algorithm — Minimum Spanning Tree
        </div>

        <div style={S.tokenRow}>
          <b>Visited:</b>
          {step.visited.map(v => (
            <span key={v} style={S.token}>{v}</span>
          ))}
        </div>

        <div style={S.edgeList}>
          {step.edges.map((e, i) => (
            <div key={i} style={S.edgeRow}>
              <span>Edge {i + 1}</span>
              <b>{e.u} — {e.v}</b>
              <span>weight = {e.w}</span>
            </div>
          ))}
        </div>

        {step.active && (
          <div style={S.sceneNote}>
            Selected minimum crossing edge:{' '}
            <b>{step.active.u} — {step.active.v}</b>{' '}
            (weight {step.active.w})
          </div>
        )}

        <div style={S.totalBox}>
          MST total cost: <b>{step.total}</b>
          {step.done && step.connected === false
            ? ' · Graph is disconnected'
            : ''}
        </div>
      </div>
    );
  }

  if (step.type === 'knapsack') {
    const rows = step.dp || [];
    const visibleCaps = [];

    const maxCapacity = Math.max(
      0,
      Number(step.capacity),
      ...(step.dp || []).map(row => row.length - 1)
    );

    if (maxCapacity <= 30) {
      for (let w = 0; w <= maxCapacity; w++) visibleCaps.push(w);
    } else {
      for (let w = 0; w <= maxCapacity; w += Math.ceil(maxCapacity / 10)) {
        visibleCaps.push(w);
      }
      if (visibleCaps[visibleCaps.length - 1] !== maxCapacity) {
        visibleCaps.push(maxCapacity);
      }
    }

    return (
      <div style={S.scene}>
        <div style={S.sceneTitle}>
          0/1 Knapsack — DP Table
        </div>

        <div style={S.itemRow}>
          {step.weights.map((w, i) => (
            <span key={i} style={S.itemChip}>
              Item {i + 1}: W={w}, V={step.values[i]}
            </span>
          ))}
        </div>

        <div style={S.tableScroll}>
          <table style={S.dpTable}>
            <thead>
              <tr>
                <th>Item ↓ / Cap →</th>
                {visibleCaps.map(w => (
                  <th key={w}>{w}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <th>{i}</th>
                  {visibleCaps.map(w => (
                    <td
                      key={w}
                      style={
                        i === step.item && w === step.capacity
                          ? S.cellActive
                          : {}
                      }
                    >
                      {row[w] ?? 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={S.totalBox}>
          Current best value: <b>{step.best}</b>
          {' · '}
          Capacity: <b>{step.capacity}</b>
          {step.selected && (
            <>
              {' · '}
              Selected items:{' '}
              <b>{step.selected.map(i => i + 1).join(', ') || 'None'}</b>
            </>
          )}
        </div>
      </div>
    );
  }

  if (step.type === 'multistage') {
    const dist = step.dist || {};
    const vertices = Object.keys(dist).map(Number).sort((a, b) => a - b);

    return (
      <div style={S.scene}>
        <div style={S.sceneTitle}>
          Multistage Graph — Minimum Cost DP
        </div>

        <div style={S.stageRow}>
          {vertices.map(v => (
            <div
              key={v}
              style={{
                ...S.stageBox,
                ...(step.active?.u === v ? S.boxActive : {}),
              }}
            >
              <b>V{v}</b>
              <span>
                {Number.isFinite(dist[v]) ? dist[v] : '∞'}
              </span>
            </div>
          ))}
        </div>

        {step.active && (
          <div style={S.sceneNote}>
            Relax edge{' '}
            <b>{step.active.u} → {step.active.v}</b>{' '}
            with cost {step.active.w}
          </div>
        )}

        {step.path && (
          <div style={S.totalBox}>
            Path:{' '}
            <b>{step.path.join(' → ')}</b>
            {' · '}
            Minimum cost:{' '}
            <b>{step.total ?? 'No path'}</b>
          </div>
        )}
      </div>
    );
  }

  if (step.type === 'coloring') {
    const vertices = step.vertices || [];

    return (
      <div style={S.scene}>
        <div style={S.sceneTitle}>
          Graph Coloring — Backtracking
        </div>

        <div style={S.colorNodes}>
          {vertices.map(v => {
            const color = step.colors?.[v] || 0;

            return (
              <div
                key={v}
                style={{
                  ...S.colorNode,
                  borderColor: color ? '#344E41' : '#566061',
                  background: color
                    ? 'rgba(24,57,43,.25)'
                    : 'rgba(0,0,0,.12)',
                }}
              >
                <b>V{v}</b>
                <span>{color || '—'}</span>
              </div>
            );
          })}
        </div>

        <div style={S.sceneNote}>
          {step.backtrack
            ? `↩ Backtrack from V${step.vertex}`
            : step.accepted !== undefined
              ? `✓ Assign color ${step.accepted} to V${step.vertex}`
              : step.trying !== undefined
                ? `Try color ${step.trying} for V${step.vertex}`
                : step.done
                  ? '✓ Valid coloring found!'
                  : 'Checking colors...'}
        </div>
      </div>
    );
  }

  if (step.type === 'tsp') {
    return (
      <div style={S.scene}>
        <div style={S.sceneTitle}>
          Travelling Salesman Problem — User Matrix
        </div>

        {step.error ? (
          <div style={S.errorBox}>{step.error}</div>
        ) : (
          <>
            <div style={S.routeBox}>
              {step.path?.length
                ? step.path.join(' → ')
                : 'Searching...'}
            </div>

            <div style={S.sceneNote}>
              Current tour cost:{' '}
              <b>{Number.isFinite(step.currentCost) ? step.currentCost : '—'}</b>
            </div>

            <div style={S.totalBox}>
              Best tour:{' '}
              <b>
                {step.bestPath?.length
                  ? step.bestPath.join(' → ')
                  : '—'}
              </b>
              {' · '}
              Best cost:{' '}
              <b>
                {Number.isFinite(step.best) ? step.best : '—'}
              </b>
            </div>
          </>
        )}
      </div>
    );
  }

  if (step.type === 'bst') {
    return (
      <div style={S.scene}>
        <div style={S.sceneTitle}>
          Binary Search Tree — {step.operation}
        </div>

        <div style={S.bstWrap}>
          <BSTNode node={step.root} />
        </div>

        {step.search !== undefined && (
          <div style={S.sceneNote}>
            Searching node <b>{step.search}</b>...
          </div>
        )}

        {step.done && (
          <div style={S.totalBox}>
            ✓ BST operation complete.
          </div>
        )}
      </div>
    );
  }

  return null;
}

/* ============================================================
   MAIN VISUALIZER
   ============================================================ */

export default function Visualizer() {
  const [algorithms, setAlgorithms] = useState(EXTRA_ALGORITHMS);
  const [selectedAlgo, setSelectedAlgo] = useState(EXTRA_ALGORITHMS[0]);

  const [array, setArray] = useState([]);
  const [arrayInput, setArrayInput] = useState(
    '38, 12, 51, 90, 81, 86, 96, 59, 55, 73'
  );
  const [arraySize, setArraySize] = useState(10);

  const [speed, setSpeed] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [comparisons, setComparisons] = useState(0);

  const [searchTarget, setSearchTarget] = useState('51');

  /* Graph / advanced inputs */
  const [graphEdges, setGraphEdges] = useState(
    '0-1:4\n0-2:2\n1-2:1\n1-3:5\n2-3:8\n2-4:10\n3-4:2'
  );
  const [graphStart, setGraphStart] = useState('0');
  const [graphSource, setGraphSource] = useState('0');
  const [graphSink, setGraphSink] = useState('4');

  const [knapsackWeights, setKnapsackWeights] = useState('10, 20, 30');
  const [knapsackValues, setKnapsackValues] = useState('60, 100, 120');
  const [knapsackCapacity, setKnapsackCapacity] = useState('50');

  const [colorCount, setColorCount] = useState('3');

  const [tspMatrix, setTspMatrix] = useState(
    '0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0'
  );

  const [bstValues, setBstValues] = useState('50, 30, 70, 20, 40, 60, 80');
  const [bstSearch, setBstSearch] = useState('40');
  const [bstDelete, setBstDelete] = useState('30');

  const generatorRef = useRef(null);
  const comparisonsRef = useRef(0);

  // Playback refs keep Play/Pause independent from React render timing.
  const playTimerRef = useRef(null);
  const playingRef = useRef(false);
  const playRunRef = useRef(0);
  const speedRef = useRef(speed);

  const isBinarySearch = selectedAlgo?.id === 'binary-search';

  const isArrayAlgorithm = useMemo(
    () => [
      'bubble-sort',
      'selection-sort',
      'insertion-sort',
      'merge-sort',
      'quick-sort',
      'heap-sort',
      'binary-search',
      'optimal-merge',
    ].includes(selectedAlgo?.id),
    [selectedAlgo]
  );

  const stopPlayback = useCallback(() => {
    playingRef.current = false;
    playRunRef.current += 1;

    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }

    setIsPlaying(false);
  }, []);

  const resetVisualization = useCallback(() => {
    stopPlayback();

    generatorRef.current = null;
    comparisonsRef.current = 0;

    setIsDone(false);
    setCurrentStep(null);
    setStepCount(0);
    setComparisons(0);
  }, [stopPlayback]);

  const randomArray = useCallback(size => {
    const safeSize = Math.max(4, Math.min(20, Number(size) || 10));

    const arr = Array.from(
      { length: safeSize },
      () => Math.floor(Math.random() * 90) + 10
    );

    setArray(arr);
    setArrayInput(arr.join(', '));
    setArraySize(safeSize);
    resetVisualization();
  }, [resetVisualization]);

  const parseNumberList = useCallback((text, label) => {
    const raw = String(text || '')
      .split(/[\s,;]+/)
      .map(s => s.trim())
      .filter(Boolean);

    const values = raw.map(Number);

    if (!values.length || values.some(v => !Number.isFinite(v))) {
      throw new Error(`${label}: enter valid numbers separated by commas.`);
    }

    return values;
  }, []);

  const validateCurrentInputs = useCallback(() => {
    const id = selectedAlgo?.id;

    try {
      if (
        [
          'bubble-sort',
          'selection-sort',
          'insertion-sort',
          'merge-sort',
          'quick-sort',
          'heap-sort',
          'binary-search',
          'optimal-merge',
        ].includes(id)
      ) {
        const values = parseNumberList(arrayInput, 'Array');

        if (values.length < 2) {
          throw new Error('Array: enter at least 2 numbers.');
        }

        if (values.length > 20) {
          throw new Error('Array: maximum 20 elements for visualization.');
        }

        if (id === 'binary-search') {
          const target = Number(searchTarget);

          if (!Number.isFinite(target)) {
            throw new Error('Search target: enter a valid number.');
          }

          return { array: values, target };
        }

        return { array: values };
      }

      if (id === 'prim-mst') {
        const edges = parseEdges(graphEdges, false);

        if (!edges.length) {
          throw new Error(
            "Prim's MST: enter edges like 0-1:4."
          );
        }

        const start = Number(graphStart);

        if (!Number.isFinite(start)) {
          throw new Error("Prim's MST: enter a valid start vertex.");
        }

        return { edges, start };
      }

      if (id === 'knapsack') {
        const weights = parseNumberList(
          knapsackWeights,
          'Weights'
        );

        const values = parseNumberList(
          knapsackValues,
          'Values'
        );

        const capacity = Number(knapsackCapacity);

        if (weights.length !== values.length) {
          throw new Error(
            'Knapsack: weights and values must contain the same number of items.'
          );
        }

        if (weights.length < 1) {
          throw new Error('Knapsack: enter at least one item.');
        }

        if (weights.length > 12) {
          throw new Error(
            'Knapsack: use at most 12 items for a smooth visualization.'
          );
        }

        if (
          weights.some(w => !Number.isInteger(w) || w <= 0) ||
          values.some(v => !Number.isFinite(v))
        ) {
          throw new Error(
            'Knapsack: weights must be positive integers and values must be numbers.'
          );
        }

        if (
          !Number.isInteger(capacity) ||
          capacity <= 0 ||
          capacity > 100
        ) {
          throw new Error(
            'Knapsack: capacity must be an integer from 1 to 100.'
          );
        }

        return { weights, values, capacity };
      }

      if (id === 'multistage') {
        const edges = parseEdges(graphEdges, true);

        if (!edges.length) {
          throw new Error(
            'Multistage Graph: enter directed edges like 0->1:4.'
          );
        }

        const source = Number(graphSource);
        const sink = Number(graphSink);

        if (!Number.isFinite(source) || !Number.isFinite(sink)) {
          throw new Error(
            'Multistage Graph: enter valid source and sink vertices.'
          );
        }

        return { edges, source, sink };
      }

      if (id === 'graph-coloring') {
        const edges = parseEdges(graphEdges, false);
        const colors = Number(colorCount);

        if (!edges.length) {
          throw new Error(
            'Graph Coloring: enter graph edges like 0-1.'
          );
        }

        if (!Number.isInteger(colors) || colors < 1 || colors > 6) {
          throw new Error(
            'Graph Coloring: colors must be an integer from 1 to 6.'
          );
        }

        return { edges, colors };
      }

      if (id === 'tsp') {
        const matrix = parseMatrix(tspMatrix);

        if (matrix.length < 2) {
          throw new Error(
            'TSP: enter a matrix with at least 2 rows.'
          );
        }

        if (matrix.length > 8) {
          throw new Error(
            'TSP: use at most 8 cities because the exact algorithm is factorial.'
          );
        }

        if (matrix.some(row => row.length !== matrix.length)) {
          throw new Error(
            'TSP: the distance matrix must be square.'
          );
        }

        if (matrix.some(row => row.some(v => !Number.isFinite(v) || v < 0))) {
          throw new Error(
            'TSP: distances must be non-negative numbers.'
          );
        }

        return { matrix };
      }

      if (id === 'bfs' || id === 'dfs') {
        const edges = parseEdges(graphEdges, true);

        if (!edges.length) {
          throw new Error(
            `${id.toUpperCase()}: enter directed edges like 0->1.`
          );
        }

        const start = Number(graphStart);

        if (!Number.isFinite(start)) {
          throw new Error(
            `${id.toUpperCase()}: enter a valid start vertex.`
          );
        }

        return { edges, start };
      }

      if (id === 'bst') {
        const values = parseNumberList(bstValues, 'BST values');

        if (values.length < 1) {
          throw new Error('BST: enter at least one value.');
        }

        if (values.length > 30) {
          throw new Error('BST: maximum 30 values.');
        }

        const search = bstSearch.trim() === ''
          ? NaN
          : Number(bstSearch);

        const deletion = bstDelete.trim() === ''
          ? NaN
          : Number(bstDelete);

        if (!Number.isFinite(search) && bstSearch.trim() !== '') {
          throw new Error('BST search value must be a number.');
        }

        if (!Number.isFinite(deletion) && bstDelete.trim() !== '') {
          throw new Error('BST delete value must be a number.');
        }

        return {
          values,
          searchValue: search,
          deleteValue: deletion,
        };
      }

      throw new Error('This algorithm is not configured yet.');
    } catch (error) {
      alert(error.message);
      return null;
    }
  }, [
    selectedAlgo,
    arrayInput,
    searchTarget,
    graphEdges,
    graphStart,
    graphSource,
    graphSink,
    knapsackWeights,
    knapsackValues,
    knapsackCapacity,
    colorCount,
    tspMatrix,
    bstValues,
    bstSearch,
    bstDelete,
    parseNumberList,
  ]);

  const applyInputs = useCallback(() => {
    const data = validateCurrentInputs();

    if (!data) return;

    if (data.array) {
      setArray(data.array);
      setArrayInput(data.array.join(', '));
      setArraySize(data.array.length);
    }

    resetVisualization();
  }, [validateCurrentInputs, resetVisualization]);

  const getGenerator = useCallback(() => {
    const id = selectedAlgo?.id;
    const data = validateCurrentInputs();

    if (!data) return null;

    if (id === 'bubble-sort') return bubbleSortGen(data.array);
    if (id === 'selection-sort') return selectionSortGen(data.array);
    if (id === 'insertion-sort') return insertionSortGen(data.array);
    if (id === 'merge-sort') return mergeSortGen(data.array);
    if (id === 'quick-sort') return quickSortGen(data.array);
    if (id === 'heap-sort') return heapSortGen(data.array);
    if (id === 'binary-search') {
      return binarySearchGen(data.array, data.target);
    }
    if (id === 'optimal-merge') {
      return optimalMergeGen(data.array);
    }
    if (id === 'prim-mst') {
      return primMstGen(data.edges, data.start);
    }
    if (id === 'knapsack') {
      return knapsackGen(
        data.weights,
        data.values,
        data.capacity
      );
    }
    if (id === 'multistage') {
      return multistageGen(
        data.edges,
        data.source,
        data.sink
      );
    }
    if (id === 'graph-coloring') {
      return graphColoringGen(
        data.edges,
        data.colors
      );
    }
    if (id === 'tsp') {
      return tspGen(data.matrix);
    }
    if (id === 'bfs') {
      return bfsGen(data.edges, data.start);
    }
    if (id === 'dfs') {
      return dfsGen(data.edges, data.start);
    }
    if (id === 'bst') {
      return bstGen(
        data.values,
        data.searchValue,
        data.deleteValue
      );
    }

    return null;
  }, [selectedAlgo, validateCurrentInputs]);

  const consumeNextStep = useCallback(() => {
    if (!generatorRef.current) {
      const generator = getGenerator();

      if (!generator) {
        return false;
      }

      generatorRef.current = generator;
    }

    let result;

    try {
      result = generatorRef.current.next();
    } catch (error) {
      console.error('Visualizer step error:', error);
      stopPlayback();
      setIsDone(true);
      return false;
    }

    if (result.done) {
      setIsDone(true);
      return false;
    }

    const step = result.value || {};

    setCurrentStep(step);
    setStepCount(count => count + 1);

    if (step.comparing) {
      comparisonsRef.current += 1;
      setComparisons(comparisonsRef.current);
    }

    if (step.done) {
      setIsDone(true);
      return false;
    }

    return true;
  }, [getGenerator, stopPlayback]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const stepForward = useCallback(() => {
    if (isDone) return;

    // Manual Step pauses automatic playback first.
    stopPlayback();
    consumeNextStep();
  }, [isDone, stopPlayback, consumeNextStep]);

  const playLoop = useCallback(async runId => {
    while (
      playingRef.current &&
      playRunRef.current === runId
    ) {
      const shouldContinue = consumeNextStep();

      if (!shouldContinue) {
        playingRef.current = false;
        setIsPlaying(false);
        break;
      }

      await new Promise(resolve => {
        playTimerRef.current = setTimeout(() => {
          playTimerRef.current = null;
          resolve();
        }, Math.max(20, Number(speedRef.current) || 300));
      });
    }
  }, [consumeNextStep]);

  const playPause = useCallback(() => {
    if (isDone) return;

    if (playingRef.current) {
      stopPlayback();
      return;
    }

    playingRef.current = true;
    const runId = ++playRunRef.current;
    setIsPlaying(true);

    playLoop(runId);
  }, [isDone, stopPlayback, playLoop]);

  useEffect(() => {
    return () => {
      playingRef.current = false;
      playRunRef.current += 1;

      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
    };
  }, []);

  const selectAlgorithm = algo => {
    resetVisualization();
    setSelectedAlgo(algo);
  };

  useEffect(() => {
    let cancelled = false;

    fetch('http://127.0.0.1:8000/api/visualizer/algorithms/')
      .then(response => {
        if (!response.ok) throw new Error('API error');
        return response.json();
      })
      .then(data => {
        if (cancelled || !Array.isArray(data)) return;

        const apiMap = new Map(
          data.map(item => [item.id, item])
        );

        const merged = EXTRA_ALGORITHMS.map(item => ({
          ...item,
          ...(apiMap.get(item.id) || {}),
        }));

        setAlgorithms(merged);

        const requestedId = new URLSearchParams(
          window.location.search
        ).get('algo');

        const requested = requestedId
          ? merged.find(item => item.id === requestedId)
          : null;

        setSelectedAlgo(requested || merged[0]);
      })
      .catch(() => {
        if (!cancelled) {
          setAlgorithms(EXTRA_ALGORITHMS);

          const requestedId = new URLSearchParams(
            window.location.search
          ).get('algo');

          const requested = requestedId
            ? EXTRA_ALGORITHMS.find(
                item => item.id === requestedId
              )
            : null;

          setSelectedAlgo(
            requested || EXTRA_ALGORITHMS[0]
          );
        }
      });

    const initial = [
      38, 12, 51, 90, 81,
      86, 96, 59, 55, 73
    ];

    setArray(initial);

    return () => {
      cancelled = true;
    };
  }, []);

  const displayArray =
    currentStep?.array || array;

  const maxVal = Math.max(
    ...displayArray.map(v => Math.abs(v)),
    1
  );

  const getBarState = index => {
    if (!currentStep) return 'default';

    if (
      currentStep.done &&
      currentStep.sorted?.includes(index)
    ) {
      return 'sorted';
    }

    if (currentStep.found === index) return 'found';
    if (currentStep.notFound) return 'discarded';
    if (currentStep.discarded?.includes(index)) return 'discarded';
    if (currentStep.searching === index) return 'searching';
    if (currentStep.pivot === index) return 'pivot';
    if (currentStep.swapping?.includes(index)) return 'swapping';
    if (currentStep.comparing?.includes(index)) return 'comparing';
    if (currentStep.sorted?.includes(index)) return 'sorted';

    return 'default';
  };

  const handleArrayInputKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyInputs();
    }
  };

  const advancedInputTitle = () => {
    const id = selectedAlgo?.id;

    if (id === 'prim-mst') return "Prim's MST Input";
    if (id === 'knapsack') return '0/1 Knapsack Input';
    if (id === 'multistage') return 'Multistage Graph Input';
    if (id === 'graph-coloring') return 'Graph Coloring Input';
    if (id === 'tsp') return 'TSP Distance Matrix';
    if (id === 'bfs' || id === 'dfs') return `${selectedAlgo.name} Input`;
    if (id === 'bst') return 'Binary Search Tree Input';

    return null;
  };

  const renderAdvancedInput = () => {
    const id = selectedAlgo?.id;

    if (
      [
        'bubble-sort',
        'selection-sort',
        'insertion-sort',
        'merge-sort',
        'quick-sort',
        'heap-sort',
        'binary-search',
        'optimal-merge',
      ].includes(id)
    ) {
      return (
        <>
          <div style={S.customRow}>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              style={S.input}
              placeholder="Custom array: 45, 12, 78, 34, 56 ..."
              value={arrayInput}
              onChange={event => setArrayInput(event.target.value)}
              onKeyDown={handleArrayInputKeyDown}
              aria-label="Custom array"
            />

            <button
              type="button"
              style={S.applyBtn}
              onClick={applyInputs}
            >
              Apply
            </button>
          </div>

          {isBinarySearch && (
            <div style={S.customRow}>
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                style={S.input}
                placeholder="Search target..."
                value={searchTarget}
                onChange={event =>
                  setSearchTarget(event.target.value)
                }
                aria-label="Binary search target"
              />
            </div>
          )}
        </>
      );
    }

    if (id === 'prim-mst') {
      return (
        <>
          <TextAreaField
            label="Undirected weighted edges"
            value={graphEdges}
            onChange={setGraphEdges}
            placeholder={'0-1:4\n0-2:2\n1-2:1\n2-3:8'}
            help="Format: u-v:weight"
          />

          <div style={S.inputGrid}>
            <InputField
              label="Start vertex"
              value={graphStart}
              onChange={setGraphStart}
            />
          </div>

          <ApplyButton onClick={applyInputs} />
        </>
      );
    }

    if (id === 'knapsack') {
      return (
        <>
          <div style={S.inputGrid}>
            <InputField
              label="Weights"
              value={knapsackWeights}
              onChange={setKnapsackWeights}
              placeholder="10, 20, 30"
            />

            <InputField
              label="Values"
              value={knapsackValues}
              onChange={setKnapsackValues}
              placeholder="60, 100, 120"
            />

            <InputField
              label="Capacity"
              value={knapsackCapacity}
              onChange={setKnapsackCapacity}
              placeholder="50"
            />
          </div>

          <ApplyButton onClick={applyInputs} />
        </>
      );
    }

    if (id === 'multistage') {
      return (
        <>
          <TextAreaField
            label="Directed weighted edges"
            value={graphEdges}
            onChange={setGraphEdges}
            placeholder={'0->1:2\n0->2:1\n1->3:2\n2->3:5'}
            help="Format: u->v:weight"
          />

          <div style={S.inputGrid}>
            <InputField
              label="Source"
              value={graphSource}
              onChange={setGraphSource}
            />

            <InputField
              label="Sink"
              value={graphSink}
              onChange={setGraphSink}
            />
          </div>

          <ApplyButton onClick={applyInputs} />
        </>
      );
    }

    if (id === 'graph-coloring') {
      return (
        <>
          <TextAreaField
            label="Undirected graph edges"
            value={graphEdges}
            onChange={setGraphEdges}
            placeholder={'0-1\n0-2\n1-2\n1-3'}
            help="Format: u-v"
          />

          <div style={S.inputGrid}>
            <InputField
              label="Number of colors"
              value={colorCount}
              onChange={setColorCount}
            />
          </div>

          <ApplyButton onClick={applyInputs} />
        </>
      );
    }

    if (id === 'tsp') {
      return (
        <>
          <TextAreaField
            label="Distance matrix"
            value={tspMatrix}
            onChange={setTspMatrix}
            placeholder={'0 10 15 20\n10 0 35 25\n15 35 0 30\n20 25 30 0'}
            help="Enter a square matrix. Separate values with spaces or commas."
            rows={6}
          />

          <ApplyButton onClick={applyInputs} />
        </>
      );
    }

    if (id === 'bfs' || id === 'dfs') {
      return (
        <>
          <TextAreaField
            label="Directed graph edges"
            value={graphEdges}
            onChange={setGraphEdges}
            placeholder={'0->1\n0->2\n1->3\n1->4'}
            help="Format: u->v"
          />

          <div style={S.inputGrid}>
            <InputField
              label="Start vertex"
              value={graphStart}
              onChange={setGraphStart}
            />
          </div>

          <ApplyButton onClick={applyInputs} />
        </>
      );
    }

    if (id === 'bst') {
      return (
        <>
          <div style={S.customRow}>
            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
              style={S.input}
              placeholder="BST values: 50, 30, 70, 20..."
              value={bstValues}
              onChange={event =>
                setBstValues(event.target.value)
              }
            />
          </div>

          <div style={S.inputGrid}>
            <InputField
              label="Search value"
              value={bstSearch}
              onChange={setBstSearch}
              placeholder="40"
            />

            <InputField
              label="Delete value"
              value={bstDelete}
              onChange={setBstDelete}
              placeholder="30"
            />
          </div>

          <ApplyButton onClick={applyInputs} />
        </>
      );
    }

    return null;
  };

  return (
    <div style={S.container}>
      <div style={S.header}>
        <div style={S.headerBadge}>
          ⚡ Algorithm Visualizer
        </div>

        <h1 style={S.title}>
          Visual <span style={S.highlight}>Playground</span>
        </h1>

        <p style={S.subtitle}>
          Use your own input and watch every algorithm work step by step.
        </p>
      </div>

      <div style={S.body}>
        <div style={S.leftPanel}>
          <div style={S.panel}>
            <div style={S.panelTitle}>
              🧠 Algorithm
            </div>

            <div style={S.algoList}>
              {algorithms.map(algo => (
                <button
                  type="button"
                  key={algo.id}
                  style={{
                    ...S.algoBtn,
                    ...(selectedAlgo?.id === algo.id
                      ? S.algoBtnActive
                      : {}),
                  }}
                  onClick={() => selectAlgorithm(algo)}
                >
                  <span>{algo.name}</span>
                  <span style={S.algoCat}>
                    {algo.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {selectedAlgo && (
            <div style={S.panel}>
              <div style={S.panelTitle}>
                📊 Complexity
              </div>

              <p style={S.algoDesc}>
                {selectedAlgo.description}
              </p>

              <div style={S.complexityGrid}>
                <div style={S.cRow}>
                  <span style={S.cLabel}>Best</span>
                  <span style={S.cBest}>
                    {selectedAlgo.time_best}
                  </span>
                </div>

                <div style={S.cRow}>
                  <span style={S.cLabel}>Avg</span>
                  <span style={S.cAvg}>
                    {selectedAlgo.time_avg}
                  </span>
                </div>

                <div style={S.cRow}>
                  <span style={S.cLabel}>Worst</span>
                  <span style={S.cWorst}>
                    {selectedAlgo.time_worst}
                  </span>
                </div>

                <div style={S.cRow}>
                  <span style={S.cLabel}>Space</span>
                  <span style={S.cSpace}>
                    {selectedAlgo.space}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div style={S.panel}>
            <div style={S.panelTitle}>
              🎨 Legend
            </div>

            <div style={S.legendList}>
              {[
                { color: '#18392B', label: 'Default' },
                { color: '#A3B18A', label: 'Comparing' },
                { color: '#6E5340', label: 'Swapping / Pivot' },
                { color: '#3A5A40', label: 'Sorted / Found' },
                { color: '#566061', label: 'Discarded' },
              ].map(item => (
                <div key={item.label} style={S.legendRow}>
                  <div
                    style={{
                      ...S.legendDot,
                      background: item.color,
                    }}
                  />
                  <span style={S.legendLabel}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={S.rightPanel}>
          <div style={S.controlsPanel}>
            <div style={S.controlRow}>
              {isArrayAlgorithm && (
                <div style={S.controlGroup}>
                  <label style={S.label}>
                    Array Size: {arraySize}
                  </label>

                  <input
                    type="range"
                    min="4"
                    max="20"
                    value={arraySize}
                    style={S.slider}
                    onChange={event => {
                      const size = Number(event.target.value);
                      randomArray(size);
                    }}
                  />
                </div>
              )}

              <div style={S.controlGroup}>
                <label style={S.label}>
                  Speed
                </label>

                <input
                  type="range"
                  min="50"
                  max="1000"
                  value={1050 - speed}
                  style={S.slider}
                  onChange={event =>
                    setSpeed(
                      1050 - Number(event.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div style={S.advancedBox}>
              <div style={S.advancedTitle}>
                {advancedInputTitle()}
              </div>

              {renderAdvancedInput()}
            </div>

            <div style={S.btnRow}>
              <button
                type="button"
                style={S.resetBtn}
                onClick={resetVisualization}
              >
                ↺ Reset
              </button>

              <button
                type="button"
                style={S.stepBtn}
                onClick={stepForward}
                disabled={isDone}
              >
                ⏭ Step
              </button>

              <button
                type="button"
                style={{
                  ...S.playBtn,
                  ...(isPlaying ? S.pauseBtn : {}),
                }}
                onClick={playPause}
                disabled={isDone}
              >
                {isDone
                  ? '✅ Done'
                  : isPlaying
                    ? '⏸ Pause'
                    : '▶ Play'}
              </button>
            </div>

            <div style={S.statsRow}>
              <div style={S.stat}>
                <span style={S.statVal}>
                  {stepCount}
                </span>
                <span style={S.statLbl}>
                  Steps
                </span>
              </div>

              <div style={S.stat}>
                <span style={S.statVal}>
                  {comparisons}
                </span>
                <span style={S.statLbl}>
                  Comparisons
                </span>
              </div>

              <div style={S.stat}>
                <span style={S.statVal}>
                  {isArrayAlgorithm
                    ? displayArray.length
                    : '—'}
                </span>
                <span style={S.statLbl}>
                  Elements
                </span>
              </div>

              <div style={S.stat}>
                <span
                  style={{
                    ...S.statVal,
                    color: isDone
                      ? '#3A5A40'
                      : isPlaying
                        ? '#A3B18A'
                        : '#344E41',
                  }}
                >
                  {isDone
                    ? 'Done'
                    : isPlaying
                      ? 'Running'
                      : 'Ready'}
                </span>

                <span style={S.statLbl}>
                  Status
                </span>
              </div>
            </div>
          </div>

          <div style={S.vizArea}>
            {currentStep?.type ? (
              <TableScene step={currentStep} />
            ) : (
              <>
                {currentStep?.notFound && (
                  <div style={S.notFoundMsg}>
                    ❌ Element not found in array
                  </div>
                )}

                {currentStep?.found !== undefined && (
                  <div style={S.foundMsg}>
                    ✅ Found at sorted index {currentStep.found}!
                  </div>
                )}

                {isArrayAlgorithm ? (
                  <div style={S.barsContainer}>
                    {displayArray.map((value, index) => (
                      <Bar
                        key={`${index}-${value}`}
                        value={value}
                        maxValue={maxVal}
                        state={getBarState(index)}
                        totalBars={displayArray.length}
                      />
                    ))}
                  </div>
                ) : (
                  !currentStep && (
                    <div style={S.emptyViz}>
                      <div style={S.emptyVizIcon}>▶</div>
                      <h3>Ready to visualize</h3>
                      <p>
                        Enter your algorithm data above, click
                        <b> Apply </b>
                        and then use Step or Play.
                      </p>
                    </div>
                  )
                )}

                {isBinarySearch && currentStep && (
                  <div style={S.searchInfo}>
                    <span style={S.searchSpan}>
                      Low: {currentStep.low ?? '-'}
                    </span>
                    <span style={S.searchSpan}>
                      Mid:{' '}
                      {currentStep.searching ??
                        currentStep.found ??
                        '-'}
                    </span>
                    <span style={S.searchSpan}>
                      High: {currentStep.high ?? '-'}
                    </span>
                    <span style={S.searchSpan}>
                      Target: {searchTarget}
                    </span>
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

/* ============================================================
   SMALL INPUT COMPONENTS
   ============================================================ */

function InputField({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label style={S.field}>
      <span style={S.fieldLabel}>{label}</span>
      <input
        type="text"
        autoComplete="off"
        spellCheck={false}
        style={S.input}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  help,
  rows = 4,
}) {
  return (
    <label style={S.field}>
      <span style={S.fieldLabel}>{label}</span>

      <textarea
        rows={rows}
        spellCheck={false}
        style={S.textarea}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />

      {help && (
        <span style={S.helpText}>
          {help}
        </span>
      )}
    </label>
  );
}

function ApplyButton({ onClick }) {
  return (
    <div style={S.applyRow}>
      <button
        type="button"
        style={S.applyBtn}
        onClick={onClick}
      >
        Apply Input
      </button>
    </div>
  );
}

/* ============================================================
   STYLES
   ============================================================ */

const S = {
  container: {
    backgroundColor: '#C5BEA9',
    minHeight: '100vh',
    paddingBottom: '60px',
  },

  header: {
    textAlign: 'center',
    padding: '50px 20px 30px',
    background:
      'linear-gradient(180deg, rgba(24,57,43,0.15) 0%, transparent 100%)',
    borderBottom: '1px solid rgba(52,78,65,0.2)',
  },

  headerBadge: {
    display: 'inline-block',
    background: 'rgba(52,78,65,0.15)',
    border: '1px solid rgba(52,78,65,0.35)',
    color: '#000000',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    marginBottom: '16px',
  },

  title: {
    color: '#FFFFFF',
    fontSize: '2.8rem',
    fontWeight: '800',
    marginBottom: '10px',
  },

  highlight: {
    color: '#344E41',
    textShadow: '0 0 30px rgba(52,78,65,0.5)',
  },

  subtitle: {
    color: '#344E41',
    fontSize: '1rem',
  },

  body: {
    display: 'flex',
    gap: '24px',
    padding: '30px 40px',
    alignItems: 'flex-start',
  },

  leftPanel: {
    width: '260px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  rightPanel: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  panel: {
    background: 'rgba(52,78,65,0.06)',
    border: '1px solid rgba(52,78,65,0.2)',
    borderRadius: '16px',
    padding: '20px',
  },

  panelTitle: {
    color: '#344E41',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '14px',
    textTransform: 'uppercase',
  },

  algoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  algoBtn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(52,78,65,0.2)',
    background: 'transparent',
    color: '#000000',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },

  algoBtnActive: {
    background:
      'linear-gradient(135deg, #18392B, #344E41)',
    border: '1px solid #344E41',
    color: 'white',
    boxShadow:
      '0 0 15px rgba(52,78,65,0.3)',
  },

  algoCat: {
    fontSize: '10px',
    color: '#18392B',
    background: 'rgba(24,57,43,0.15)',
    padding: '2px 6px',
    borderRadius: '10px',
    whiteSpace: 'nowrap',
  },

  algoDesc: {
    color: '#344E41',
    fontSize: '0.85rem',
    lineHeight: '1.6',
    marginBottom: '14px',
  },

  complexityGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  cRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },

  cLabel: {
    color: '#344E41',
    fontSize: '12px',
  },

  cBest: {
    color: '#3A5A40',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: 'monospace',
  },

  cAvg: {
    color: '#3A5A40',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: 'monospace',
  },

  cWorst: {
    color: '#6E5340',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: 'monospace',
  },

  cSpace: {
    color: '#344E41',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: 'monospace',
  },

  legendList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  legendRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '3px',
    flexShrink: 0,
  },

  legendLabel: {
    color: '#000000',
    fontSize: '13px',
  },

  controlsPanel: {
    background: 'rgba(52,78,65,0.06)',
    border: '1px solid rgba(52,78,65,0.2)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  controlRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },

  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minWidth: '220px',
  },

  label: {
    color: '#000000',
    fontSize: '13px',
    fontWeight: '600',
  },

  slider: {
    accentColor: '#344E41',
    cursor: 'pointer',
    width: '100%',
  },

  advancedBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '14px',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.06)',
    border: '1px solid rgba(52,78,65,0.18)',
  },

  advancedTitle: {
    color: '#18392B',
    fontWeight: '800',
    fontSize: '14px',
  },

  customRow: {
    display: 'flex',
    gap: '10px',
    width: '100%',
  },

  inputGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
  },

  fieldLabel: {
    color: '#18392B',
    fontSize: '12px',
    fontWeight: '700',
  },

  input: {
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(52,78,65,0.3)',
    background: 'rgba(0,0,0,0.3)',
    color: '#FFFFFF',
    fontSize: '14px',
    outline: 'none',
    cursor: 'text',
    pointerEvents: 'auto',
    userSelect: 'text',
    WebkitUserSelect: 'text',
    position: 'relative',
    zIndex: 20,
  },

  textarea: {
    width: '100%',
    minHeight: '90px',
    boxSizing: 'border-box',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(52,78,65,0.3)',
    background: 'rgba(0,0,0,0.3)',
    color: '#FFFFFF',
    fontSize: '13px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'monospace',
    lineHeight: '1.5',
    pointerEvents: 'auto',
    userSelect: 'text',
    WebkitUserSelect: 'text',
    position: 'relative',
    zIndex: 20,
  },

  helpText: {
    color: '#344E41',
    fontSize: '11px',
  },

  applyRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },

  applyBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    background:
      'linear-gradient(135deg, #18392B, #344E41)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },

  btnRow: {
    display: 'flex',
    gap: '10px',
  },

  resetBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: '1px solid rgba(52,78,65,0.3)',
    background: 'transparent',
    color: '#000000',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },

  stepBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: '1px solid rgba(52,78,65,0.3)',
    background: 'transparent',
    color: '#000000',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },

  playBtn: {
    flex: 1,
    padding: '10px 20px',
    borderRadius: '10px',
    background:
      'linear-gradient(135deg, #18392B, #344E41)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    boxShadow:
      '0 0 20px rgba(52,78,65,0.4)',
  },

  pauseBtn: {
    background:
      'linear-gradient(135deg, #3A5A40, #A3B18A)',
  },

  statsRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },

  stat: {
    flex: 1,
    minWidth: '100px',
    textAlign: 'center',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    padding: '10px',
    border:
      '1px solid rgba(52,78,65,0.15)',
  },

  statVal: {
    display: 'block',
    color: '#344E41',
    fontSize: '1.4rem',
    fontWeight: '800',
  },

  statLbl: {
    color: '#344E41',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  vizArea: {
    background: 'rgba(52,78,65,0.04)',
    border: '1px solid rgba(52,78,65,0.2)',
    borderRadius: '16px',
    padding: '24px',
    minHeight: '420px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: '12px',
    position: 'relative',
    overflow: 'hidden',
  },

  barsContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '4px',
    height: '300px',
    width: '100%',
    overflowX: 'auto',
  },

  searchInfo: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: '10px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
  },

  searchSpan: {
    color: '#000000',
    fontSize: '13px',
    fontWeight: '600',
  },

  foundMsg: {
    textAlign: 'center',
    color: '#3A5A40',
    fontSize: '1rem',
    fontWeight: '700',
    background: 'rgba(58,90,64,0.1)',
    border:
      '1px solid rgba(58,90,64,0.3)',
    borderRadius: '10px',
    padding: '10px',
  },

  notFoundMsg: {
    textAlign: 'center',
    color: '#6E5340',
    fontSize: '1rem',
    fontWeight: '700',
    background: 'rgba(110,83,64,0.1)',
    border:
      '1px solid rgba(110,83,64,0.3)',
    borderRadius: '10px',
    padding: '10px',
  },

  emptyViz: {
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#344E41',
  },

  emptyVizIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#18392B',
    color: 'white',
    fontSize: '22px',
    marginBottom: '12px',
  },

  scene: {
    width: '100%',
    minHeight: '330px',
    color: '#000000',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },

  sceneTitle: {
    color: '#000000',
    fontSize: '16px',
    fontWeight: '800',
    textAlign: 'center',
  },

  graphWrap: {
    display: 'flex',
    justifyContent: 'center',
    background: 'rgba(0,0,0,.08)',
    borderRadius: '12px',
    padding: '8px',
  },

  tokenRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontSize: '13px',
  },

  token: {
    padding: '4px 9px',
    borderRadius: '8px',
    background: 'rgba(24,57,43,.2)',
    border:
      '1px solid rgba(58,90,64,.3)',
    color: '#000000',
    fontWeight: '700',
  },

  sceneNote: {
    textAlign: 'center',
    padding: '10px',
    borderRadius: '10px',
    background: 'rgba(24,57,43,.08)',
    color: '#000000',
    fontSize: '13px',
  },

  totalBox: {
    textAlign: 'center',
    padding: '11px',
    borderRadius: '10px',
    background: 'rgba(58,90,64,.08)',
    border:
      '1px solid rgba(58,90,64,.22)',
    color: '#3A5A40',
    fontSize: '13px',
  },

  heapRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    padding: '25px 10px',
  },

  heapBox: {
    minWidth: '58px',
    padding: '13px 10px',
    textAlign: 'center',
    borderRadius: '10px',
    background: 'rgba(24,57,43,.18)',
    border:
      '1px solid rgba(58,90,64,.3)',
    color: '#000000',
    fontWeight: '800',
  },

  heapActive: {
    background: 'rgba(163,177,138,.2)',
    border: '1px solid #A3B18A',
    boxShadow:
      '0 0 14px rgba(163,177,138,.25)',
  },

  edgeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
    maxWidth: '620px',
    width: '100%',
    margin: '0 auto',
    maxHeight: '240px',
    overflowY: 'auto',
  },

  edgeRow: {
    display: 'grid',
    gridTemplateColumns:
      '1fr 1fr 1fr',
    gap: '8px',
    padding: '9px 12px',
    borderRadius: '8px',
    background: 'rgba(0,0,0,.08)',
    fontSize: '12px',
  },

  itemRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },

  itemChip: {
    padding: '7px 10px',
    borderRadius: '8px',
    background: 'rgba(24,57,43,.15)',
    border:
      '1px solid rgba(58,90,64,.25)',
    fontSize: '11px',
  },

  tableScroll: {
    overflowX: 'auto',
    maxWidth: '100%',
  },

  dpTable: {
    borderCollapse: 'collapse',
    margin: '0 auto',
    fontSize: '11px',
    color: '#000000',
  },

  cellActive: {
    background: 'rgba(163,177,138,.35)',
    color: '#000000',
    fontWeight: '800',
  },

  stageRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    padding: '20px',
  },

  stageBox: {
    minWidth: '65px',
    padding: '12px',
    borderRadius: '10px',
    background: 'rgba(24,57,43,.15)',
    border:
      '1px solid rgba(58,90,64,.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
  },

  boxActive: {
    background: 'rgba(163,177,138,.3)',
    border: '1px solid #A3B18A',
  },

  colorNodes: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '30px 10px',
  },

  colorNode: {
    width: '65px',
    minHeight: '65px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
  },

  routeBox: {
    textAlign: 'center',
    padding: '20px',
    borderRadius: '12px',
    background: 'rgba(24,57,43,.12)',
    border:
      '1px solid rgba(58,90,64,.3)',
    fontWeight: '800',
    fontSize: '16px',
    overflowX: 'auto',
  },

  errorBox: {
    textAlign: 'center',
    padding: '20px',
    borderRadius: '12px',
    background: 'rgba(110,83,64,.12)',
    border:
      '1px solid rgba(110,83,64,.3)',
    color: '#6E5340',
    fontWeight: '700',
  },

  bstWrap: {
    minHeight: '260px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '30px 10px',
    overflow: 'auto',
  },

  bstCircle: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    background: '#18392B',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    border: '2px solid #3A5A40',
    boxShadow:
      '0 4px 12px rgba(0,0,0,.2)',
  },

  emptyNode: {
    color: '#566061',
    fontSize: '16px',
  },
};

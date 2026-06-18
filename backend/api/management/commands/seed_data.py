from django.core.management.base import BaseCommand
from api.models import Note, PYQ

class Command(BaseCommand):
    help = 'Seed ADA notes and PYQs'

    def handle(self, *args, **kwargs):
        Note.objects.all().delete()
        PYQ.objects.all().delete()

        notes = [
            {
                'unit': 1,
                'title': 'Introduction to Algorithms',
                'content': '''An algorithm is a finite set of well-defined instructions to solve a problem.

Properties of a Good Algorithm:
- Input: Zero or more inputs
- Output: At least one output
- Definiteness: Each step is clearly defined
- Finiteness: Algorithm must terminate
- Effectiveness: Each step must be feasible

Algorithm Analysis:
- Time Complexity: Amount of time taken
- Space Complexity: Amount of memory used
- Best Case: Minimum time (Omega notation)
- Worst Case: Maximum time (O notation)
- Average Case: Expected time (Theta notation)

Asymptotic Notations:
- O (Big-Oh): Upper bound
- Omega: Lower bound
- Theta: Tight bound

Common Complexities (Best to Worst):
O(1) < O(log n) < O(n) < O(n log n) < O(n2) < O(2n) < O(n!)'''
            },
            {
                'unit': 1,
                'title': 'Divide and Conquer',
                'content': '''Divide and Conquer breaks a problem into smaller subproblems, solves them, and combines results.

Steps:
1. DIVIDE: Break problem into smaller subproblems
2. CONQUER: Solve subproblems recursively
3. COMBINE: Merge solutions

Master Theorem:
T(n) = aT(n/b) + f(n)
Case 1: f(n) = O(n^(log_b(a)-e)) then T(n) = Theta(n^log_b(a))
Case 2: f(n) = Theta(n^log_b(a)) then T(n) = Theta(n^log_b(a) x log n)
Case 3: f(n) = Omega(n^(log_b(a)+e)) then T(n) = Theta(f(n))

Key Algorithms:
- Binary Search: T(n) = T(n/2) + O(1) = O(log n)
- Merge Sort: T(n) = 2T(n/2) + O(n) = O(n log n)
- Quick Sort: Average O(n log n), Worst O(n2)
- Strassen Matrix Multiplication: O(n^2.81)'''
            },
            {
                'unit': 2,
                'title': 'Greedy Algorithms',
                'content': '''Greedy algorithms make locally optimal choices at each step.

Properties:
- Greedy Choice Property: Local optimal leads to Global optimal
- Optimal Substructure: Optimal solution contains optimal subsolutions

Activity Selection Problem:
- Select maximum non-overlapping activities
- Sort by finish time, always pick earliest finishing
- Time Complexity: O(n log n)

Fractional Knapsack:
- Items can be broken into fractions
- Calculate value/weight ratio for each item
- Greedily pick highest ratio items
- Time: O(n log n)

Huffman Coding:
- Variable length prefix codes for data compression
- Frequent characters get shorter codes
- Build min-heap, extract two minimums, merge
- Time: O(n log n)

Note: Greedy does NOT work for 0/1 Knapsack!'''
            },
            {
                'unit': 2,
                'title': 'Graph Algorithms - MST',
                'content': '''Minimum Spanning Tree (MST):
A spanning tree with minimum total edge weight.

Kruskal Algorithm:
1. Sort all edges by weight
2. Pick smallest edge that does not form cycle
3. Use Union-Find to detect cycles
4. Repeat until n-1 edges selected
Time: O(E log E)

Prim Algorithm:
1. Start with any vertex
2. Add minimum weight edge connecting tree to non-tree vertex
3. Repeat until all vertices included
Time: O(E log V) with priority queue

Dijkstra Shortest Path:
1. Initialize distances (source=0, others=infinity)
2. Pick unvisited vertex with minimum distance
3. Update neighbors distances
4. Repeat until all visited
Time: O((V+E) log V)
Note: Only works with NON-NEGATIVE weights!

Bellman-Ford Algorithm:
- Works with negative weights
- Detects negative cycles
- Time: O(VE)'''
            },
            {
                'unit': 3,
                'title': 'Dynamic Programming',
                'content': '''Dynamic Programming solves problems by breaking into overlapping subproblems and storing results.

Key Concepts:
- Overlapping Subproblems: Same subproblems solved multiple times
- Optimal Substructure: Optimal solution from optimal subproblems
- Memoization: Top-down DP (store results)
- Tabulation: Bottom-up DP (fill table)

0/1 Knapsack:
- Items cannot be broken
- dp[i][w] = max value using first i items with capacity w
- Time: O(nW), Space: O(nW)

Longest Common Subsequence (LCS):
- Find longest sequence common to both strings
- If X[i]==Y[j]: dp[i][j] = dp[i-1][j-1] + 1
- Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
- Time: O(mn)

Matrix Chain Multiplication:
- Find optimal parenthesization to minimize multiplications
- Time: O(n3)

Floyd-Warshall All Pairs Shortest Path:
- Find shortest path between ALL pairs of vertices
- Works with negative weights (no negative cycles)
- Time: O(V3), Space: O(V2)'''
            },
            {
                'unit': 4,
                'title': 'Backtracking',
                'content': '''Backtracking explores all possible solutions by building candidates and abandoning invalid ones.

Concept:
- Try a choice, If fails, Undo (backtrack), Try next choice
- Systematic exhaustive search with pruning

N-Queens Problem:
- Place N queens on NxN board so no two attack each other
- Place queen column by column
- Check: no same row, column, or diagonal
- Backtrack if no valid position
- Solutions for N=8: 92

Graph Coloring:
- Color graph vertices so no two adjacent vertices have same color
- Find minimum colors needed (chromatic number)
- NP-Complete problem

Hamiltonian Circuit:
- Visit every vertex exactly once and return to start
- NP-Complete problem

Subset Sum Problem:
- Find subset with given sum
- Include or exclude each element
- Backtrack if sum exceeds target'''
            },
            {
                'unit': 5,
                'title': 'NP Completeness and Branch and Bound',
                'content': '''Complexity Classes:

P (Polynomial Time):
- Problems solvable in polynomial time
- Examples: Sorting, Searching, MST, Shortest Path

NP (Non-deterministic Polynomial):
- Solutions verifiable in polynomial time
- Examples: TSP, Graph Coloring, Knapsack

NP-Hard:
- At least as hard as hardest NP problems
- May not be in NP

NP-Complete:
- Both NP and NP-Hard
- Examples: SAT, 3-SAT, Clique, Vertex Cover, TSP

Branch and Bound:
- Smarter than backtracking, uses bounding function
- Calculate upper/lower bound at each node
- Prune branches that cannot give better solution

TSP (Travelling Salesman Problem):
- Visit all cities exactly once, return to start
- Minimize total distance
- NP-Complete
- Branch and Bound gives exact solution'''
            },
        ]

        for n in notes:
            Note.objects.create(**n)

        pyqs = [
            {'year': 2023, 'unit': 1, 'marks': 14, 'question': 'Explain asymptotic notations O, Omega, and Theta with examples. How are they used to analyze algorithm complexity?', 'answer': 'Big-O: Upper bound. f(n)=O(g(n)) if there exist c,n0 such that f(n) is less than or equal to c times g(n) for all n greater than n0. Example: 3n2+2n=O(n2)\n\nOmega: Lower bound. f(n)=Omega(g(n)) if f(n) is greater than or equal to c times g(n). Example: n2=Omega(n)\n\nTheta: Tight bound. f(n)=Theta(g(n)) if f(n)=O(g(n)) AND f(n)=Omega(g(n)). Example: 2n2+3n=Theta(n2)'},
            {'year': 2023, 'unit': 1, 'marks': 7, 'question': 'Write the algorithm for Binary Search and analyze its time complexity using recurrence relation.', 'answer': 'Binary Search:\n1. Set low=0, high=n-1\n2. While low is less than or equal to high: mid=(low+high)/2\n3. If arr[mid]==key: return mid\n4. If arr[mid] less than key: low=mid+1\n5. Else: high=mid-1\n6. Return -1\n\nRecurrence: T(n)=T(n/2)+O(1)\nBy Master Theorem Case 2: T(n)=O(log n)\nSpace: O(1) iterative'},
            {'year': 2023, 'unit': 1, 'marks': 7, 'question': 'Explain Merge Sort with example. Derive its time complexity.', 'answer': 'Merge Sort divides array into halves, sorts each, merges them.\nRecurrence: T(n)=2T(n/2)+O(n)\nMaster Theorem Case 2: T(n)=O(n log n)\nBest/Worst/Average: Always O(n log n)\nSpace: O(n)\nStable sort: Yes'},
            {'year': 2023, 'unit': 1, 'marks': 2, 'question': 'What is the difference between best case and worst case complexity?', 'answer': 'Best Case: Minimum time for most favorable input. Example: Linear search finds element at first position = O(1)\nWorst Case: Maximum time for least favorable input. Example: Linear search element not present = O(n)'},
            {'year': 2023, 'unit': 2, 'marks': 14, 'question': 'Explain Kruskal algorithm for finding Minimum Spanning Tree with a suitable example.', 'answer': "Kruskal's Algorithm:\n1. Sort edges by weight: O(E log E)\n2. Initialize each vertex as separate component\n3. For each edge (u,v): If u,v in different components add edge and union\n4. Stop when n-1 edges added\n\nTime: O(E log E)"},
            {'year': 2023, 'unit': 2, 'marks': 7, 'question': 'Solve the Fractional Knapsack problem: capacity=50, items={(60,10),(100,20),(120,30)}', 'answer': 'Ratios: Item1=6, Item2=5, Item3=4\nTake Item1 fully: value=60, remaining capacity=40\nTake Item2 fully: value=100, remaining=20\nTake 20/30 of Item3: value=80\nTotal = 240'},
            {'year': 2023, 'unit': 2, 'marks': 7, 'question': 'Explain Huffman Coding algorithm with example.', 'answer': 'Build min-heap with frequencies.\nRepeatedly extract two minimum nodes and merge.\nFrequent characters get shorter codes.\nTime: O(n log n)\nUsed for lossless data compression.'},
            {'year': 2022, 'unit': 3, 'marks': 14, 'question': 'Solve 0/1 Knapsack using Dynamic Programming: n=4, W=5, weights={1,2,3,2}, values={1,6,10,16}', 'answer': 'Build DP table dp[i][w]\nFill using: dp[i][w] = max(dp[i-1][w], values[i]+dp[i-1][w-weights[i]])\nFinal Answer: Maximum value = 23'},
            {'year': 2022, 'unit': 3, 'marks': 7, 'question': 'Find LCS of X=ABCBDAB and Y=BDCAB', 'answer': 'LCS Length = 4\nLCS = BCAB or BDAB\nUsing DP table with recurrence:\nif X[i]==Y[j]: dp[i][j]=dp[i-1][j-1]+1\nelse: dp[i][j]=max(dp[i-1][j],dp[i][j-1])'},
            {'year': 2022, 'unit': 3, 'marks': 7, 'question': 'Explain Floyd-Warshall algorithm for all pairs shortest path.', 'answer': 'Floyd-Warshall finds shortest paths between ALL pairs.\nTime: O(V3), Space: O(V2)\nfor k=1 to n: for i=1 to n: for j=1 to n: dist[i][j]=min(dist[i][j], dist[i][k]+dist[k][j])\nWorks with negative weights but NOT negative cycles.'},
            {'year': 2022, 'unit': 4, 'marks': 14, 'question': 'Explain N-Queens problem and solve it for N=4 using Backtracking.', 'answer': 'N-Queens: Place N queens on NxN board, no two queens attack each other.\nFor N=4:\nSolution 1: Queens at columns (2,4,1,3)\nSolution 2: Queens at columns (3,1,4,2)\nBacktracking: Place queen row by row, check safety, backtrack if conflict.\nTime: O(n!)'},
            {'year': 2022, 'unit': 4, 'marks': 7, 'question': 'What is Graph Coloring? Solve using backtracking.', 'answer': 'Graph Coloring: Assign colors so no two adjacent vertices have same color.\nChromatic Number: Minimum colors needed.\nBacktracking: Try each color for each vertex, backtrack if conflict.\nApplications: Scheduling, Map coloring\nNP-Complete problem'},
            {'year': 2021, 'unit': 5, 'marks': 14, 'question': 'What are NP, NP-Hard and NP-Complete problems? Explain with examples.', 'answer': 'P: Solvable in polynomial time. Ex: Sorting\nNP: Verifiable in polynomial time. Ex: TSP\nNP-Hard: At least as hard as NP. May not be in NP.\nNP-Complete: NP and NP-Hard both. Ex: SAT, Clique, Vertex Cover, TSP\nP is subset of NP. If any NP-Complete solved in poly time then P=NP'},
            {'year': 2021, 'unit': 5, 'marks': 7, 'question': 'Explain Branch and Bound technique. How is it different from Backtracking?', 'answer': 'Branch and Bound:\n• Uses bounding function to prune unpromising branches\n• Finds OPTIMAL solution\n• Uses priority queue (best-first search)\n\nDifference:\nBacktracking prunes based on constraints only.\nB&B prunes based on cost bounds (smarter).\nB&B more efficient in practice.'},
            {'year': 2024, 'unit': 1, 'marks': 14, 'question': 'Explain Quick Sort. Derive best, worst and average case time complexity.', 'answer': 'Quick Sort:\n1. Choose pivot\n2. Partition around pivot\n3. Recursively sort partitions\n\nBest Case: O(n log n) when pivot divides equally\nWorst Case: O(n2) when already sorted\nAverage: O(n log n)\nSpace: O(log n) for recursion stack'},
            {'year': 2024, 'unit': 2, 'marks': 14, 'question': "Explain Prim's algorithm. Compare with Kruskal's algorithm.", 'answer': "Prim's: Start from vertex, always add minimum edge to unvisited vertex.\nTime: O(E log V)\n\nKruskal's: Sort all edges, add if no cycle forms.\nTime: O(E log E)\n\nPrim's better for dense graphs.\nKruskal's better for sparse graphs."},
            {'year': 2024, 'unit': 3, 'marks': 14, 'question': 'Explain Matrix Chain Multiplication using Dynamic Programming.', 'answer': 'Find optimal parenthesization to minimize scalar multiplications.\ndp[i][j] = min cost to multiply matrices i to j\nRecurrence: dp[i][j] = min over k of (dp[i][k]+dp[k+1][j]+p[i-1]*p[k]*p[j])\nTime: O(n3), Space: O(n2)'},
        ]

        for p in pyqs:
            PYQ.objects.create(**p)

        self.stdout.write(self.style.SUCCESS(
            f'Seeded {Note.objects.count()} notes and {PYQ.objects.count()} PYQs successfully!'
        ))
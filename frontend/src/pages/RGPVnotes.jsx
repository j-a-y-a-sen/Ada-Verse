import React, { useState } from "react";

const units = [
  {
    id: 1,
    label: "Unit 1",
    subtitle: "Introduction · Asymptotic Analysis · Divide and Conquer · Heap Sort",
    topics: [
      { icon: "📘", title: "Introduction to Algorithms", tags: ["Definition", "Properties", "Design Goals", "Techniques"] },
      { icon: "📊", title: "Asymptotic Notations", tags: ["Big-O", "Big-Ω", "Big-Θ", "Rate of Growth"] },
      { icon: "⏱️", title: "Time & Space Complexity", tags: ["Time", "Space", "Best/Worst/Avg"] },
      { icon: "🌲", title: "Recurrence Relations", tags: ["Master Theorem", "Recursion Tree", "Substitution"] },
      { icon: "⚡", title: "Divide and Conquer", tags: ["Binary Search", "Merge Sort", "Quick Sort", "Strassen"] },
      { icon: "🌳", title: "Heap & Heap Sort", tags: ["Max Heap", "Min Heap", "Heapify", "O(n log n)"] },
    ],
  },
  {
    id: 2,
    label: "Unit 2",
    subtitle: "Greedy Method — Optimal Merge Pattern · Minimum Spanning Tree",
    topics: [
      {
        icon: "📦",
        title: "Disaster Relief Supply Distribution (Optimal Merge Pattern)",
        tags: ["Greedy", "Min-Heap", "Priority Queue"],
        approach:
          "Greedy approach using a min-priority queue to obtain the minimum merge cost.",
        code: `#include <iostream>
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
}`,
        input: "4\n10 20 30 40",
        output: "Minimum Cost = 190",
      },
      {
        icon: "🌐",
        title: "Smart City Fiber Network (MST — Prim's Algorithm)",
        tags: ["Greedy", "MST", "Adjacency Matrix"],
        approach:
          "Constructs the MST and prints selected edges and total installation cost.",
        code: `#include <iostream>
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
}`,
        input: "(Adjacency cost matrix of the network)",
        output: "Selected edges with minimum total cost.",
      },
    ],
  },
  {
    id: 3,
    label: "Unit 3",
    subtitle: "Dynamic Programming — 0/1 Knapsack · Multistage Graph",
    topics: [
      {
        icon: "🚀",
        title: "Space Mission Payload Selection (0/1 Knapsack)",
        tags: ["DP", "0/1 Knapsack", "Table Method"],
        approach:
          "Dynamic Programming solution to maximize scientific value within the payload capacity.",
        code: `#include <iostream>
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
}`,
        input: "3 50\n10 60\n20 100\n30 120",
        output: "Maximum Value = 220",
      },
      {
        icon: "🗺️",
        title: "Tourist Route Planner (Multistage Graph)",
        tags: ["DP", "Stages", "Backward Recursion"],
        approach:
          "Dynamic Programming solution to compute the minimum travel cost in a multistage graph.",
        code: `#include <iostream>
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
}`,
        input: "(Stage-wise cost matrix)",
        output: "Minimum Cost = (depends on input graph)",
      },
    ],
  },
  {
    id: 4,
    label: "Unit 4",
    subtitle: "Backtracking & Branch-and-Bound — Graph Coloring · TSP",
    topics: [
      {
        icon: "🎨",
        title: "University Examination Seating Planner (Graph Coloring)",
        tags: ["Backtracking", "Graph Coloring", "m-Coloring"],
        approach:
          "Backtracking solution to assign the minimum possible time slots (colors) so adjacent/conflicting subjects are not assigned the same slot.",
        code: `#include <iostream>
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
}`,
        input: "(Conflict graph matrix and number of slots m)",
        output: "Subject 0 -> Slot 1\nSubject 1 -> Slot 2\nSubject 2 -> Slot 1",
      },
      {
        icon: "🧳",
        title: "International Salesperson Route Optimization (TSP)",
        tags: ["Backtracking", "Branch & Bound", "Permutations"],
        approach:
          "Recursive Branch-and-Bound style solution to find the minimum travel cost.",
        code: `#include <iostream>
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
}`,
        input: "(City-to-city cost matrix)",
        output: "Minimum Travel Cost = 80 (depends on input graph)",
      },
    ],
  },
  {
    id: 5,
    label: "Unit 5",
    subtitle: "Graph Traversal & Trees — BFS/DFS · Binary Search Tree",
    topics: [
      {
        icon: "🔍",
        title: "Social Media Friend Explorer (BFS & DFS)",
        tags: ["BFS", "DFS", "Queue", "Recursion"],
        approach:
          "Program to perform Breadth First Search and Depth First Search from a selected starting node.",
        code: `#include <iostream>
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
}`,
        input: "(Number of nodes, edges, edge list, start node)",
        output: "BFS: 0 1 2 3 4\nDFS: 0 1 3 4 2",
      },
      {
        icon: "🌳",
        title: "Online Bookstore Search Engine (Binary Search Tree)",
        tags: ["Insert", "Search", "Delete", "Inorder"],
        approach: "BST program supporting Insert, Search, Inorder Display and Delete.",
        code: `#include <iostream>
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
}`,
        input: "(Insert keys: 50, 30, 70, 20, 40)",
        output: "Books: 20 30 40 50 70\nFound? Yes\nAfter Delete: 20 40 50 70",
      },
    ],
  },
];

function NavBar() {
  return (
    <div className="flex items-center justify-between px-10 py-5 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-lg">
          ⬡
        </div>
        <span className="text-xl font-extrabold tracking-tight">
          ADA<span className="text-violet-400">verse</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm text-gray-300 font-medium">
        <span className="hover:text-white cursor-pointer">Home</span>
        <span className="hover:text-white cursor-pointer">Algorithms</span>
        <span className="hover:text-white cursor-pointer">Visualizer</span>
        <span className="text-white relative">
          Notes
          <span className="absolute -bottom-[21px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-400" />
        </span>
        <span className="hover:text-white cursor-pointer">PYQ</span>
      </div>

      <button className="bg-violet-600 hover:bg-violet-500 transition-colors text-sm font-semibold px-5 py-2.5 rounded-xl">
        Get Started
      </button>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20">
      {children}
    </span>
  );
}

function TopicCard({ topic }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#12121F] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-violet-500/40">
      <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-xl mb-4">
        {topic.icon}
      </div>

      <h3 className="text-base font-semibold text-white mb-3 leading-snug">
        {topic.title}
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {topic.tags.map((tag, i) => (
          <Pill key={i}>{tag}</Pill>
        ))}
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
      >
        <span className="text-[10px]">{open ? "▲" : "▼"}</span>
        {open ? "Close" : "Open"}
      </button>

      {open && (
        <div className="mt-5 pt-5 border-t border-white/10 space-y-4 text-sm">
          {topic.approach && (
            <div>
              <p className="text-violet-300 font-semibold mb-1">Approach</p>
              <p className="text-gray-300 leading-6">{topic.approach}</p>
            </div>
          )}

          {topic.code && (
            <div>
              <p className="text-violet-300 font-semibold mb-1">C++ Code</p>
              <pre className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-x-auto text-xs text-emerald-200 whitespace-pre">
                {topic.code}
              </pre>
            </div>
          )}

          {topic.input && (
            <div>
              <p className="text-violet-300 font-semibold mb-1">Sample Input</p>
              <pre className="bg-black/40 border border-white/10 rounded-xl p-3 overflow-x-auto text-xs text-gray-300 whitespace-pre-wrap">
                {topic.input}
              </pre>
            </div>
          )}

          {topic.output && (
            <div>
              <p className="text-violet-300 font-semibold mb-1">Output</p>
              <pre className="bg-black/40 border border-white/10 rounded-xl p-3 overflow-x-auto text-xs text-gray-300 whitespace-pre-wrap">
                {topic.output}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ADANotesPage() {
  const [activeUnitId, setActiveUnitId] = useState(1);
  const activeUnit = units.find((u) => u.id === activeUnitId);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white">
      <NavBar />

      {/* HERO */}
      <div className="text-center py-16 px-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-medium text-gray-300 mb-8">
          🖥️ Study Notes
        </div>

        <h1 className="text-6xl font-extrabold tracking-tight mb-5">
          ADA <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Notes</span>
        </h1>

        <p className="text-gray-400 text-lg mb-6">
          Complete {activeUnit.label} — RGPV CS-402 · Analysis and Design of Algorithm
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Pill>B.Tech 4th Sem</Pill>
          <Pill>CS-402</Pill>
          <Pill>{activeUnit.topics.length} Topics</Pill>
          <Pill>RGPV Syllabus</Pill>
        </div>
      </div>

      {/* UNIT TABS */}
      <div className="flex items-center justify-center gap-3 py-6 px-6 flex-wrap border-b border-white/10">
        {units.map((unit) => (
          <button
            key={unit.id}
            onClick={() => setActiveUnitId(unit.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeUnitId === unit.id
                ? "bg-violet-600 text-white"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {unit.label}
          </button>
        ))}
      </div>

      {/* UNIT HEADER STRIP */}
      <div className="flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-gray-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-violet-400" />
          <span className="font-medium">
            {activeUnit.label} — {activeUnit.subtitle}
          </span>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300">
          {activeUnit.topics.length} topics
        </span>
      </div>

      {/* TOPIC GRID */}
      <div className="max-w-7xl mx-auto px-10 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeUnit.topics.map((topic, i) => (
          <TopicCard key={i} topic={topic} />
        ))}
      </div>
    </div>
  );
}
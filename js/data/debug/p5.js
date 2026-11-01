// Batch 5: Linked list (d091-d092), Trees (d093-d096), Graphs and grids (d097-d100)
// Linked list input: a[i] = index of the next node, -1 = end, head is index 0.
// Tree input: array form, children of i are 2i+1 and 2i+2, -1 = no node.
const L = (code, ...pairs) => [code, pairs];

export const BATCH5 = [
  {
    id: "d091", title: "Linked List Has a Cycle", topic: "Linked List", level: "Medium", kind: "ints",
    statement: "A linked list is stored as an array: a[i] is the index of the node after node i, or -1 for the end. The head is node 0. Print 1 if the list contains a cycle, otherwise 0. Use fast and slow pointers.",
    cases: ["4 1 2 3 1", "3 1 2 -1", "1 0"], hidden: ["2 1 -1", "5 1 2 3 4 2"],
    bug: { type: "logic", note: "The fast pointer moves one step like the slow one, so they always meet." },
    py: L(`def solve(a):
    slow = 0
    fast = 0
    while fast != -1 and a[fast] != -1:
        slow = a[slow]
        fast = a[a[fast]]
        if slow == fast:
            return 1
    return 0`, ["fast = a[a[fast]]", "fast = a[fast]"]),
    js: L(`function solve(a) {
  let slow = 0, fast = 0;
  while (fast !== -1 && a[fast] !== -1) {
    slow = a[slow];
    fast = a[a[fast]];
    if (slow === fast) return 1;
  }
  return 0;
}`, ["fast = a[a[fast]];", "fast = a[fast];"]),
    c: L(`int solve(int a[], int n) {
    int slow = 0, fast = 0;
    while (fast != -1 && a[fast] != -1) {
        slow = a[slow];
        fast = a[a[fast]];
        if (slow == fast) return 1;
    }
    return 0;
}`, ["fast = a[a[fast]];", "fast = a[fast];"]),
    cpp: L(`int solve(vector<int>& a) {
    int slow = 0, fast = 0;
    while (fast != -1 && a[fast] != -1) {
        slow = a[slow];
        fast = a[a[fast]];
        if (slow == fast) return 1;
    }
    return 0;
}`, ["fast = a[a[fast]];", "fast = a[fast];"]),
    java: L(`static int solve(int[] a) {
    int slow = 0, fast = 0;
    while (fast != -1 && a[fast] != -1) {
        slow = a[slow];
        fast = a[a[fast]];
        if (slow == fast) return 1;
    }
    return 0;
}`, ["fast = a[a[fast]];", "fast = a[fast];"])
  },
  {
    id: "d092", title: "Middle Node of a Linked List", topic: "Linked List", level: "Easy", kind: "ints",
    statement: "The list has no cycle (same array format as before, head is node 0). Print the INDEX of its middle node using fast and slow pointers. For an even number of nodes print the second of the two middle nodes.",
    cases: ["4 1 2 3 -1", "3 1 2 -1", "1 -1"], hidden: ["2 1 -1", "6 1 2 3 4 5 -1"],
    bug: { type: "logic", note: "The slow pointer moves two steps, so it ends up at the end." },
    py: L(`def solve(a):
    slow = 0
    fast = 0
    while fast != -1 and a[fast] != -1:
        slow = a[slow]
        fast = a[a[fast]]
    return slow`, ["slow = a[slow]", "slow = a[a[slow]]"]),
    js: L(`function solve(a) {
  let slow = 0, fast = 0;
  while (fast !== -1 && a[fast] !== -1) {
    slow = a[slow];
    fast = a[a[fast]];
  }
  return slow;
}`, ["slow = a[slow];", "slow = a[a[slow]];"]),
    c: L(`int solve(int a[], int n) {
    int slow = 0, fast = 0;
    while (fast != -1 && a[fast] != -1) {
        slow = a[slow];
        fast = a[a[fast]];
    }
    return slow;
}`, ["slow = a[slow];", "slow = a[a[slow]];"]),
    cpp: L(`int solve(vector<int>& a) {
    int slow = 0, fast = 0;
    while (fast != -1 && a[fast] != -1) {
        slow = a[slow];
        fast = a[a[fast]];
    }
    return slow;
}`, ["slow = a[slow];", "slow = a[a[slow]];"]),
    java: L(`static int solve(int[] a) {
    int slow = 0, fast = 0;
    while (fast != -1 && a[fast] != -1) {
        slow = a[slow];
        fast = a[a[fast]];
    }
    return slow;
}`, ["slow = a[slow];", "slow = a[a[slow]];"])
  },
  {
    id: "d093", title: "Height of a Binary Tree", topic: "Trees", level: "Easy", kind: "ints",
    statement: "The tree is in array form: the children of index i are at 2i+1 and 2i+2, and -1 means there is no node. Print the height: the number of nodes on the longest root-to-leaf path (empty tree = 0).",
    cases: ["7 3 9 20 -1 -1 15 7", "0", "1 1"], hidden: ["4 1 2 -1 3", "7 1 2 3 4 5 6 7"],
    bug: { type: "missing", note: "The current node is never counted, so every height collapses to 0." },
    py: L(`def height(a, i):
    if i >= len(a) or a[i] == -1:
        return 0
    l = height(a, 2 * i + 1)
    r = height(a, 2 * i + 2)
    return 1 + max(l, r)


def solve(a):
    return height(a, 0)`, ["return 1 + max(l, r)", "return max(l, r)"]),
    js: L(`function height(a, i) {
  if (i >= a.length || a[i] === -1) return 0;
  const l = height(a, 2 * i + 1);
  const r = height(a, 2 * i + 2);
  return 1 + Math.max(l, r);
}

function solve(a) {
  return height(a, 0);
}`, ["return 1 + Math.max(l, r);", "return Math.max(l, r);"]),
    c: L(`int height(int a[], int n, int i) {
    if (i >= n || a[i] == -1) return 0;
    int l = height(a, n, 2 * i + 1);
    int r = height(a, n, 2 * i + 2);
    return 1 + (l > r ? l : r);
}

int solve(int a[], int n) {
    return height(a, n, 0);
}`, ["return 1 + (l > r ? l : r);", "return (l > r ? l : r);"]),
    cpp: L(`int height(vector<int>& a, int i) {
    if (i >= (int)a.size() || a[i] == -1) return 0;
    int l = height(a, 2 * i + 1);
    int r = height(a, 2 * i + 2);
    return 1 + max(l, r);
}

int solve(vector<int>& a) {
    return height(a, 0);
}`, ["return 1 + max(l, r);", "return max(l, r);"]),
    java: L(`static int height(int[] a, int i) {
    if (i >= a.length || a[i] == -1) return 0;
    int l = height(a, 2 * i + 1);
    int r = height(a, 2 * i + 2);
    return 1 + Math.max(l, r);
}

static int solve(int[] a) {
    return height(a, 0);
}`, ["return 1 + Math.max(l, r);", "return Math.max(l, r);"])
  },
  {
    id: "d094", title: "Count Nodes in a Binary Tree", topic: "Trees", level: "Easy", kind: "ints",
    statement: "Same array form as before (-1 = no node). Print the number of nodes that are actually in the tree, reached from the root.",
    cases: ["7 3 9 20 -1 -1 15 7", "0", "3 1 -1 2"], hidden: ["1 5", "5 1 2 3 4 5"],
    bug: { type: "logic", note: "The right subtree is read from the left child's index." },
    py: L(`def count(a, i):
    if i >= len(a) or a[i] == -1:
        return 0
    l = count(a, 2 * i + 1)
    r = count(a, 2 * i + 2)
    return 1 + l + r


def solve(a):
    return count(a, 0)`, ["r = count(a, 2 * i + 2)", "r = count(a, 2 * i + 1)"]),
    js: L(`function count(a, i) {
  if (i >= a.length || a[i] === -1) return 0;
  const l = count(a, 2 * i + 1);
  const r = count(a, 2 * i + 2);
  return 1 + l + r;
}

function solve(a) {
  return count(a, 0);
}`, ["const r = count(a, 2 * i + 2);", "const r = count(a, 2 * i + 1);"]),
    c: L(`int count(int a[], int n, int i) {
    if (i >= n || a[i] == -1) return 0;
    int l = count(a, n, 2 * i + 1);
    int r = count(a, n, 2 * i + 2);
    return 1 + l + r;
}

int solve(int a[], int n) {
    return count(a, n, 0);
}`, ["int r = count(a, n, 2 * i + 2);", "int r = count(a, n, 2 * i + 1);"]),
    cpp: L(`int countNodes(vector<int>& a, int i) {
    if (i >= (int)a.size() || a[i] == -1) return 0;
    int l = countNodes(a, 2 * i + 1);
    int r = countNodes(a, 2 * i + 2);
    return 1 + l + r;
}

int solve(vector<int>& a) {
    return countNodes(a, 0);
}`, ["int r = countNodes(a, 2 * i + 2);", "int r = countNodes(a, 2 * i + 1);"]),
    java: L(`static int count(int[] a, int i) {
    if (i >= a.length || a[i] == -1) return 0;
    int l = count(a, 2 * i + 1);
    int r = count(a, 2 * i + 2);
    return 1 + l + r;
}

static int solve(int[] a) {
    return count(a, 0);
}`, ["int r = count(a, 2 * i + 2);", "int r = count(a, 2 * i + 1);"])
  },
  {
    id: "d095", title: "Is the Tree Symmetric?", topic: "Trees", level: "Medium", kind: "ints",
    statement: "Array form (-1 = no node). Print 1 if the tree is a mirror image of itself around its root, otherwise 0. An empty tree is symmetric.",
    cases: ["7 1 2 2 3 4 4 3", "7 1 2 2 -1 3 -1 3", "1 1"], hidden: ["0", "3 1 2 3"],
    bug: { type: "logic", note: "The children are compared on the same side instead of crosswise." },
    py: L(`def mirror(a, i, j):
    n = len(a)
    ni = i >= n or a[i] == -1
    nj = j >= n or a[j] == -1
    if ni and nj:
        return True
    if ni or nj:
        return False
    if a[i] != a[j]:
        return False
    return mirror(a, 2 * i + 1, 2 * j + 2) and mirror(a, 2 * i + 2, 2 * j + 1)


def solve(a):
    return 1 if mirror(a, 0, 0) else 0`, ["mirror(a, 2 * i + 1, 2 * j + 2) and mirror(a, 2 * i + 2, 2 * j + 1)", "mirror(a, 2 * i + 1, 2 * j + 1) and mirror(a, 2 * i + 2, 2 * j + 2)"]),
    js: L(`function mirror(a, i, j) {
  const n = a.length;
  const ni = i >= n || a[i] === -1;
  const nj = j >= n || a[j] === -1;
  if (ni && nj) return true;
  if (ni || nj) return false;
  if (a[i] !== a[j]) return false;
  return mirror(a, 2 * i + 1, 2 * j + 2) && mirror(a, 2 * i + 2, 2 * j + 1);
}

function solve(a) {
  return mirror(a, 0, 0) ? 1 : 0;
}`, ["mirror(a, 2 * i + 1, 2 * j + 2) && mirror(a, 2 * i + 2, 2 * j + 1)", "mirror(a, 2 * i + 1, 2 * j + 1) && mirror(a, 2 * i + 2, 2 * j + 2)"]),
    c: L(`int mirror(int a[], int n, int i, int j) {
    int ni = (i >= n || a[i] == -1);
    int nj = (j >= n || a[j] == -1);
    if (ni && nj) return 1;
    if (ni || nj) return 0;
    if (a[i] != a[j]) return 0;
    return mirror(a, n, 2 * i + 1, 2 * j + 2) && mirror(a, n, 2 * i + 2, 2 * j + 1);
}

int solve(int a[], int n) {
    return mirror(a, n, 0, 0) ? 1 : 0;
}`, ["mirror(a, n, 2 * i + 1, 2 * j + 2) && mirror(a, n, 2 * i + 2, 2 * j + 1)", "mirror(a, n, 2 * i + 1, 2 * j + 1) && mirror(a, n, 2 * i + 2, 2 * j + 2)"]),
    cpp: L(`bool mirrorTree(vector<int>& a, int i, int j) {
    int n = a.size();
    bool ni = (i >= n || a[i] == -1);
    bool nj = (j >= n || a[j] == -1);
    if (ni && nj) return true;
    if (ni || nj) return false;
    if (a[i] != a[j]) return false;
    return mirrorTree(a, 2 * i + 1, 2 * j + 2) && mirrorTree(a, 2 * i + 2, 2 * j + 1);
}

int solve(vector<int>& a) {
    return mirrorTree(a, 0, 0) ? 1 : 0;
}`, ["mirrorTree(a, 2 * i + 1, 2 * j + 2) && mirrorTree(a, 2 * i + 2, 2 * j + 1)", "mirrorTree(a, 2 * i + 1, 2 * j + 1) && mirrorTree(a, 2 * i + 2, 2 * j + 2)"]),
    java: L(`static boolean mirror(int[] a, int i, int j) {
    int n = a.length;
    boolean ni = (i >= n || a[i] == -1);
    boolean nj = (j >= n || a[j] == -1);
    if (ni && nj) return true;
    if (ni || nj) return false;
    if (a[i] != a[j]) return false;
    return mirror(a, 2 * i + 1, 2 * j + 2) && mirror(a, 2 * i + 2, 2 * j + 1);
}

static int solve(int[] a) {
    return mirror(a, 0, 0) ? 1 : 0;
}`, ["mirror(a, 2 * i + 1, 2 * j + 2) && mirror(a, 2 * i + 2, 2 * j + 1)", "mirror(a, 2 * i + 1, 2 * j + 1) && mirror(a, 2 * i + 2, 2 * j + 2)"])
  },
  {
    id: "d096", title: "Lowest Common Ancestor in a BST", topic: "Trees", level: "Medium", kind: "ints",
    statement: "The array starts with two values p and q, followed by a full binary search tree in array form (children of i at 2i+1 and 2i+2). Both p and q exist in the tree. Print the value of their lowest common ancestor (a node may be its own ancestor).",
    cases: ["9 2 8 6 2 8 0 4 7 9", "9 0 4 6 2 8 0 4 7 9", "9 7 9 6 2 8 0 4 7 9"], hidden: ["9 4 4 6 2 8 0 4 7 9", "9 0 9 6 2 8 0 4 7 9"],
    bug: { type: "logic", note: "The code goes right when only one of the values is larger, skipping the split point." },
    py: L(`def solve(a):
    p = a[0]
    q = a[1]
    t = a[2:]
    i = 0
    while True:
        val = t[i]
        if p < val and q < val:
            i = 2 * i + 1
        elif p > val and q > val:
            i = 2 * i + 2
        else:
            return val`, ["elif p > val and q > val:", "elif p > val or q > val:"]),
    js: L(`function solve(a) {
  const p = a[0], q = a[1];
  const t = a.slice(2);
  let i = 0;
  while (true) {
    const val = t[i];
    if (p < val && q < val) i = 2 * i + 1;
    else if (p > val && q > val) i = 2 * i + 2;
    else return val;
  }
}`, ["else if (p > val && q > val)", "else if (p > val || q > val)"]),
    c: L(`int solve(int a[], int n) {
    int p = a[0], q = a[1];
    int i = 0;
    while (1) {
        int val = a[2 + i];
        if (p < val && q < val) i = 2 * i + 1;
        else if (p > val && q > val) i = 2 * i + 2;
        else return val;
    }
}`, ["else if (p > val && q > val)", "else if (p > val || q > val)"]),
    cpp: L(`int solve(vector<int>& a) {
    int p = a[0], q = a[1];
    int i = 0;
    while (true) {
        int val = a[2 + i];
        if (p < val && q < val) i = 2 * i + 1;
        else if (p > val && q > val) i = 2 * i + 2;
        else return val;
    }
}`, ["else if (p > val && q > val)", "else if (p > val || q > val)"]),
    java: L(`static int solve(int[] a) {
    int p = a[0], q = a[1];
    int i = 0;
    while (true) {
        int val = a[2 + i];
        if (p < val && q < val) i = 2 * i + 1;
        else if (p > val && q > val) i = 2 * i + 2;
        else return val;
    }
}`, ["else if (p > val && q > val)", "else if (p > val || q > val)"])
  },
  {
    id: "d097", title: "Connected Components", topic: "Graphs", level: "Medium", kind: "ints",
    statement: "The array starts with v (vertices, at most 100) and e (edges), followed by e pairs x y describing UNDIRECTED edges between vertices 0..v-1. Print the number of connected components.",
    cases: ["6 5 2 0 1 3 4", "4 3 1 1 0", "8 4 3 0 1 1 2 3 2"], hidden: ["2 3 0", "6 4 2 0 1 1 0"],
    bug: { type: "missing", note: "Each edge is stored in only one direction, so the graph is treated as directed." },
    py: L(`def solve(a):
    v = a[0]
    e = a[1]
    adj = [[False] * v for _ in range(v)]
    for i in range(e):
        x = a[2 + 2 * i]
        y = a[3 + 2 * i]
        adj[x][y] = True
        adj[y][x] = True
    seen = [False] * v
    count = 0
    for s in range(v):
        if not seen[s]:
            count += 1
            seen[s] = True
            stack = [s]
            while stack:
                u = stack.pop()
                for w in range(v):
                    if adj[u][w] and not seen[w]:
                        seen[w] = True
                        stack.append(w)
    return count`, ["adj[y][x] = True", "pass"]),
    js: L(`function solve(a) {
  const v = a[0], e = a[1];
  const adj = Array.from({ length: v }, () => new Array(v).fill(false));
  for (let i = 0; i < e; i++) {
    const x = a[2 + 2 * i], y = a[3 + 2 * i];
    adj[x][y] = true;
    adj[y][x] = true;
  }
  const seen = new Array(v).fill(false);
  let count = 0;
  for (let s = 0; s < v; s++) {
    if (seen[s]) continue;
    count++;
    seen[s] = true;
    const stack = [s];
    while (stack.length > 0) {
      const u = stack.pop();
      for (let w = 0; w < v; w++) {
        if (adj[u][w] && !seen[w]) {
          seen[w] = true;
          stack.push(w);
        }
      }
    }
  }
  return count;
}`, ["adj[y][x] = true;", ""]),
    c: L(`int solve(int a[], int n) {
    int v = a[0], e = a[1];
    int adj[105][105] = {0};
    for (int i = 0; i < e; i++) {
        int x = a[2 + 2 * i], y = a[3 + 2 * i];
        adj[x][y] = 1;
        adj[y][x] = 1;
    }
    int seen[105] = {0};
    int st[1005];
    int count = 0;
    for (int s = 0; s < v; s++) {
        if (seen[s]) continue;
        count++;
        int top = 0;
        st[top++] = s;
        seen[s] = 1;
        while (top > 0) {
            int u = st[--top];
            for (int w = 0; w < v; w++) {
                if (adj[u][w] && !seen[w]) {
                    seen[w] = 1;
                    st[top++] = w;
                }
            }
        }
    }
    return count;
}`, ["adj[y][x] = 1;", ""]),
    cpp: L(`int solve(vector<int>& a) {
    int v = a[0], e = a[1];
    vector<vector<int>> adj(v, vector<int>(v, 0));
    for (int i = 0; i < e; i++) {
        int x = a[2 + 2 * i], y = a[3 + 2 * i];
        adj[x][y] = 1;
        adj[y][x] = 1;
    }
    vector<int> seen(v, 0);
    int count = 0;
    for (int s = 0; s < v; s++) {
        if (seen[s]) continue;
        count++;
        seen[s] = 1;
        vector<int> st;
        st.push_back(s);
        while (!st.empty()) {
            int u = st.back();
            st.pop_back();
            for (int w = 0; w < v; w++) {
                if (adj[u][w] && !seen[w]) {
                    seen[w] = 1;
                    st.push_back(w);
                }
            }
        }
    }
    return count;
}`, ["adj[y][x] = 1;", ""]),
    java: L(`static int solve(int[] a) {
    int v = a[0], e = a[1];
    int[][] adj = new int[v][v];
    for (int i = 0; i < e; i++) {
        int x = a[2 + 2 * i], y = a[3 + 2 * i];
        adj[x][y] = 1;
        adj[y][x] = 1;
    }
    boolean[] seen = new boolean[v];
    int count = 0;
    for (int s = 0; s < v; s++) {
        if (seen[s]) continue;
        count++;
        seen[s] = true;
        Deque<Integer> st = new ArrayDeque<>();
        st.push(s);
        while (!st.isEmpty()) {
            int u = st.pop();
            for (int w = 0; w < v; w++) {
                if (adj[u][w] == 1 && !seen[w]) {
                    seen[w] = true;
                    st.push(w);
                }
            }
        }
    }
    return count;
}`, ["adj[y][x] = 1;", ""])
  },
  {
    id: "d098", title: "Shortest Path in an Unweighted Graph", topic: "Graphs", level: "Medium", kind: "ints",
    statement: "The array starts with v (at most 100) and e, followed by e undirected edges x y. Print the minimum number of edges on a path from vertex 0 to vertex v-1, or -1 if there is none. Use BFS.",
    cases: ["12 5 5 0 1 1 2 2 4 0 3 3 4", "4 3 1 0 1", "2 1 0"], hidden: ["8 4 3 0 1 1 2 2 3", "6 4 2 0 1 2 3"],
    bug: { type: "logic", note: "The distance of a new vertex is not increased by one." },
    py: L(`def solve(a):
    v = a[0]
    e = a[1]
    adj = [[False] * v for _ in range(v)]
    for i in range(e):
        x = a[2 + 2 * i]
        y = a[3 + 2 * i]
        adj[x][y] = True
        adj[y][x] = True
    dist = [-1] * v
    dist[0] = 0
    queue = [0]
    head = 0
    while head < len(queue):
        u = queue[head]
        head += 1
        for w in range(v):
            if adj[u][w] and dist[w] == -1:
                dist[w] = dist[u] + 1
                queue.append(w)
    return dist[v - 1]`, ["dist[w] = dist[u] + 1", "dist[w] = dist[u]"]),
    js: L(`function solve(a) {
  const v = a[0], e = a[1];
  const adj = Array.from({ length: v }, () => new Array(v).fill(false));
  for (let i = 0; i < e; i++) {
    const x = a[2 + 2 * i], y = a[3 + 2 * i];
    adj[x][y] = true;
    adj[y][x] = true;
  }
  const dist = new Array(v).fill(-1);
  dist[0] = 0;
  const queue = [0];
  let head = 0;
  while (head < queue.length) {
    const u = queue[head++];
    for (let w = 0; w < v; w++) {
      if (adj[u][w] && dist[w] === -1) {
        dist[w] = dist[u] + 1;
        queue.push(w);
      }
    }
  }
  return dist[v - 1];
}`, ["dist[w] = dist[u] + 1;", "dist[w] = dist[u];"]),
    c: L(`int solve(int a[], int n) {
    int v = a[0], e = a[1];
    int adj[105][105] = {0};
    for (int i = 0; i < e; i++) {
        int x = a[2 + 2 * i], y = a[3 + 2 * i];
        adj[x][y] = 1;
        adj[y][x] = 1;
    }
    int dist[105];
    for (int i = 0; i < v; i++) dist[i] = -1;
    dist[0] = 0;
    int queue[1005];
    int head = 0, tail = 0;
    queue[tail++] = 0;
    while (head < tail) {
        int u = queue[head++];
        for (int w = 0; w < v; w++) {
            if (adj[u][w] && dist[w] == -1) {
                dist[w] = dist[u] + 1;
                queue[tail++] = w;
            }
        }
    }
    return dist[v - 1];
}`, ["dist[w] = dist[u] + 1;", "dist[w] = dist[u];"]),
    cpp: L(`int solve(vector<int>& a) {
    int v = a[0], e = a[1];
    vector<vector<int>> adj(v, vector<int>(v, 0));
    for (int i = 0; i < e; i++) {
        int x = a[2 + 2 * i], y = a[3 + 2 * i];
        adj[x][y] = 1;
        adj[y][x] = 1;
    }
    vector<int> dist(v, -1);
    dist[0] = 0;
    vector<int> queue;
    queue.push_back(0);
    size_t head = 0;
    while (head < queue.size()) {
        int u = queue[head++];
        for (int w = 0; w < v; w++) {
            if (adj[u][w] && dist[w] == -1) {
                dist[w] = dist[u] + 1;
                queue.push_back(w);
            }
        }
    }
    return dist[v - 1];
}`, ["dist[w] = dist[u] + 1;", "dist[w] = dist[u];"]),
    java: L(`static int solve(int[] a) {
    int v = a[0], e = a[1];
    int[][] adj = new int[v][v];
    for (int i = 0; i < e; i++) {
        int x = a[2 + 2 * i], y = a[3 + 2 * i];
        adj[x][y] = 1;
        adj[y][x] = 1;
    }
    int[] dist = new int[v];
    Arrays.fill(dist, -1);
    dist[0] = 0;
    int[] queue = new int[v + 5];
    int head = 0, tail = 0;
    queue[tail++] = 0;
    while (head < tail) {
        int u = queue[head++];
        for (int w = 0; w < v; w++) {
            if (adj[u][w] == 1 && dist[w] == -1) {
                dist[w] = dist[u] + 1;
                queue[tail++] = w;
            }
        }
    }
    return dist[v - 1];
}`, ["dist[w] = dist[u] + 1;", "dist[w] = dist[u];"])
  },
  {
    id: "d099", title: "Cycle in an Undirected Graph", topic: "Graphs", level: "Hard", kind: "ints",
    statement: "The array starts with v (at most 100) and e, followed by e distinct undirected edges x y (no repeated pairs). Print 1 if the graph contains a cycle, otherwise 0.",
    cases: ["8 3 3 0 1 1 2 2 0", "8 4 3 0 1 1 2 2 3", "4 3 1 0 1"], hidden: ["10 5 4 0 1 1 2 2 3 3 1", "2 3 0"],
    bug: { type: "logic", note: "Visiting the parent again is wrongly reported as a cycle." },
    py: L(`def dfs(adj, v, u, parent, seen):
    seen[u] = True
    for w in range(v):
        if adj[u][w]:
            if not seen[w]:
                if dfs(adj, v, w, u, seen):
                    return True
            elif w != parent:
                return True
    return False


def solve(a):
    v = a[0]
    e = a[1]
    adj = [[False] * v for _ in range(v)]
    for i in range(e):
        x = a[2 + 2 * i]
        y = a[3 + 2 * i]
        adj[x][y] = True
        adj[y][x] = True
    seen = [False] * v
    for s in range(v):
        if not seen[s]:
            if dfs(adj, v, s, -1, seen):
                return 1
    return 0`, ["elif w != parent:", "elif True:"]),
    js: L(`function dfs(adj, v, u, parent, seen) {
  seen[u] = true;
  for (let w = 0; w < v; w++) {
    if (adj[u][w]) {
      if (!seen[w]) {
        if (dfs(adj, v, w, u, seen)) return true;
      } else if (w !== parent) {
        return true;
      }
    }
  }
  return false;
}

function solve(a) {
  const v = a[0], e = a[1];
  const adj = Array.from({ length: v }, () => new Array(v).fill(false));
  for (let i = 0; i < e; i++) {
    const x = a[2 + 2 * i], y = a[3 + 2 * i];
    adj[x][y] = true;
    adj[y][x] = true;
  }
  const seen = new Array(v).fill(false);
  for (let s = 0; s < v; s++) {
    if (!seen[s] && dfs(adj, v, s, -1, seen)) return 1;
  }
  return 0;
}`, ["} else if (w !== parent) {", "} else if (true) {"]),
    c: L(`int dfs(int adj[][105], int v, int u, int parent, int seen[]) {
    seen[u] = 1;
    for (int w = 0; w < v; w++) {
        if (adj[u][w]) {
            if (!seen[w]) {
                if (dfs(adj, v, w, u, seen)) return 1;
            } else if (w != parent) {
                return 1;
            }
        }
    }
    return 0;
}

int solve(int a[], int n) {
    int v = a[0], e = a[1];
    int adj[105][105] = {0};
    for (int i = 0; i < e; i++) {
        int x = a[2 + 2 * i], y = a[3 + 2 * i];
        adj[x][y] = 1;
        adj[y][x] = 1;
    }
    int seen[105] = {0};
    for (int s = 0; s < v; s++) {
        if (!seen[s] && dfs(adj, v, s, -1, seen)) return 1;
    }
    return 0;
}`, ["} else if (w != parent) {", "} else if (1) {"]),
    cpp: L(`bool dfs(vector<vector<int>>& adj, int v, int u, int parent, vector<int>& seen) {
    seen[u] = 1;
    for (int w = 0; w < v; w++) {
        if (adj[u][w]) {
            if (!seen[w]) {
                if (dfs(adj, v, w, u, seen)) return true;
            } else if (w != parent) {
                return true;
            }
        }
    }
    return false;
}

int solve(vector<int>& a) {
    int v = a[0], e = a[1];
    vector<vector<int>> adj(v, vector<int>(v, 0));
    for (int i = 0; i < e; i++) {
        int x = a[2 + 2 * i], y = a[3 + 2 * i];
        adj[x][y] = 1;
        adj[y][x] = 1;
    }
    vector<int> seen(v, 0);
    for (int s = 0; s < v; s++) {
        if (!seen[s] && dfs(adj, v, s, -1, seen)) return 1;
    }
    return 0;
}`, ["} else if (w != parent) {", "} else if (true) {"]),
    java: L(`static boolean dfs(int[][] adj, int v, int u, int parent, boolean[] seen) {
    seen[u] = true;
    for (int w = 0; w < v; w++) {
        if (adj[u][w] == 1) {
            if (!seen[w]) {
                if (dfs(adj, v, w, u, seen)) return true;
            } else if (w != parent) {
                return true;
            }
        }
    }
    return false;
}

static int solve(int[] a) {
    int v = a[0], e = a[1];
    int[][] adj = new int[v][v];
    for (int i = 0; i < e; i++) {
        int x = a[2 + 2 * i], y = a[3 + 2 * i];
        adj[x][y] = 1;
        adj[y][x] = 1;
    }
    boolean[] seen = new boolean[v];
    for (int s = 0; s < v; s++) {
        if (!seen[s] && dfs(adj, v, s, -1, seen)) return 1;
    }
    return 0;
}`, ["} else if (w != parent) {", "} else if (true) {"])
  },
  {
    id: "d100", title: "Number of Islands", topic: "Graphs", level: "Hard", kind: "ints",
    statement: "The array starts with r and c (each at most 10), followed by r*c cells in row-major order (1 = land, 0 = water). Land cells that touch horizontally or vertically belong to the same island. Print the number of islands.",
    cases: ["14 3 4 1 1 0 0 1 0 0 1 0 0 1 1", "8 2 3 1 0 1 1 1 1", "6 2 2 0 0 0 0"], hidden: ["3 1 1 1", "8 2 3 1 0 1 0 1 0"],
    bug: { type: "logic", note: "One of the four directions is duplicated, so the search can never move up." },
    py: L(`def solve(a):
    r = a[0]
    c = a[1]
    grid = a[2:]
    seen = [False] * (r * c)
    count = 0
    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    for s in range(r * c):
        if grid[s] == 1 and not seen[s]:
            count += 1
            seen[s] = True
            stack = [s]
            while stack:
                cur = stack.pop()
                x = cur // c
                y = cur % c
                for dx, dy in dirs:
                    nx = x + dx
                    ny = y + dy
                    if 0 <= nx < r and 0 <= ny < c:
                        nxt = nx * c + ny
                        if grid[nxt] == 1 and not seen[nxt]:
                            seen[nxt] = True
                            stack.append(nxt)
    return count`, ["(-1, 0), ", ""]),
    js: L(`function solve(a) {
  const r = a[0], c = a[1];
  const grid = a.slice(2);
  const seen = new Array(r * c).fill(false);
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let count = 0;
  for (let s = 0; s < r * c; s++) {
    if (grid[s] === 1 && !seen[s]) {
      count++;
      seen[s] = true;
      const stack = [s];
      while (stack.length > 0) {
        const cur = stack.pop();
        const x = Math.floor(cur / c), y = cur % c;
        for (const [dx, dy] of dirs) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < r && ny >= 0 && ny < c) {
            const nxt = nx * c + ny;
            if (grid[nxt] === 1 && !seen[nxt]) {
              seen[nxt] = true;
              stack.push(nxt);
            }
          }
        }
      }
    }
  }
  return count;
}`, ["[-1, 0], ", ""]),
    c: L(`int solve(int a[], int n) {
    int r = a[0], c = a[1];
    int dx[4] = {1, -1, 0, 0};
    int dy[4] = {0, 0, 1, -1};
    int seen[105] = {0};
    int st[1005];
    int count = 0;
    for (int s = 0; s < r * c; s++) {
        if (a[2 + s] == 1 && !seen[s]) {
            count++;
            seen[s] = 1;
            int top = 0;
            st[top++] = s;
            while (top > 0) {
                int cur = st[--top];
                int x = cur / c, y = cur % c;
                for (int d = 0; d < 4; d++) {
                    int nx = x + dx[d], ny = y + dy[d];
                    if (nx >= 0 && nx < r && ny >= 0 && ny < c) {
                        int nxt = nx * c + ny;
                        if (a[2 + nxt] == 1 && !seen[nxt]) {
                            seen[nxt] = 1;
                            st[top++] = nxt;
                        }
                    }
                }
            }
        }
    }
    return count;
}`, ["int dx[4] = {1, -1, 0, 0};", "int dx[4] = {1, 1, 0, 0};"]),
    cpp: L(`int solve(vector<int>& a) {
    int r = a[0], c = a[1];
    int dx[4] = {1, -1, 0, 0};
    int dy[4] = {0, 0, 1, -1};
    vector<int> seen(r * c, 0);
    int count = 0;
    for (int s = 0; s < r * c; s++) {
        if (a[2 + s] == 1 && !seen[s]) {
            count++;
            seen[s] = 1;
            vector<int> st;
            st.push_back(s);
            while (!st.empty()) {
                int cur = st.back();
                st.pop_back();
                int x = cur / c, y = cur % c;
                for (int d = 0; d < 4; d++) {
                    int nx = x + dx[d], ny = y + dy[d];
                    if (nx >= 0 && nx < r && ny >= 0 && ny < c) {
                        int nxt = nx * c + ny;
                        if (a[2 + nxt] == 1 && !seen[nxt]) {
                            seen[nxt] = 1;
                            st.push_back(nxt);
                        }
                    }
                }
            }
        }
    }
    return count;
}`, ["int dx[4] = {1, -1, 0, 0};", "int dx[4] = {1, 1, 0, 0};"]),
    java: L(`static int solve(int[] a) {
    int r = a[0], c = a[1];
    int[] dx = {1, -1, 0, 0};
    int[] dy = {0, 0, 1, -1};
    boolean[] seen = new boolean[r * c];
    int count = 0;
    for (int s = 0; s < r * c; s++) {
        if (a[2 + s] == 1 && !seen[s]) {
            count++;
            seen[s] = true;
            Deque<Integer> st = new ArrayDeque<>();
            st.push(s);
            while (!st.isEmpty()) {
                int cur = st.pop();
                int x = cur / c, y = cur % c;
                for (int d = 0; d < 4; d++) {
                    int nx = x + dx[d], ny = y + dy[d];
                    if (nx >= 0 && nx < r && ny >= 0 && ny < c) {
                        int nxt = nx * c + ny;
                        if (a[2 + nxt] == 1 && !seen[nxt]) {
                            seen[nxt] = true;
                            st.push(nxt);
                        }
                    }
                }
            }
        }
    }
    return count;
}`, ["int[] dx = {1, -1, 0, 0};", "int[] dx = {1, 1, 0, 0};"])
  }
];

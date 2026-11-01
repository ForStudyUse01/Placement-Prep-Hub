// Hand-written lessons for the Video Explainer (part 2: data structures, graphs, DP, complexity).
import { T, B, F, A, C, V, K, S, L } from "./video_scripts1.js";

export const PART2 = {
  "ll-fundamentals": { title: "Linked Lists", scenes: [
    T("Linked Lists", "Data structures", "A linked list is a chain of nodes. There is no index, so every operation is about following and rewiring pointers."),
    F("Anatomy of a list", ["head points to node 1", "Each node holds data and next", "The last next is None", "No random access: walk from head"], "Each node stores a value and a pointer to the next node. The head points to the first one, and the last node points to nothing. Because there are no indexes, reaching the fifth node means walking past four others."),
    A("Reverse 1 to 2 to 3", ["1", "2", "3"], [S([0], { 0: "curr" }, "prev = None, curr = 1"), S([1], { 0: "prev", 1: "curr" }, "1.next = None, move on. prev = 1, curr = 2"), S([2], { 1: "prev", 2: "curr" }, "2.next = 1. prev = 2, curr = 3"), S([2], { 2: "prev" }, "3.next = 2. prev = 3 is the new head")], "To reverse, keep three pointers. At each node, save the next one, point the current node backwards, then step forward. When the current pointer falls off the end, prev is the new head."),
    C("Reverse in code", "python", ["prev = None", "while curr:", "    nxt = curr.next", "    curr.next = prev", "    prev = curr", "    curr = nxt", "return prev"], [L([2], "Save next before you break the link"), L([3], "Flip the arrow"), L([4, 5], "Step both pointers forward")], "The order matters. Save next first, or you lose the rest of the list. Then flip the arrow, and then advance both pointers."),
    V("Slow and fast pointers", "Find the middle", ["slow moves 1, fast moves 2", "When fast ends, slow is in the middle"], "Detect a cycle", ["If fast meets slow, there is a loop", "If fast reaches None, there is not"], "Two pointers at different speeds solve two classic problems. For the middle, when the fast one reaches the end, the slow one is halfway. For a cycle, if the fast one ever catches the slow one there must be a loop."),
    K("Save next before you rewire.", "Remember: save the next pointer before you change any link, or you lose the list.")
  ] },

  "stack-queue": { title: "Stacks and Queues", scenes: [
    T("Stacks and Queues", "Data structures", "Two simple structures with one difference: which end you remove from. That one rule decides how they are used."),
    V("LIFO versus FIFO", "Stack", ["Last in, first out", "push and pop at the top", "Undo, brackets, recursion"], "Queue", ["First in, first out", "enqueue at back, dequeue at front", "BFS, scheduling, buffers"], "A stack is last in, first out, like a pile of plates. A queue is first in, first out, like a line at a counter. Stacks power undo, bracket matching and recursion. Queues power breadth first search and scheduling."),
    A("Balanced brackets: ( [ ] )", ["(", "[", "]", ")"], [S([0], { 0: "push (" }, "Opening: push. Stack: ("), S([1], { 1: "push [" }, "Opening: push. Stack: ( ["), S([2], { 2: "pop [" }, "Closing ] matches top [. Pop"), S([3], { 3: "pop (" }, "Closing ) matches top (. Pop. Stack empty: balanced")], "Push every opening bracket. For a closing bracket, the top of the stack must be its partner, then pop it. If the stack is empty at the end, the brackets are balanced. A mismatch, or a leftover, means they are not."),
    C("Valid brackets", "python", ["pairs = {')': '(', ']': '[', '}': '{'}", "stack = []", "for ch in s:", "    if ch in '([{': stack.append(ch)", "    elif not stack or stack.pop() != pairs[ch]: return False", "return not stack"], [L([3], "Opening: push"), L([4], "Closing: top must match"), L([5], "Leftovers mean not valid")], "The code follows the same logic. Push openers. For a closer, fail if the stack is empty or the popped item is wrong. At the end the stack must be empty."),
    B("Complexity and traps", ["push, pop, enqueue: O(1)", "list.pop(0) is O(n), use deque", "Check empty before pop or peek"], "All the core operations are constant time. But in Python, popping from the front of a list is linear, so use a deque for queues. And always check for empty before you pop."),
    K("Stack for nesting, queue for level by level.", "Quick rule: a stack handles nesting, a queue handles level by level order.")
  ] },

  "tree-traversals": { title: "Tree Traversals", scenes: [
    T("Tree Traversals", "Trees", "There are four standard ways to visit every node in a tree. The only difference is when you visit the root."),
    B("The three depth first orders", ["Preorder: root, left, right", "Inorder: left, root, right", "Postorder: left, right, root"], "Depth first has three orders. Preorder visits the root first. Inorder visits the root between its children. Postorder visits the root last. Same recursion, one line moved."),
    C("Inorder in code", "python", ["def inorder(node):", "    if not node: return", "    inorder(node.left)", "    visit(node.val)", "    inorder(node.right)"], [L([1], "Base case: empty tree"), L([2], "Everything on the left first"), L([3], "Then this node"), L([4], "Then the right side")], "Move the visit line to change the order. Put it before the two calls for preorder, between them for inorder, after them for postorder."),
    F("Tree 4, children 2 and 6", ["Preorder: 4, 2, 6", "Inorder: 2, 4, 6", "Postorder: 2, 6, 4", "Level order: 4, then 2, 6"], "Take a root of four with children two and six. Preorder gives four two six. Inorder gives two four six. Postorder gives two six four. And level order, using a queue, goes row by row."),
    V("Depth first versus breadth first", "DFS", ["Recursion or a stack", "Goes deep before wide"], "BFS", ["Queue", "Goes level by level"], "Depth first uses recursion or a stack and dives deep. Breadth first uses a queue and processes one level at a time, which is perfect for shortest paths and level questions."),
    K("Inorder of a BST comes out sorted.", "A beautiful fact to remember: the inorder traversal of a binary search tree is always sorted.")
  ] },

  "bst-ops": { title: "Binary Search Trees", scenes: [
    T("Binary Search Trees", "Trees", "A binary search tree keeps order built in: smaller on the left, larger on the right. That is what makes search fast."),
    B("The one rule", ["Left subtree: all smaller", "Right subtree: all larger", "Applies to every node, not just the root"], "The rule is simple. Everything in the left subtree is smaller, everything in the right is larger. And the rule applies to every node, not only the root."),
    F("Search for 6 in 8, 3, 10, 1, 6", ["6 < 8: go left", "6 > 3: go right", "6 = 6: found"], "Search for six. Start at eight. Six is smaller, go left to three. Six is larger, go right. We land on six. Each step throws away half of the tree."),
    V("Balanced versus skewed", "Balanced", ["Height about log n", "Search, insert: O(log n)"], "Skewed", ["Inserting sorted data makes a chain", "Search, insert: O(n)"], "If the tree stays balanced, its height is about log n and operations are fast. But insert already sorted numbers and you get a chain, which is as slow as a linked list."),
    B("Deleting a node", ["Leaf: just remove it", "One child: replace with the child", "Two children: use inorder successor"], "Deleting has three cases. A leaf is simply removed. A node with one child is replaced by that child. A node with two children takes the value of its inorder successor, the smallest node in the right subtree."),
    K("Validate a BST with ranges, not just parent checks.", "A classic bug: checking only a node against its parent. Pass down a minimum and a maximum instead.")
  ] },

  "graph-representation-traversal": { title: "Graph Traversal", scenes: [
    T("Graph Traversal", "Graphs", "Maps, networks, dependencies: all graphs. Two traversals, BFS and DFS, solve most of the questions you will get."),
    V("Adjacency list versus matrix", "Adjacency list", ["Each node lists neighbours", "Space O(V + E)", "Best for sparse graphs"], "Adjacency matrix", ["Grid of 0 and 1", "Space O(V squared)", "Edge check in O(1)"], "An adjacency list stores each node's neighbours and is small for sparse graphs. A matrix is a grid, with instant edge checks but quadratic space."),
    F("BFS from A", ["Queue: A", "Visit A, add B, C", "Visit B, add D", "Visit C, then D"], "Breadth first search uses a queue. Start with A. Visit it and add its neighbours B and C. Visit B and add D. Then C. The order is A, B, C, D, closest first."),
    C("BFS in code", "python", ["visited = {start}", "queue = deque([start])", "while queue:", "    node = queue.popleft()", "    for nb in graph[node]:", "        if nb not in visited:", "            visited.add(nb)", "            queue.append(nb)"], [L([0, 1], "Start: mark and enqueue"), L([3], "Take the oldest"), L([5, 6, 7], "Mark when adding, not when popping")], "Mark a node as visited when you add it to the queue, not when you remove it. Otherwise the same node can be added many times."),
    V("When to use which", "BFS", ["Shortest path, unweighted", "Level by level"], "DFS", ["Connected components, cycles", "Path existence, backtracking"], "Use BFS when you need the shortest path in an unweighted graph. Use DFS for components, cycles and exploring every path."),
    K("Always keep a visited set.", "Without a visited set, a graph with a cycle will make your traversal run forever.")
  ] },

  "graph-cycles-shortest-path": { title: "Cycles and Shortest Paths", scenes: [
    T("Cycles and Shortest Paths", "Graphs", "Two big graph questions: is there a loop, and what is the cheapest route? Different graph types need different answers."),
    V("Detecting a cycle", "Undirected", ["DFS: reaching a visited node that is not the parent", "Or union-find"], "Directed", ["DFS with a recursion stack", "Or topological sort fails"], "In an undirected graph a cycle exists if DFS meets a visited node that is not its parent. In a directed graph, you need to track nodes currently on the recursion stack, because a visited node alone does not prove a cycle."),
    F("Dijkstra from A", ["dist A = 0, others = infinity", "Pick the smallest unfinished node", "Relax its edges: dist[v] = dist[u] + w", "Repeat until all are done"], "Dijkstra starts with distance zero at the source and infinity elsewhere. Repeatedly pick the unfinished node with the smallest distance, and relax its edges: if going through it is shorter, update the neighbour."),
    A("Distances after each pick", ["A", "B", "C", "D"], [S([0], { 0: "0" }, "Start: A = 0"), S([0, 1, 2], { 1: "4", 2: "1" }, "From A: B = 4, C = 1"), S([2, 1], { 1: "3" }, "Pick C. Via C, B improves to 3"), S([3], { 3: "8" }, "Pick B, then D = 8")], "Say A to B costs four and A to C costs one, and C to B costs two. After picking C, the route to B through C costs three, which beats four, so B improves."),
    B("Know the limits", ["Dijkstra fails with negative edges", "Bellman-Ford handles negatives", "BFS suffices when all edges cost 1"], "Dijkstra breaks with negative edges. Use Bellman Ford for those. And if every edge costs the same, plain BFS is enough."),
    K("Use a priority queue and Dijkstra runs in E log V.", "With a priority queue, Dijkstra runs in E log V time. That is the number to quote.")
  ] },

  "dp-fundamentals": { title: "Dynamic Programming Basics", scenes: [
    T("Dynamic Programming", "Dynamic programming", "Dynamic programming is just recursion that remembers its answers. If you can say it that simply, you can solve it."),
    F("The recipe", ["Define the state: what does dp[i] mean?", "Write the transition", "Set the base cases", "Choose the order of filling"], "Four steps. Say exactly what dp of i means. Write how it depends on smaller states. Fix the base cases. And choose an order so every dependency is ready."),
    A("Fibonacci table", ["0", "1", "1", "2", "3", "5", "8"], [S([0, 1], { 0: "base", 1: "base" }, "Base: dp[0] = 0, dp[1] = 1"), S([2], { 2: "0+1" }, "dp[2] = dp[1] + dp[0] = 1"), S([3], { 3: "1+1" }, "dp[3] = 2"), S([6], { 6: "5+3" }, "dp[6] = dp[5] + dp[4] = 8")], "Fibonacci is the perfect first example. Each cell is the sum of the two before it. Plain recursion recomputes the same values exponentially many times. A table computes each one once."),
    V("Top down versus bottom up", "Top down", ["Recursion plus a cache", "Computes only what is needed"], "Bottom up", ["Fill a table in order", "No recursion limit"], "Top down is recursion with memoisation, easy to write. Bottom up fills the table with loops, and avoids deep recursion. Both give the same complexity."),
    B("When DP applies", ["Overlapping subproblems", "Optimal substructure", "Count, min, max or yes or no"], "Look for two signs: the same subproblem appears many times, and the best answer is built from best answers of smaller parts. Questions asking for a count, a minimum, a maximum or a yes or no often fit."),
    K("Name the state first. The rest follows.", "If you are stuck, go back and name the state precisely. The transition follows from it.")
  ] },

  "dp-classics": { title: "Classic DP Problems", scenes: [
    T("Classic DP Problems", "Dynamic programming", "Knapsack, coin change and longest common subsequence. Learn these three and most DP questions are variations."),
    C("Coin change", "python", ["dp = [0] + [inf] * amount", "for a in range(1, amount + 1):", "    for c in coins:", "        if c <= a:", "            dp[a] = min(dp[a], dp[a - c] + 1)"], [L([0], "0 coins make amount 0"), L([4], "Try each coin, keep the smallest count")], "dp of a is the fewest coins to make amount a. For each amount, try every coin: use that coin plus the best answer for what is left, and keep the minimum."),
    A("Coins 1, 3, 4 and amount 6", ["0", "1", "2", "1", "1", "2", "2"], [S([0], { 0: "0" }, "dp[0] = 0"), S([3, 4], { 3: "1", 4: "1" }, "dp[3] = 1 and dp[4] = 1: single coins"), S([5], { 5: "2" }, "dp[5] = dp[4] + 1 = 2"), S([6], { 6: "2" }, "dp[6] = dp[3] + 1 = 2. Greedy 4+1+1 would give 3")], "With coins one, three and four, the best way to make six is three plus three, two coins. A greedy choice of the biggest coin gives four, one, one, three coins. That is why coin change needs DP."),
    V("Knapsack and LCS", "0/1 Knapsack", ["dp[i][w] = best value", "Take the item or skip it"], "Longest common subsequence", ["dp[i][j] over two strings", "Match: diagonal plus 1, else max"], "In knapsack each item is either taken or skipped, and the table tracks capacity. For longest common subsequence, if two characters match, add one to the diagonal. If not, take the better of up or left."),
    B("Complexity", ["Coin change: O(amount x coins)", "Knapsack: O(n x capacity)", "LCS: O(n x m)"], "Time is the table size times the work per cell. Coin change is amount times coins. Knapsack is items times capacity. LCS is the product of the two string lengths."),
    K("Greedy fails on coin change. DP does not.", "The lesson: when greedy can fail, use DP.")
  ] },

  "advanced-greedy-heap": { title: "Greedy and Heaps", scenes: [
    T("Greedy and Heaps", "Advanced algorithms", "Greedy picks the best choice right now and never looks back. It is fast, but only valid when the problem allows it."),
    F("Activity selection", ["Sort by earliest finish time", "Pick the first activity", "Pick the next that starts after it ends", "Repeat"], "To attend the most meetings, sort by finish time. Pick the first. Then always pick the next meeting that starts after the last one ended. Finishing early leaves the most room."),
    V("Greedy versus DP", "Greedy", ["Local best choice", "Needs a proof it works"], "Dynamic programming", ["Tries all options with memory", "Safe when greedy fails"], "Greedy is quick but needs a reason why the local choice is always safe. When it is not safe, as in coin change with odd coins, use dynamic programming."),
    A("Min heap after inserts 5, 3, 8, 1", ["1", "3", "8", "5"], [S([0], { 0: "min" }, "Smallest is always at the top"), S([0, 1], { 0: "root", 1: "child" }, "Parent is never larger than its children"), S([0], { 0: "pop" }, "pop returns 1 in O(log n)")], "A min heap keeps the smallest item at the root. Insert and remove cost log n, and peeking costs constant time. Python's heapq gives you this on a list."),
    B("Where heaps shine", ["Top k elements", "Merge k sorted lists", "Dijkstra and scheduling"], "Heaps are perfect for the top k elements, merging sorted lists, Dijkstra, and task schedulers. For the k largest, keep a min heap of size k."),
    K("Greedy needs a proof. A heap needs log n.", "In short: greedy needs a reason it works, and heap operations cost log n.")
  ] },

  "complexity-bigo": { title: "Time Complexity and Big O", scenes: [
    T("Big O Notation", "Complexity", "Big O tells you how running time grows as the input grows. It lets you compare solutions without running them."),
    B("The ladder, fast to slow", ["O(1) constant", "O(log n) halving", "O(n) one pass", "O(n log n) sorting", "O(n squared) nested loops", "O(2 to the n) subsets"], "Learn the ladder. Constant, logarithmic, linear, n log n, quadratic, exponential. Each step up is dramatically slower on large input."),
    C("Count the loops", "python", ["for i in range(n):", "    for j in range(n):", "        work()", "for k in range(n):", "    work()"], [L([0, 1, 2], "n times n = n squared"), L([3, 4], "n more"), L([0, 4], "n squared + n is O(n squared)")], "A nested loop does n times n work. A later loop adds n more. But n squared plus n is still O of n squared, because the biggest term dominates."),
    F("Two rules for simplifying", ["Drop constants: 3n is O(n)", "Keep only the fastest growing term", "Loops in sequence add", "Loops nested multiply"], "To simplify, drop constants and keep the largest term. Loops one after another add. Loops inside loops multiply."),
    V("Why log n appears", "Halving", ["Binary search", "n to n/2 to n/4 ... 1"], "Doubling", ["Loop i *= 2", "Runs about log n times"], "Whenever the problem size is halved each step, as in binary search, or a variable doubles each loop, the number of steps is about log n."),
    K("State time and space, and say why.", "In an interview, always state both time and space, and explain where each comes from.")
  ] }
};

// Extra teaching content per topic id. Worked examples use the SAME inputs as the
// visualizations on that topic page, so the text and the animation agree.
// Shape: { why, example:{title, code, walk[], result}, mistakes[], exam[], check:{q, options[], correct, explain} }
export const EXTRA = {
  "pf-variables": {
    why: "Every program stores values, and wrong assumptions about types cause the most common output-prediction mistakes in tests.",
    example: { title: "Trace x = 7, y = 2", code: "x = 7\ny = 2\na = x / y\nb = x // y\nc = int(a)\nd = '5' + '5'",
      walk: ["x and y are ints.", "x / y is true division in Python 3, so a = 3.5 (a float).", "x // y is floor division, so b = 3.", "int(3.5) truncates toward zero, so c = 3. It does not round.", "'5' + '5' concatenates strings, so d = '55'. To add numbers use int('5') + int('5') = 10.", "In C, C++ and Java, 7 / 2 with two ints is 3, because both operands are integers."],
      result: "a = 3.5, b = 3, c = 3, d = '55'" },
    mistakes: ["Assuming / is integer division (true in C and Java, false in Python 3).", "Using + between a number and a string (TypeError) or between two numeric strings (joins them).", "Expecting int() to round: int(2.9) is 2.", "Calling int('3.5'): it raises ValueError, parse with float() first."],
    exam: ["Output-prediction MCQs that mix int and float division and casts.", "Pseudo-code where integer division silently drops the remainder."],
    check: { q: "What does print(7 // 2 + 7 / 2) show in Python 3?", options: ["6.5", "7", "6", "3.5"], correct: 0, explain: "7 // 2 is 3 and 7 / 2 is 3.5, so the sum is 6.5." }
  },
  "pf-operators": {
    why: "Expressions in exam questions are written to be evaluated by precedence, not left to right. Knowing the order lets you evaluate in seconds.",
    example: { title: "Evaluate 2 + 3 * 4 ** 2 > 20 and not False", code: "2 + 3 * 4 ** 2 > 20 and not False",
      walk: ["Highest precedence first: 4 ** 2 = 16.", "Next 3 * 16 = 48.", "Next 2 + 48 = 50.", "Comparison 50 > 20 is True.", "not False is True.", "True and True is True."],
      result: "True" },
    mistakes: ["Reading -2 ** 2 as 4. It is -4, because ** binds tighter than unary minus.", "Assuming ** is left-associative: 2 ** 3 ** 2 is 2 ** 9 = 512.", "Mixing & or | with comparisons without brackets.", "Writing = where == was meant."],
    exam: ["Chained arithmetic with %, //, and, or.", "Short-circuit questions: in a and b, b is not evaluated when a is False."],
    check: { q: "What is 2 ** 3 ** 2?", options: ["64", "512", "36", "18"], correct: 1, explain: "** is right-associative: 3 ** 2 = 9, then 2 ** 9 = 512." }
  },
  "pf-conditionals-loops": {
    why: "Loops and conditions are the skeleton of every algorithm. Tests ask how many times a line runs or what a counter ends as.",
    example: { title: "Nested loop with continue", code: "for i in range(3):\n    for j in range(3):\n        if j == 1:\n            continue\n        print(i, j)",
      walk: ["i = 0: j = 0 prints (0, 0).", "j = 1 hits continue and skips the print, only for the inner loop.", "j = 2 prints (0, 2).", "The outer loop moves on: i = 1 prints (1, 0) and (1, 2).", "i = 2 prints (2, 0) and (2, 2)."],
      result: "6 lines printed: 0 0, 0 2, 1 0, 1 2, 2 0, 2 2" },
    mistakes: ["Thinking continue or break exits both loops. They affect only the nearest loop.", "range(1, n) stops at n - 1.", "A while loop whose variable never changes (infinite loop).", "Editing a list while looping over it."],
    exam: ["Count how many times a statement runs in nested loops.", "Final value of a counter or sum after a loop with break."],
    check: { q: "count = 0\nfor i in range(1, 4):\n    for j in range(i):\n        count += 1\nWhat is count?", options: ["3", "6", "9", "4"], correct: 1, explain: "The inner loop runs 1 + 2 + 3 = 6 times." }
  },
  "pf-functions-recursion": {
    why: "Recursion and scope questions test whether you can follow control through stacked calls, a core skill for debugging and tree or graph code.",
    example: { title: "factorial(4) on the call stack", code: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)",
      walk: ["factorial(4) calls factorial(3), which calls factorial(2), then factorial(1).", "Base case: factorial(1) returns 1 and its frame is popped.", "factorial(2) returns 2 * 1 = 2.", "factorial(3) returns 3 * 2 = 6.", "factorial(4) returns 4 * 6 = 24.", "Scope: assigning x inside a function creates a new local x and leaves the global x unchanged."],
      result: "factorial(4) = 24 after 4 nested calls" },
    mistakes: ["Missing base case: infinite recursion and RecursionError.", "Base case that skips an input, e.g. n == 1 when n can be 0.", "Forgetting to return the recursive call, so the function returns None.", "Assigning to a global inside a function without the global keyword."],
    exam: ["Return value of a small recursive function.", "Number of calls made, or output printed on the way down versus up."],
    check: { q: "def f(n):\n    return 0 if n == 0 else n + f(n - 1)\nWhat is f(4)?", options: ["4", "10", "24", "0"], correct: 1, explain: "4 + 3 + 2 + 1 + 0 = 10." }
  },

  "py-mutability": {
    why: "Mutable versus immutable behaviour explains the most famous Python bugs, and the mutable default argument is a named pattern in the Capgemini debugging round.",
    example: { title: "The shared default list", code: "def add_item(item, bucket=[]):\n    bucket.append(item)\n    return bucket\n\nadd_item(1)\nadd_item(2)",
      walk: ["When def runs, Python creates ONE empty list and stores it as the default.", "add_item(1) uses that list and it becomes [1].", "add_item(2) uses the same list again: [1, 2], not the expected [2].", "Fix: use bucket=None, then create a fresh list inside the function when bucket is None."],
      result: "Second call returns [1, 2]. The fixed version returns [2]." },
    mistakes: ["Using [] or {} as a default argument.", "Writing b = a and expecting a copy. Both names point to the same list.", "Thinking a tuple is fully frozen: a list inside a tuple can still change.", "Comparing with is when you mean ==."],
    exam: ["Predict the output after calling a function twice with a mutable default.", "Spot the bug in a function that mutates its argument."],
    check: { q: "a = [1, 2]\nb = a\nb.append(3)\nprint(a)", options: ["[1, 2]", "[1, 2, 3]", "[3]", "Error"], correct: 1, explain: "b and a are the same list object, so the change shows in both." }
  },
  "py-collections": {
    why: "Lists, dicts and sets are the data structures of nearly every Python test question, and slicing is a frequent source of off-by-one errors.",
    example: { title: "Slicing a = [10, 20, 30, 40, 50, 60, 70]", code: "a = [10, 20, 30, 40, 50, 60, 70]\na[1:5:2]\na[-3:]\na[::-1]\na[5:2:-1]",
      walk: ["a[1:5:2] starts at index 1, stops before 5, step 2: indices 1 and 3, so [20, 40].", "a[-3:] starts three from the end: [50, 60, 70].", "a[::-1] walks the whole list backwards: [70, 60, 50, 40, 30, 20, 10].", "a[5:2:-1] goes from index 5 down to 3 (stop is exclusive): [60, 50, 40]."],
      result: "[20, 40], [50, 60, 70], reversed list, [60, 50, 40]" },
    mistakes: ["Forgetting the stop index is exclusive.", "d['x'] on a missing key raises KeyError, use d.get('x', default).", "list.sort() returns None, use sorted(list) for a new list.", "Assuming a set keeps order."],
    exam: ["Output of a slice with negative index or step.", "Which structure gives O(1) membership: set or dict, not list."],
    check: { q: "a = [10,20,30,40,50,60,70]\nWhat is a[1:5:2]?", options: ["[20, 40]", "[20, 30, 40, 50]", "[20, 40, 60]", "[10, 30]"], correct: 0, explain: "Indices 1 and 3 are picked, the next is 5 which is the exclusive stop." }
  },
  "py-comprehensions": {
    why: "Comprehensions and lambdas shorten code and appear constantly in output questions. The late-binding trap is a classic hidden bug.",
    example: { title: "Squares of even numbers", code: "squares = [x*x for x in range(10) if x % 2 == 0]",
      walk: ["x = 0 passes the filter, append 0.", "x = 1 fails, skipped.", "x = 2 passes, append 4. Then 4, 6, 8 give 16, 36, 64.", "The odd values are skipped, so five items are produced.", "Late binding: [lambda: i for i in range(3)] returns [2, 2, 2] because every lambda reads the final i."],
      result: "[0, 4, 16, 36, 64]" },
    mistakes: ["Putting the if after the expression when an else is needed: [a if c else b for x in xs].", "Using a comprehension just for side effects.", "Late binding in lambdas inside loops. Fix with lambda i=i: i.", "Nested comprehension order: outer loop comes first."],
    exam: ["Evaluate a comprehension with a filter.", "Predict a list of lambdas created in a loop."],
    check: { q: "What is [x for x in range(5) if x % 2]?", options: ["[0, 2, 4]", "[1, 3]", "[1, 2, 3, 4]", "[0, 1]"], correct: 1, explain: "x % 2 is truthy only for odd x: 1 and 3." }
  },
  "py-args-kwargs": {
    why: "Function-call binding questions test whether you know how positional, default, *args and **kwargs fill parameters.",
    example: { title: "Calls to f(a, b=10, *args, **kwargs)", code: "def f(a, b=10, *args, **kwargs): ...\nf(1)\nf(1, 2, 3, 4, x=5)\nf(1, b=7)",
      walk: ["f(1): a = 1, b uses its default 10, args = (), kwargs = {}.", "f(1, 2, 3, 4, x=5): a = 1, b = 2, extra positionals go to args = (3, 4), extra keywords go to kwargs = {'x': 5}.", "f(1, b=7): b is given by keyword, so b = 7.", "f(b=2) fails: the required argument a is missing (TypeError)."],
      result: "Each call binds as shown in the explorer above" },
    mistakes: ["Passing a positional argument after a keyword argument (SyntaxError).", "Mutable default values.", "Wrong parameter order in the definition.", "Forgetting * to unpack a list: f(*items)."],
    exam: ["What does the function print for a given call.", "Which call raises TypeError."],
    check: { q: "def f(a, b=10, *args):\n    return b\nWhat does f(1, b=7) return?", options: ["10", "7", "1", "Error"], correct: 1, explain: "The keyword argument b=7 overrides the default." }
  },
  "py-exceptions": {
    why: "Handled and unhandled exceptions decide whether a program recovers or crashes. Tests ask which blocks run in each scenario.",
    example: { title: "Which blocks run", code: "try:\n    value = d['b']\nexcept KeyError:\n    value = 0\nelse:\n    print('ok')\nfinally:\n    print('done')",
      walk: ["No error: try runs, except is skipped, else runs, finally runs.", "KeyError raised: the matching except handles it, else is skipped, finally still runs.", "A different error such as ZeroDivisionError with except KeyError: no handler matches, finally runs, then the program crashes.", "Order matters: put specific except clauses before general ones such as except Exception."],
      result: "finally always runs; else runs only when try had no exception" },
    mistakes: ["Bare except: it hides real bugs.", "Putting a general except before a specific one.", "return inside finally overrides the earlier return or exception.", "Catching an error and silently passing."],
    exam: ["Predict printed output across try/except/else/finally.", "Spot the unhandled exception in a snippet."],
    check: { q: "If try raises no exception, which blocks run?", options: ["try, except, finally", "try, else, finally", "try, finally only", "try only"], correct: 1, explain: "except is skipped; else and finally run." }
  },
  "py-iterators-generators": {
    why: "Generators produce values one at a time, saving memory. Questions ask what next() returns and when the generator is exhausted.",
    example: { title: "countdown(3)", code: "def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\ng = countdown(3)\nnext(g)  # 3\nnext(g)  # 2\nnext(g)  # 1\nnext(g)  # StopIteration",
      walk: ["countdown(3) runs no code yet; it only creates the generator.", "The first next() runs until yield n and returns 3, then pauses with n = 3 kept.", "The next call resumes after yield: n becomes 2, loop again, yield 2.", "Then 1. After that n is 0, the loop ends and StopIteration is raised."],
      result: "3, 2, 1, then StopIteration" },
    mistakes: ["Iterating a generator twice: the second pass is empty.", "Confusing yield (pause and continue) with return (finish).", "Wrapping in list() when you only need one value, losing the memory benefit.", "Expecting len() to work on a generator."],
    exam: ["Values produced by repeated next().", "Difference between a list comprehension and a generator expression."],
    check: { q: "g = (x for x in range(3))\nlist(g)\nlist(g)\nWhat does the second list(g) give?", options: ["[0, 1, 2]", "[]", "Error", "[2]"], correct: 1, explain: "The generator was already exhausted by the first call." }
  },

  "err-types": {
    why: "The debugging round gives code that runs but is wrong, or crashes. Naming the error type fast tells you where to look.",
    example: { title: "Review, Identify, Fix, Validate", code: "total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)   # expected 15",
      walk: ["Review: the goal is the sum 1 + 2 + 3 + 4 + 5 = 15.", "Run it: it prints 10, with no error message. That signals a logical error.", "Identify: range(1, 5) stops at 4, so 5 is never added.", "Fix: change it to range(1, 6) without rewriting the rest.", "Validate: test n = 5, n = 1 (should be 1), and n = 0 (should be 0)."],
      result: "Logical error fixed by range(1, 6)" },
    mistakes: ["Rewriting the whole program instead of the smallest fix.", "Fixing the symptom, not the cause.", "Not testing edge cases such as empty input or one element.", "Confusing ValueError (bad value) with TypeError (wrong type)."],
    exam: ["Name the exception a snippet raises.", "Find and fix the bug, then say what edge case you tested."],
    check: { q: "print(total) where total was never defined raises:", options: ["TypeError", "NameError", "KeyError", "ValueError"], correct: 1, explain: "An undefined variable name raises NameError." }
  },

  "arr-traversal-2d": {
    why: "Matrix and circular-array problems hide off-by-one and modulo bugs, both named patterns in the Capgemini debugging list.",
    example: { title: "Circular walk over A to F, start 3", code: "arr = ['A','B','C','D','E','F']\nfor i in range(8):\n    idx = (3 + i) % len(arr)",
      walk: ["i = 0: (3 + 0) % 6 = 3, so D.", "i = 1: 4 (E), i = 2: 5 (F).", "i = 3: (3 + 3) % 6 = 0, so wrap to A.", "i = 4: B, i = 5: C, i = 6: back to D, i = 7: E.", "Bug check: using % (len - 1) = % 5 never produces index 5, so F is never visited."],
      result: "D E F A B C D E" },
    mistakes: ["Using % (n - 1) instead of % n.", "Negative index wrap: in Python -1 works, in C or Java it does not.", "Swapping row and column indices.", "Spiral traversal that revisits a row after the boundaries cross."],
    exam: ["Index after k steps in a circular array.", "Sum of a diagonal or border of a matrix."],
    check: { q: "In a list of length 6, what is (4 + 3) % 6?", options: ["7", "1", "0", "2"], correct: 1, explain: "7 mod 6 is 1." }
  },
  "arr-two-pointer-sliding-window": {
    why: "Two pointers and sliding windows turn O(n squared) brute force into O(n). They appear in both debugging and AI-assisted coding rounds.",
    example: { title: "Pair sum 10 in [1, 3, 4, 6, 8, 11]; window k = 3 in [2, 1, 5, 1, 3, 2]", code: "l, r = 0, len(a) - 1\nwhile l < r:\n    s = a[l] + a[r]\n    if s == t: return (l, r)\n    elif s < t: l += 1\n    else: r -= 1",
      walk: ["1 + 11 = 12 is too big, move the right pointer left.", "1 + 8 = 9 is too small, move the left pointer right.", "3 + 8 = 11 is too big, move right pointer left.", "3 + 6 = 9 is too small, move left pointer right.", "4 + 6 = 10: found.", "Sliding window: first window sum 8; sliding adds the new element and drops the old one; the best sum of size 3 is 9."],
      result: "Pair (4, 6) found; best window sum = 9" },
    mistakes: ["Using two pointers on an unsorted array.", "Recomputing the whole window sum each slide.", "Moving the wrong pointer after a comparison.", "Loop condition l <= r instead of l < r, pairing an element with itself."],
    exam: ["Maximum sum of a subarray of size k.", "Pair or triplet with a target sum in a sorted array."],
    check: { q: "What is the time complexity of the two-pointer pair-sum on a sorted array of n items?", options: ["O(n)", "O(n log n)", "O(n squared)", "O(1)"], correct: 0, explain: "Each pointer moves at most n steps in total." }
  },
  "arr-string-algos": {
    why: "Palindrome and anagram checks are the standard warm-up problems, and frequency counting with a hash map is the key trick.",
    example: { title: "racecar is a palindrome; listen and silent are anagrams", code: "# palindrome\nl, r = 0, len(s) - 1\nwhile l < r:\n    if s[l] != s[r]: return False\n    l += 1; r -= 1\n\n# anagram\nCounter('listen') == Counter('silent')",
      walk: ["racecar: compare r with r, a with a, c with c. All match and pointers meet at e: palindrome.", "abca would fail: a vs a matches, then b vs c mismatches.", "Anagram: count letters of listen (l,i,s,t,e,n each 1).", "Subtract the letters of silent. All counts return to 0, so they are anagrams."],
      result: "racecar: True; listen/silent: True" },
    mistakes: ["Ignoring case and punctuation when the problem says to.", "Comparing sorted strings (works but is O(n log n)).", "Forgetting an empty string is a palindrome.", "Using a list instead of a hash map for counts of arbitrary characters."],
    exam: ["First non-repeating character.", "Check palindrome ignoring spaces and case."],
    check: { q: "Time complexity of the Counter anagram check on strings of length n?", options: ["O(n)", "O(n squared)", "O(log n)", "O(n log n)"], correct: 0, explain: "Two passes over n characters." }
  },

  "ll-fundamentals": {
    why: "Linked-list pointer manipulation is a favourite debugging question because one wrong assignment loses the whole list.",
    example: { title: "Reverse 1 → 2 → 3 → 4, then detect a cycle", code: "prev = None\ncur = head\nwhile cur:\n    nxt = cur.next\n    cur.next = prev\n    prev = cur\n    cur = nxt\nreturn prev",
      walk: ["Start: prev = null, cur = 1.", "Save nxt = 2, point 1 to null, move prev = 1, cur = 2.", "Save nxt = 3, point 2 to 1, move on.", "Same for 3 and 4. cur becomes null.", "prev is the new head: 4 → 3 → 2 → 1.", "Cycle: slow moves 1, fast moves 2. In 1..6 with 6 linked back to 3 they meet, proving a cycle."],
      result: "4 → 3 → 2 → 1; fast and slow meet inside the loop" },
    mistakes: ["Overwriting cur.next before saving it.", "Returning cur (null) instead of prev.", "Not checking fast and fast.next for null.", "Losing the head when deleting the first node."],
    exam: ["Reverse a list and print it.", "Find the middle with fast and slow pointers."],
    check: { q: "In list reversal, what must you do before cur.next = prev?", options: ["Save cur.next", "Set cur to null", "Return prev", "Delete cur"], correct: 0, explain: "Otherwise the rest of the list is lost." }
  },
  "stack-queue": {
    why: "Stacks (LIFO) and queues (FIFO) underpin bracket matching, undo, BFS and many output-order questions.",
    example: { title: "Match brackets in {[()]}", code: "for ch in s:\n    if ch in '([{': stack.append(ch)\n    elif not stack or stack.pop() != pairs[ch]: return False\nreturn not stack",
      walk: ["Push {, push [, push (.", "Read ): pop ( and it matches.", "Read ]: pop [ and it matches.", "Read }: pop { and it matches.", "Stack is empty: valid.", "For ([)]: reading ) pops [ which does not match, so invalid."],
      result: "{[()]} is valid; ([)] is not" },
    mistakes: ["Popping from an empty stack (underflow).", "Using list.pop(0) as a queue: O(n), use deque.", "Returning True without checking the stack is empty at the end.", "Mixing up front and rear."],
    exam: ["Valid parentheses.", "Next greater element with a monotonic stack."],
    check: { q: "Is the string \"([)]\" valid?", options: ["Yes", "No", "Only with a queue", "Depends on length"], correct: 1, explain: "The ) arrives while [ is on top of the stack." }
  },

  "tree-traversals": {
    why: "Trees are a must-study topic. Traversal order and height calculation are tested directly and are the basis of many recursive problems.",
    example: { title: "Tree 8 / 4 12 / 2 6 10 14", code: "def inorder(n):\n    if not n: return\n    inorder(n.left); visit(n); inorder(n.right)",
      walk: ["Inorder (left, root, right): 2, 4, 6, 8, 10, 12, 14. This is sorted for a BST.", "Preorder (root first): 8, 4, 2, 6, 12, 10, 14.", "Postorder (root last): 2, 6, 4, 10, 14, 12, 8.", "Level order uses a queue: 8, 4, 12, 2, 6, 10, 14.", "Height: leaves are 1, node 4 and 12 are 2, root is 3."],
      result: "Inorder 2 4 6 8 10 12 14; height 3" },
    mistakes: ["Height off by one: empty tree is 0 and a single node is 1 (or 0 in the edge-based definition, so read the question).", "Mixing preorder and postorder.", "Forgetting the null base case.", "Using a stack for level order instead of a queue."],
    exam: ["Write the traversal of a given tree.", "Compute the height or count leaves recursively."],
    check: { q: "Inorder traversal of a binary search tree gives:", options: ["Sorted order", "Reverse order", "Level order", "Random order"], correct: 0, explain: "Left < root < right at every node." }
  },
  "bst-ops": {
    why: "Binary search trees give O(log n) search and insert on average. Validating a BST is a classic bug-finding task.",
    example: { title: "Insert 45 into 50, 30, 70, 20, 40, 60, 80", code: "def insert(n, v):\n    if not n: return Node(v)\n    if v < n.val: n.left = insert(n.left, v)\n    else: n.right = insert(n.right, v)\n    return n",
      walk: ["Compare 45 with 50: smaller, go left.", "Compare 45 with 30: bigger, go right.", "Compare 45 with 40: bigger, go right. 40 has no right child.", "Place 45 as the right child of 40.", "Search for 45 follows the same path: 3 comparisons.", "Validation: pass a (low, high) range down, comparing only to the parent is wrong."],
      result: "45 becomes the right child of 40" },
    mistakes: ["Validating only parent-child, not the whole range.", "Duplicates handled inconsistently.", "Assuming balanced: a sorted insert order makes a chain, O(n).", "Deleting a node with two children without using the inorder successor."],
    exam: ["Is this tree a valid BST?", "Inorder successor or lowest common ancestor."],
    check: { q: "What must be passed down when validating a BST recursively?", options: ["A (low, high) range", "Only the parent", "The height", "The leaf count"], correct: 0, explain: "A node must be within the bounds set by all its ancestors." }
  },

  "graph-representation-traversal": {
    why: "Graphs model networks, maps and dependencies. BFS and DFS are the base of almost every graph problem.",
    example: { title: "Graph A to F from the visualizer", code: "def bfs(g, s):\n    seen = {s}; q = deque([s])\n    while q:\n        u = q.popleft()\n        for v in g[u]:\n            if v not in seen:\n                seen.add(v); q.append(v)",
      walk: ["Adjacency list: A: B, D; B: A, C, E; C: B, F; D: A, E; E: B, D, F; F: C, E.", "BFS from A uses a queue and visits level by level: A, B, D, C, E, F.", "Mark nodes visited when you add them to the queue, not later, to avoid duplicates.", "DFS uses a stack or recursion and goes deep first: A, D, E, F, C, B in the stack version.", "Matrix form: a 6 x 6 grid with 1 where an edge exists, O(V squared) space."],
      result: "BFS order A B D C E F" },
    mistakes: ["Marking visited after dequeuing, causing repeated enqueues.", "Forgetting disconnected components.", "Using a matrix for a huge sparse graph.", "Treating an undirected edge as one-way."],
    exam: ["Write the BFS or DFS order.", "Count connected components."],
    check: { q: "Which structure does BFS use?", options: ["Queue", "Stack", "Heap", "Set only"], correct: 0, explain: "A FIFO queue processes nodes level by level." }
  },
  "graph-cycles-shortest-path": {
    why: "Cycle detection and shortest path are named debugging patterns. The recursion stack is the detail most solutions get wrong.",
    example: { title: "Directed cycle A → B → C → D → B, and a BFS maze", code: "def dfs(u):\n    visited.add(u); rec.add(u)\n    for v in g[u]:\n        if v not in visited and dfs(v): return True\n        if v in rec: return True\n    rec.remove(u)\n    return False",
      walk: ["Enter A, B, C, D: all are on the recursion stack.", "D points to B, and B is still on the stack: a back edge, so a cycle exists.", "Without the D to B edge, D finishes, is removed from the stack, and DFS backs out with no cycle.", "Shortest path on an unweighted grid: BFS expands level by level, so the first time you reach a cell is its shortest distance.", "Follow the stored previous cells back from the end to get the path."],
      result: "Cycle found at D to B; BFS gives the shortest number of steps" },
    mistakes: ["Using only a visited set for directed graphs (a diamond looks cyclic).", "Forgetting to remove a node from the recursion stack when backing out.", "Using DFS for shortest path on an unweighted graph.", "Not marking walls as blocked."],
    exam: ["Detect a cycle in a directed graph.", "Shortest path length in a grid or unweighted graph."],
    check: { q: "To detect a cycle in a directed graph with DFS you also need:", options: ["A recursion stack", "A heap", "A matrix", "Sorting"], correct: 0, explain: "A back edge to a node on the current path proves a cycle." }
  },

  "dp-fundamentals": {
    why: "DP turns exponential recursion into polynomial time by reusing sub-answers. It is a Must-study topic in the guide.",
    example: { title: "fib(8) plain versus memoized", code: "@lru_cache(None)\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)",
      walk: ["Plain recursion for fib(8) makes 67 calls, many repeating fib(3), fib(4).", "With memoization each value is computed once: about 15 calls.", "Tabulation fills dp bottom-up: 0, 1, 1, 2, 3, 5, 8, 13, 21.", "State is dp[i], the transition is dp[i] = dp[i-1] + dp[i-2], base cases dp[0] = 0, dp[1] = 1."],
      result: "fib(8) = 21; 67 calls versus 15" },
    mistakes: ["Wrong or missing base case.", "Wrong array size (n instead of n + 1).", "Filling in an order that reads cells not yet computed.", "Using memoization without caching the result."],
    exam: ["Complete the missing DP line.", "Number of ways or minimum cost problems on a 1D array."],
    check: { q: "Time complexity of memoized fib(n)?", options: ["O(n)", "O(2^n)", "O(n squared)", "O(log n)"], correct: 0, explain: "Each of n sub-problems is solved once." }
  },
  "dp-classics": {
    why: "LCS and 0/1 knapsack are the standard 2D DP problems. 2D indexing mistakes are a named bug pattern.",
    example: { title: "LCS of abcde and ace; knapsack w=[1,3,4,5], v=[1,4,5,7], capacity 7", code: "if a[i-1] == b[j-1]:\n    dp[i][j] = dp[i-1][j-1] + 1\nelse:\n    dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
      walk: ["Row and column 0 are 0.", "a = a matches a: take the diagonal plus 1 = 1.", "c matches c and e matches e: the table reaches 3.", "On a mismatch take the larger of the cell above or to the left.", "Knapsack: each cell is the better of skipping the item or taking it, dp[i-1][w-weight] + value.", "Best with capacity 7 is items of weight 3 and 4 for value 9."],
      result: "LCS = 3 (ace); knapsack = 9" },
    mistakes: ["Mixing dp[i][j] with a[i] instead of a[i-1].", "Reading dp[i-1][w - weight] when w < weight.", "Initialising the table with the wrong rows.", "Using greedy for 0/1 knapsack."],
    exam: ["Fill a small DP table by hand.", "Fix the recurrence in buggy LCS code."],
    check: { q: "LCS length of \"abc\" and \"def\"?", options: ["0", "1", "2", "3"], correct: 0, explain: "They share no characters." }
  },

  "advanced-greedy-heap": {
    why: "Heaps give fast min or max access and greedy rules solve scheduling problems. Kth largest is a typical interview question.",
    example: { title: "Insert 2 into the min-heap [3, 9, 5, 12, 10, 8]; interval scheduling", code: "heapq.heappush(h, 2)\nheapq.heappop(h)      # smallest",
      walk: ["Append 2 at the end (index 6).", "Parent is 5: 2 is smaller, swap.", "Parent is now 3: swap again. 2 reaches the root.", "Extract min removes 2, moves the last item to the root and sifts down.", "Greedy intervals: sort by end time, take an interval if it starts after the last chosen ends.", "From the 11 sample intervals the greedy picks 4."],
      result: "Heap root becomes 2; 4 intervals chosen" },
    mistakes: ["Python heapq is a min-heap; for max push negatives.", "Using a full sort when a size-k heap gives O(n log k).", "Sorting intervals by start instead of end for the greedy rule.", "Assuming greedy always works (it fails for 0/1 knapsack)."],
    exam: ["Kth largest element.", "Maximum number of non-overlapping meetings."],
    check: { q: "Python's heapq module implements a:", options: ["Min-heap", "Max-heap", "Binary search tree", "Stack"], correct: 0, explain: "heappop returns the smallest item." }
  },

  "complexity-bigo": {
    why: "Every coding answer must state time and space complexity. Spotting O(n squared) loops lets you optimise.",
    example: { title: "Counting operations", code: "for i in range(n):\n    for j in range(n):\n        work()   # n * n times",
      walk: ["A single loop over n items is O(n).", "A loop nested inside it over n items is O(n squared).", "With n = 10: O(n) is 10 steps, O(n log n) about 33, O(n squared) is 100, O(2^n) is 1024.", "Replacing an inner search with a hash set lookup makes it O(1), so the whole thing becomes O(n)."],
      result: "n = 10 gives 10, 33, 100 and 1,024 operations for the four rates" },
    mistakes: ["Counting only the outer loop.", "Ignoring that sorting inside a loop adds n log n each time.", "Confusing best case with worst case.", "Forgetting recursion uses stack space."],
    exam: ["Complexity of a given nested loop.", "How to improve a brute force solution."],
    check: { q: "Typical complexity of merge sort?", options: ["O(n log n)", "O(n squared)", "O(n)", "O(log n)"], correct: 0, explain: "It splits log n times and merges n items each level." }
  },

  "ai-fundamentals": {
    why: "The AI Literacy section starts with vocabulary. Confusing AI, ML, DL and GenAI costs easy marks.",
    example: { title: "One spam example, four levels", code: null,
      walk: ["AI: any system that behaves intelligently, even a hand-written rule list for spam.", "ML: the system learns the rule from labelled emails instead of being told.", "Deep learning: a many-layered neural network learns the features itself.", "Generative AI: a deep model that writes a new email from a prompt, not just labels one.", "Supervised learning has labels; unsupervised finds groups without labels; reinforcement learning uses rewards."],
      result: "AI ⊃ ML ⊃ Deep Learning ⊃ Generative AI" },
    mistakes: ["Treating AI and ML as synonyms.", "Thinking training happens on every chat message (that is inference).", "Calling generative models discriminative.", "Assuming a bigger model is always better."],
    exam: ["Pick the correct hierarchy.", "Which learning type fits a scenario."],
    check: { q: "Grouping customers with no labels is:", options: ["Unsupervised learning", "Supervised learning", "Reinforcement learning", "Inference"], correct: 0, explain: "No labels means unsupervised." }
  },
  "ai-llms": {
    why: "Tokens, context windows and temperature explain cost, memory and creativity of a model, and are tested in scenario questions.",
    example: { title: "Tokens, temperature and context for one prompt", code: null,
      walk: ["'Unbelievably, tokenization splits words into pieces.' is split into sub-word tokens, roughly 4 characters per token.", "Prompt 'The capital of France is' gives Paris the highest probability.", "Low temperature almost always picks Paris; high temperature flattens the odds so unlikely words appear.", "A context window of 8,192 tokens holds prompt and answer together. At 10,000 tokens the oldest 1,808 are dropped.", "A confident but wrong answer is a hallucination; facts after training are beyond the knowledge cut-off."],
      result: "Low temperature is consistent; overflow drops the oldest tokens" },
    mistakes: ["Equating tokens with words.", "Using high temperature for code.", "Assuming the model remembers a previous chat.", "Believing the model checks facts."],
    exam: ["Which parameter controls randomness.", "Why the model forgot an early instruction."],
    check: { q: "Which setting makes output more deterministic?", options: ["Lower temperature", "Higher temperature", "Larger context window", "More examples"], correct: 0, explain: "Low temperature picks the most likely token." }
  },
  "ai-prompt-engineering": {
    why: "Prompt quality decides code quality in the AI-assisted coding round. Structure beats length.",
    example: { title: "Vague versus structured prompt for two_sum", code: "Vague: write two sum\n\nStructured:\nYou are a senior Python developer.\nWrite two_sum(nums, target) returning indices of two numbers adding to target.\nUse a hash map, O(n) time. Include 2 test cases.\nReturn only code.",
      walk: ["The vague prompt does not state language, signature, constraints or output format.", "The structured prompt adds role, task, constraints and format.", "Each added part costs a few tokens but removes guesswork.", "Few-shot prompting adds one or two example input-output pairs.", "Prompt injection: text inside retrieved data that tries to override your instructions, so treat data as data."],
      result: "Structured prompts give correct code on the first try more often" },
    mistakes: ["Filler words like please and thanks so much.", "No language or function signature.", "Not stating complexity or edge cases.", "Trusting instructions found inside untrusted documents."],
    exam: ["Choose the better prompt.", "Identify prompt injection in a scenario."],
    check: { q: "Providing two input-output examples in the prompt is called:", options: ["Few-shot prompting", "Zero-shot prompting", "Fine-tuning", "Retrieval"], correct: 0, explain: "Examples in the prompt are few-shot." }
  },
  "ai-rag": {
    why: "RAG is a must-study topic. It is how companies make LLMs answer from their own up-to-date documents.",
    example: { title: "Refund policy question", code: null,
      walk: ["Offline: split the policy PDF into chunks, embed each, store the vectors.", "A user asks: What is the refund window?", "The question is embedded and compared with the chunk vectors.", "The nearest chunks (about refunds) are retrieved and re-ranked.", "The prompt becomes: instructions + the 3 best chunks + the question.", "The model answers from those chunks and cites the source."],
      result: "Answer grounded in the policy, with a citation" },
    mistakes: ["Chunks too big or too small.", "Expecting RAG to remove hallucination completely.", "Using different embedding models for documents and questions.", "Skipping citations."],
    exam: ["Order the steps of a RAG pipeline.", "RAG versus fine-tuning for frequently changing data."],
    check: { q: "RAG mainly helps by:", options: ["Grounding answers in retrieved documents", "Making the model bigger", "Removing the need for prompts", "Training faster"], correct: 0, explain: "Retrieved context grounds the answer." }
  },
  "ai-agentic": {
    why: "Agentic AI is how models take actions through tools. The exam asks how agents differ from chatbots and where humans stay in control.",
    example: { title: "Book the cheapest train", code: null,
      walk: ["Thought: plan search, compare, book, confirm.", "Action: call search_trains(Delhi, Pune, tomorrow).", "Observation: six trains, cheapest costs 820.", "The booking spends money, so ask a human to approve.", "Action: book_ticket after approval, then observe the confirmation.", "Multi-agent version: orchestrator splits the job, researcher gathers, writer drafts, reviewer checks, human signs off."],
      result: "Goal completed with a human approval gate" },
    mistakes: ["Giving an agent unlimited tools.", "No approval for irreversible actions.", "Assuming memory is permanent.", "Ignoring that errors compound across steps."],
    exam: ["Agent versus chatbot.", "What is tool or function calling."],
    check: { q: "Human-in-the-loop means:", options: ["A person approves risky actions", "Humans write all code", "No tools are used", "The model trains itself"], correct: 0, explain: "It is an approval and oversight gate." }
  },
  "ai-responsible": {
    why: "Companies need AI that is fair, private and accountable. These conceptual questions are quick marks when you know the vocabulary.",
    example: { title: "A hiring model", code: null,
      walk: ["A resume screener is trained on past hires, mostly from group A.", "It scores group A applicants more accurately than group B: algorithmic bias.", "Fix: collect balanced data and measure accuracy per group.", "Add explainability so a reviewer sees why a candidate was rejected.", "Keep a human reviewer accountable for the final decision.", "Do not paste applicants' personal data into a public AI tool."],
      result: "Bias came from data; fixes are balance, explainability and oversight" },
    mistakes: ["Assuming a model is neutral.", "Treating the model as accountable.", "Skipping disclosure of AI-generated content.", "Ignoring privacy in prompts."],
    exam: ["Which source causes algorithmic bias.", "Why explainability matters."],
    check: { q: "Algorithmic bias commonly comes from:", options: ["Unrepresentative training data", "Fast hardware", "Short prompts", "A dark theme"], correct: 0, explain: "Models reproduce patterns in their data." }
  },
  "ai-evaluation-monitoring": {
    why: "A model that worked at launch can decay. Evaluation and monitoring are very-high-priority topics in the guide.",
    example: { title: "20 scored items at threshold 0.5", code: null,
      walk: ["10 items score 0.5 or higher and are predicted positive.", "7 of them are truly positive (TP) and 3 are not (FP).", "Of 9 real positives, 2 scored below 0.5 and were missed (FN).", "Precision = 7 / 10 = 70%. Recall = 7 / 9 = 78%.", "Raising the threshold increases precision and lowers recall.", "Drift: accuracy falls after the world changes; an alert at 85% triggers retraining."],
      result: "Precision 70%, recall 78% at threshold 0.5" },
    mistakes: ["Reporting only accuracy.", "No monitoring after deployment.", "Not logging prompts, outputs and token usage.", "Ignoring human review for high-stakes cases."],
    exam: ["Compute precision or recall.", "Name the sign of model drift."],
    check: { q: "Precision answers:", options: ["Of the items flagged, how many were correct", "Of all correct items, how many were found", "How fast is the model", "How big is the model"], correct: 0, explain: "TP divided by TP plus FP." }
  },
  "ai-in-software-dev": {
    why: "The final round is AI-assisted coding. Using the tool well means prompting clearly and then verifying everything.",
    example: { title: "AI first draft versus review", code: "# AI first draft\nquery = \"SELECT * FROM users WHERE name = '\" + name + \"'\"\n\n# After review\nquery = \"SELECT * FROM users WHERE name = ?\"\ncursor.execute(query, (name,))",
      walk: ["Prompt clearly: language, signature, constraints, tests.", "Read the generated code: can you explain every line?", "Run the visible tests, then edge cases: empty, single item, duplicates, large input.", "The first draft passes the sample but builds SQL by string concatenation: injection risk.", "Fix it with a parameterised query and re-test.", "Submit only after correctness and complexity are checked."],
      result: "Passing tests is not enough: review security and complexity too" },
    mistakes: ["Blind copy-paste.", "Accepting the first answer.", "Not giving the failing input back to the model.", "Skipping edge cases."],
    exam: ["Why review AI-generated code.", "Best next step when a test fails."],
    check: { q: "Best next step when AI code fails a test?", options: ["Give the model the failing input, expected and actual output", "Submit anyway", "Raise temperature", "Delete the prompt"], correct: 0, explain: "Concrete feedback produces a targeted fix." }
  }
};

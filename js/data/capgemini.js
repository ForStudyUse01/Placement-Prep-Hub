export const CHECKLIST = {
  "1. AI Literacy": [
    "AI, ML, DL and Generative AI", "Foundation Models and LLMs", "Training vs Inference", "Tokens, Tokenization and Embeddings",
    "Transformers and Context Windows", "Hallucinations and Model Limitations", "Prompt Engineering", "Zero-shot, One-shot and Few-shot Prompting",
    "Role and Context-based Prompting", "Prompt Injection", "RAG Architecture and Pipeline", "Chunking and Vector Databases",
    "Semantic Search and Similarity Search", "Retrieval and Reranking", "RAG vs Fine-tuning", "Agentic AI and AI Agents",
    "Tool Calling and Function Calling", "Agent Memory and Planning", "Multi-Agent Systems", "Responsible AI and Ethics",
    "Bias, Fairness and Transparency", "Privacy, Security and Copyright", "AI Content Authenticity and Disclosure",
    "AI Evaluation and Output Validation", "Logs, Monitoring and Observability", "Model Drift and Performance Monitoring",
    "AI Guardrails and Human Oversight", "GitHub Copilot and AI Coding Assistants"
  ],
  "2. Debugging": [
    "C/C++/Java/Python fundamentals", "Python data types and type conversion", "Mutable vs Immutable Objects",
    "Python Lists, Tuples, Sets and Dictionaries", "List Indexing and Slicing", "List and Dictionary Methods",
    "Python Functions and Arguments", "Lambda and List Comprehensions", "Exception Handling",
    "Map, Filter, Reduce, Enumerate and Zip", "Python Iterators and Generators", "Syntax, Runtime and Logical Errors",
    "IndexError, KeyError, ValueError and TypeError", "Variables, Operators and Loops", "Functions and Recursion",
    "Arrays and 2D Arrays", "Strings and Substrings", "Indexing and Boundary Conditions", "Pointers and Memory Basics",
    "Off-by-One and Overflow Errors", "Searching and Sorting", "Two Pointers and Sliding Window", "Prefix Sum and Hashing",
    "Linked Lists", "Stacks and Queues", "Binary Trees and BSTs", "Tree Traversals and Height", "BFS and DFS",
    "Graph Cycle Detection", "Connected Components and Shortest Paths", "Memoization and Tabulation",
    "1D and 2D Dynamic Programming", "LCS and 0/1 Knapsack", "Greedy Algorithms", "Heaps and Priority Queues",
    "Kth Largest and Sliding Window Maximum", "Time and Space Complexity", "Dry Runs and Edge-Case Testing",
    "Circular Array and Modulo Problems"
  ],
  "3. AI-Assisted Coding": [
    "Understanding Problem Statements", "Identifying Inputs, Outputs and Constraints", "Breaking Down Problems",
    "Structured Prompt Writing", "Role, Context and Task Instructions", "Specifying Python or Required Language",
    "Specifying Constraints and Test Cases", "Choosing Algorithms and Data Structures", "Step-by-Step Prompting",
    "Code Generation", "Pseudocode to Code", "Python Functions and Data Structures", "Code Explanation and Review",
    "Finding AI-generated Bugs", "Testing Normal and Edge Cases", "Debugging and Iterative Refinement",
    "Code Optimization", "Time and Space Complexity", "Validating Final Output", "Avoiding Blind Copy-Pasting"
  ]
};

export const PATTERNS = [
  "Circular array traversal", "Index wrapping using modulo", "Incorrect loop conditions", "Incorrect array indexing",
  "Wrong recursion base cases", "Incorrect tree height calculation", "Graph cycle detection errors",
  "Incorrect BFS/DFS visited logic", "2D DP indexing mistakes", "Incorrect DP recurrence",
  "Wrong sorting/searching conditions", "Incorrect return values", "Python mutable default argument bugs",
  "Incorrect list and dictionary operations", "Incorrect indentation and scope", "Incorrect list slicing",
  "Unhandled exceptions", "Incorrect dictionary key access", "Incorrect type conversion", "Infinite recursion"
];

export const WORKFLOW = [
  ["Review", "Read the problem and understand the existing code."],
  ["Identify", "Find the incorrect logic, syntax or boundary condition."],
  ["Fix", "Correct the bug without unnecessarily rewriting the program."],
  ["Validate", "Test normal cases, edge cases and boundary conditions."]
];

export const REVISION_PLAN = [
  ["1", "AI Literacy: RAG, LLMs, Prompt Engineering, Agentic AI", "1.5 hours"],
  ["2", "Responsible AI, Logs, Monitoring, AI Evaluation", "45 minutes"],
  ["3", "Python debugging: Lists, Dictionaries, Strings, Loops, Functions, Exceptions", "1 hour"],
  ["4", "DSA: Arrays, Sliding Window, Trees, Graphs and 2D DP", "1 hour"],
  ["5", "AI-assisted coding and prompt practice", "1 hour"],
  ["6", "Solve 2–3 debugging problems under time pressure", "45 minutes"]
];

export const FORMAT_NOTES = [
  ["Technical module", "Two multiple-choice sections: AI Literacy and Technical (DSA and CS fundamentals). It acts as an elimination gate before the coding and interview stages."],
  ["Size and timing", "Reported at roughly 20 questions per section, about 40 total, at around one minute per question. Counts and timing differ between drives; confirm with your placement cell."],
  ["Marking", "Candidate reports describe no negative marking on these sections, so attempt every question."],
  ["Pseudo-code", "A separate pseudo-code MCQ section tests algorithm tracing, not language knowledge (DECLARE, WHILE, FOR style notation). Reports vary: about 15 to 25 questions. Trace loops with index changes, nested conditions and basic sorting by hand."],
  ["Other rounds reported", "Quantitative, verbal and game-based aptitude, behavioural profiling, and a communication assessment appear in some drives. Sources disagree on the exact mix."],
  ["Caution", "All figures are candidate-reported or from prep sites, not official. Check the official recruitment notice for your drive."]
];

export const TECH_SYLLABUS = {
  "Programming and pseudo-code": ["Variables and data types", "Operators and conditions", "Loops and functions", "Arrays and strings", "Basic recursion", "Output tracing"],
  "Data structures and algorithms": ["Arrays and strings", "Linked lists", "Stacks and queues", "Hashing", "Searching and sorting", "Tree basics, basic graphs", "Time and space complexity"],
  "Object-oriented programming": ["Classes and objects", "Encapsulation and abstraction", "Inheritance", "Polymorphism", "Overloading vs overriding", "== vs .equals() (Java)"],
  "DBMS and SQL": ["Keys (primary, foreign)", "Normalisation", "Joins", "Transactions and ACID", "Constraints and indexing", "SELECT, WHERE, GROUP BY, HAVING", "Aggregates and subqueries"],
  "Operating systems": ["Process vs thread", "CPU scheduling", "Deadlock and its four conditions", "Memory management, paging", "Virtual memory", "Synchronisation, context switching"],
  "Computer networks": ["OSI model", "TCP/IP", "HTTP vs HTTPS", "IP addressing", "DNS", "TCP vs UDP, ports", "Client-server architecture"],
  "Software engineering and modern basics": ["Git: repository, commit, branch, merge", "SDLC basics", "REST APIs and HTTP methods", "Cloud basics", "Cybersecurity basics"]
};

export const SOURCES = [
  ["FACE Prep: Exceller technical assessment, AI literacy 2026", "https://faceprep.in/article/capgemini-exceller-technical-assessment-ai-literacy-questions-2026/"],
  ["Knoff Campus Jobs: Capgemini technical test 2026", "https://knoffcampusjobs.com/capgemini-technical-test-2026/"],
  ["OnlineStudy4u: Exceller technical assessment 2027", "https://onlinestudy4u.in/capgemini-exceller-technical-assessment-2027/"],
  ["FACE Prep: Capgemini pseudo-code MCQs", "https://www.faceprep.in/article/capgemini-pseudo-code-mcqs-capgemini-pseudo-code-test/"]
];

export const TIPS = [
  "Prioritise DSA and CS fundamentals first: they carry the most predictable questions.",
  "Add an AI Literacy layer: a few focused hours on GenAI concepts, prompt structure and responsible AI covers most of that section.",
  "Drill pseudo-code tracing; trace line by line instead of reasoning about the whole snippet.",
  "Understand why wrong options are wrong, not only the right answer.",
  "Practise under a timer; skip slow questions and come back.",
  "Do not rely on AI-generated answers or memorise code; start AI topics early, not the night before."
];

// Study material specific to this assessment. `t` = study topic id (deep link).
export const STUDY_MAP = {
  "Section 1 · AI Literacy": [
    ["A. AI fundamentals: AI, ML, DL, GenAI, learning types", "ai-fundamentals"],
    ["B. LLMs: tokens, embeddings, context window, temperature", "ai-llms"],
    ["C. Prompt engineering and prompt injection", "ai-prompt-engineering"],
    ["D. RAG: pipeline, chunking, vector search, RAG vs fine-tuning", "ai-rag"],
    ["E. Agentic AI: agents, tool calling, memory, multi-agent", "ai-agentic"],
    ["F. Responsible AI: bias, privacy, deepfakes, oversight", "ai-responsible"],
    ["G. Evaluation and monitoring: groundedness, drift, observability", "ai-evaluation-monitoring"],
    ["H. AI in software development: Copilot, review, security risks", "ai-in-software-dev"]
  ],
  "Section 2 · Debugging (Python first)": [
    ["Variables, types and casting", "pf-variables"],
    ["Operators and precedence", "pf-operators"],
    ["Conditionals and loops", "pf-conditionals-loops"],
    ["Functions, scope and recursion", "pf-functions-recursion"],
    ["Mutable vs immutable, default-argument bug", "py-mutability"],
    ["Lists, tuples, sets, dicts and slicing", "py-collections"],
    ["Comprehensions and lambda", "py-comprehensions"],
    ["*args, **kwargs, default arguments", "py-args-kwargs"],
    ["Exception handling", "py-exceptions"],
    ["Iterators and generators", "py-iterators-generators"],
    ["Error types and debugging workflow", "err-types"],
    ["Arrays, 2D arrays, circular arrays and modulo", "arr-traversal-2d"],
    ["Two pointers and sliding window", "arr-two-pointer-sliding-window"],
    ["Strings: palindrome, anagram, frequency", "arr-string-algos"],
    ["Linked lists", "ll-fundamentals"],
    ["Stack and queue", "stack-queue"],
    ["Binary trees and traversals", "tree-traversals"],
    ["Binary search trees", "bst-ops"],
    ["Graph traversal (BFS, DFS)", "graph-representation-traversal"],
    ["Graph cycles and shortest path", "graph-cycles-shortest-path"],
    ["Dynamic programming basics", "dp-fundamentals"],
    ["LCS and 0/1 knapsack", "dp-classics"],
    ["Greedy and heaps", "advanced-greedy-heap"],
    ["Time and space complexity", "complexity-bigo"]
  ],
  "Section 3 · AI-assisted coding": [
    ["Writing structured prompts for code", "ai-prompt-engineering"],
    ["Reviewing and validating AI-generated code", "ai-in-software-dev"],
    ["Complexity: optimise the first answer", "complexity-bigo"],
    ["Patterns you will be asked to generate", "arr-two-pointer-sliding-window"]
  ]
};

// Technical MCQ areas reported for the Exceller technical section. Quick revision sheets.
export const CHEATSHEETS = [
  ["Pseudo-code tracing", [
    "Build a trace table: one column per variable, one row per loop pass. Do not skip rows.",
    "Check whether the loop bound is inclusive or exclusive, and whether division is integer division.",
    "Example: a = 5, s = 0; while a > 0: s = s + a; a = a - 2. Passes: (a=5, s=5), (3, 8), (1, 9), then a = -1 stops. Output 9.",
    "Watch for assignments that happen after the condition check, and for nested loops (inner runs fully per outer pass).",
    "Recursion: write each call and its return value, then unwind from the base case."
  ]],
  ["OOP", [
    "Encapsulation: data and methods together, hide state behind access modifiers. Abstraction: expose what, hide how. Inheritance: reuse a parent class. Polymorphism: one call, many behaviours.",
    "Overloading: same name, different parameters, same class, resolved at compile time. Overriding: subclass redefines a parent method with the same signature, resolved at run time.",
    "Java: == compares references, .equals() compares content. A final class cannot be extended, a final method cannot be overridden.",
    "Abstract class: can mix implemented and abstract methods, cannot be instantiated. Interface: contract of methods a class implements.",
    "Constructor: runs on object creation, same name as the class in Java and C++. static members belong to the class, not to objects."
  ]],
  ["DBMS and SQL", [
    "Keys: primary (unique, not null), foreign (references another table), candidate, composite.",
    "Normalisation: 1NF atomic values, 2NF no partial dependency on part of a key, 3NF no transitive dependency, BCNF every determinant is a key. Purpose: reduce redundancy and anomalies.",
    "ACID: Atomicity, Consistency, Isolation, Durability.",
    "WHERE filters rows before grouping; HAVING filters groups after GROUP BY. Example: SELECT dept, AVG(salary) FROM emp GROUP BY dept HAVING AVG(salary) > 50000;",
    "INNER JOIN keeps matching rows only; LEFT JOIN keeps all left rows with NULL where no match.",
    "DELETE removes chosen rows (can roll back), TRUNCATE empties the table fast, DROP removes the table itself.",
    "Employees earning above 50,000: SELECT * FROM employees WHERE salary > 50000;"
  ]],
  ["Operating systems", [
    "Process: program in execution with its own memory. Thread: lightweight unit inside a process, shares its memory.",
    "Scheduling: FCFS (arrival order), SJF (shortest job first), Round Robin (fixed time slice), Priority.",
    "Deadlock needs all four: mutual exclusion, hold and wait, no preemption, circular wait.",
    "Paging splits memory into fixed-size pages; virtual memory lets a program use more than physical RAM; thrashing is excessive swapping.",
    "Context switch: saving one process's state and loading another's. Mutex and semaphore coordinate access to shared data."
  ]],
  ["Computer networks", [
    "OSI layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. TCP/IP groups them into four.",
    "TCP: connection-oriented, reliable, ordered. UDP: connectionless, faster, no delivery guarantee (video, DNS).",
    "HTTP is plain text; HTTPS adds TLS encryption. DNS translates domain names to IP addresses.",
    "IP address identifies a host on a network; MAC address identifies a network card. Common ports: 80 HTTP, 443 HTTPS, 22 SSH, 53 DNS.",
    "Client-server: clients send requests, a server responds. REST methods: GET read, POST create, PUT update, DELETE remove. Codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error."
  ]],
  ["Git, SDLC and cloud basics", [
    "Repository stores project history. Commit saves a snapshot. Branch is an independent line of work. Merge combines branches. Pull request asks to merge with review.",
    "Version control purpose: track changes, collaborate, roll back, review.",
    "SDLC phases: requirements, design, development, testing, deployment, maintenance. Agile works in short iterations; waterfall is sequential.",
    "Cloud: IaaS (raw infrastructure), PaaS (platform to run your code), SaaS (finished software). Cybersecurity basics: least privilege, encryption, validate input, never hard-code secrets."
  ]]
];

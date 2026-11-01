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

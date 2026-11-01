// Hand-written lessons for the Video Explainer (part 3: AI Literacy topics).
import { T, B, F, A, C, V, K, S, L } from "./video_scripts1.js";

export const PART3 = {
  "ai-fundamentals": { title: "AI, ML, DL and GenAI", scenes: [
    T("AI, ML, DL and GenAI", "AI literacy", "These four terms are used loosely everywhere, but they nest inside each other like Russian dolls. Get the hierarchy right and many exam questions answer themselves."),
    F("The nesting", ["Artificial Intelligence: any machine doing smart tasks", "Machine Learning: learns patterns from data", "Deep Learning: many layer neural networks", "Generative AI: creates new text, images, code"], "Artificial intelligence is the biggest circle: machines doing tasks that need intelligence. Machine learning is inside it, systems that learn from data instead of fixed rules. Deep learning is inside that, using many layered neural networks. Generative AI sits on top, creating new content."),
    V("Rules versus learning", "Traditional program", ["You write the rules", "Same input, same output"], "Machine learning", ["You supply examples", "The model finds the rules"], "In a traditional program a human writes the rules. In machine learning you give examples with answers and the model discovers the rules itself, then applies them to new data."),
    B("Three ways to learn", ["Supervised: labelled examples", "Unsupervised: find hidden groups", "Reinforcement: rewards and penalties"], "Supervised learning uses labelled examples, like emails marked spam. Unsupervised learning looks for structure without labels, like customer groups. Reinforcement learning learns by trial and error from rewards."),
    B("Examples to remember", ["Spam filter: ML", "Face unlock: deep learning", "ChatGPT, image generators: GenAI"], "A spam filter is machine learning. Face unlock is deep learning. Chat assistants and image generators are generative AI."),
    K("GenAI is a subset of DL, which is a subset of ML, which is a subset of AI.", "Remember the chain: generative AI sits inside deep learning, inside machine learning, inside artificial intelligence.")
  ] },

  "ai-llms": { title: "How LLMs Work", scenes: [
    T("How LLMs Work", "AI literacy", "A large language model does one thing: it predicts the next piece of text. Everything impressive it does comes from doing that extremely well."),
    F("From text to answer", ["Text is split into tokens", "Tokens become embeddings (numbers)", "Attention links related tokens", "The model scores every possible next token", "One token is chosen, then repeated"], "Your text is split into tokens. Each token becomes a list of numbers called an embedding. Attention lets the model relate tokens to each other. It then scores every possible next token, picks one, and repeats the loop."),
    B("Key terms", ["Token: a word piece, about 4 characters", "Context window: how much it can see at once", "Parameters: the learned weights"], "A token is a chunk of a word, roughly four characters of English. The context window is the maximum tokens the model can see at once, prompt and answer together. Parameters are the learned numbers inside the model."),
    V("Temperature", "Low, near 0", ["Picks the most likely token", "Focused and repeatable"], "High, near 1 or more", ["Samples more widely", "Creative but riskier"], "Temperature controls randomness. Low values pick the most likely word, giving steady, repeatable answers. High values explore less likely words, giving creativity and more mistakes."),
    B("Limits to know", ["Can state false things confidently", "Forgets anything outside the context window", "Knowledge stops at its training date"], "Models can state false things with confidence. They cannot see anything outside the context window. And their knowledge stops at the training cutoff unless you give them fresh information."),
    K("An LLM predicts the next token. It does not look facts up.", "The key sentence: a language model predicts the next token. It does not look facts up.")
  ] },

  "ai-prompt-engineering": { title: "Prompt Engineering", scenes: [
    T("Prompt Engineering", "AI literacy", "The same model gives very different answers depending on how you ask. A clear prompt is the cheapest way to improve results."),
    V("Weak versus strong prompt", "Weak", ["Write about sorting", "No audience, no format, no goal"], "Strong", ["You are a tutor. Explain merge sort to a first year student in 5 bullets with one example", "Role, task, audience, format"], "A weak prompt leaves the model guessing. A strong prompt sets a role, a task, the audience and the output format. Same model, much better answer."),
    B("Shot prompting", ["Zero-shot: just the instruction", "One-shot: one worked example", "Few-shot: several examples to copy the pattern"], "Zero shot gives only the instruction. One shot adds one example. Few shot adds several, so the model copies the pattern and format."),
    F("A reliable prompt recipe", ["Role: who should it act as", "Context: the facts it needs", "Task: exactly what to do", "Format: how to present it", "Constraints: limits and length"], "A reliable recipe has five parts: the role, the context, the task, the format, and any constraints. Fill all five and the output improves."),
    B("Chain of thought", ["Ask it to reason step by step", "Helps with maths and logic", "Show the reasoning before the answer"], "Chain of thought means asking the model to reason step by step before answering. It helps a lot on maths and logic, because intermediate steps reduce mistakes."),
    K("Be specific, give examples, define the format.", "If you remember three things: be specific, give examples, and define the output format.")
  ] },

  "ai-rag": { title: "RAG", scenes: [
    T("Retrieval Augmented Generation", "AI literacy", "A model does not know your private documents, and it can make things up. RAG fixes both by fetching the facts first."),
    F("The RAG pipeline", ["Split documents into chunks", "Embed chunks into vectors", "Store them in a vector database", "Embed the question and find similar chunks", "Give those chunks to the LLM to answer"], "First, split your documents into chunks and turn each into a vector with an embedding model. Store them in a vector database. When a question arrives, embed it, find the most similar chunks, and pass them to the model along with the question."),
    V("Plain LLM versus RAG", "Plain LLM", ["Answers from memory", "May be outdated or invented"], "RAG", ["Answers from retrieved text", "Can cite its sources"], "A plain model answers from memory, which can be old or wrong. With RAG it answers from the passages you retrieved, and can point to the source."),
    B("Why teams choose RAG", ["Fresh data without retraining", "Private data stays in your control", "Fewer hallucinations, easier audit"], "RAG gives fresh data without retraining, keeps private data under your control, and reduces made up answers because every claim can be traced."),
    B("Where it breaks", ["Bad chunking loses meaning", "Wrong passages retrieved", "Context window too small"], "It can still fail. Chunks that are too small or too large lose meaning. The retriever may fetch the wrong passages. And too many passages can overflow the context window."),
    K("RAG: retrieve first, then generate.", "In short, RAG retrieves first, then generates.")
  ] },

  "ai-agentic": { title: "Agentic AI", scenes: [
    T("Agentic AI", "AI literacy", "A chatbot answers. An agent acts. Agents decide what to do next, use tools, and keep going until the goal is done."),
    F("The agent loop", ["Goal: what must be achieved", "Plan: choose the next step", "Act: call a tool or API", "Observe: read the result", "Repeat or finish"], "An agent loops. It starts with a goal, plans a step, acts by calling a tool, observes the result, and then decides whether to continue or finish."),
    V("Chatbot versus agent", "Chatbot", ["One question, one answer", "No actions in the world"], "Agent", ["Multi step, uses tools", "Search, run code, send requests"], "A chatbot gives one answer to one question. An agent can search the web, run code, query a database, and chain many steps."),
    B("Building blocks", ["Tool calling: model picks a function", "Memory: short term and long term", "Planning: break goals into steps", "Multi-agent: specialists that cooperate"], "The building blocks are tool calling, where the model chooses a function; memory; planning; and multi agent systems where specialist agents cooperate."),
    B("Risks and controls", ["Wrong actions have real effects", "Limit permissions", "Human approval for risky steps", "Log every step"], "Because agents act, mistakes have real effects. Give them minimal permissions, require human approval for risky steps, and log everything they do."),
    K("Agent = model + tools + a loop.", "Simple formula: an agent is a model, plus tools, plus a loop.")
  ] },

  "ai-responsible": { title: "Responsible AI", scenes: [
    T("Responsible AI", "AI literacy", "A model is only as fair as its data and as safe as its guardrails. Responsible AI is about spotting the harm before users do."),
    B("The core principles", ["Fairness: no unjust bias", "Transparency: explain what it does", "Privacy: protect personal data", "Accountability: a human owns the outcome"], "Four principles to remember: fairness, transparency, privacy and accountability. Someone is always responsible for what the system does."),
    F("How bias creeps in", ["Training data under-represents a group", "Model learns the skewed pattern", "Predictions are worse for that group", "Decisions harm real people"], "Bias usually starts in the data. If a group is under represented, the model learns a skewed pattern, performs worse for that group, and real decisions suffer."),
    V("Privacy do and do not", "Do", ["Remove personal data before sending", "Use approved tools", "Follow consent rules"], "Do not", ["Paste customer data into public chatbots", "Share secrets or keys", "Ignore data retention"], "Do remove personal data, use approved tools and respect consent. Do not paste customer data into public chat tools, and never share keys or secrets."),
    B("Deepfakes and misuse", ["Check the source", "Look for odd lighting and audio", "Label synthetic content"], "Deepfakes are realistic fake media. Check the source, look for inconsistencies, and label synthetic content clearly."),
    K("Keep a human accountable for AI decisions.", "The takeaway: AI can assist, but a human stays accountable.")
  ] },

  "ai-evaluation-monitoring": { title: "Evaluating AI Systems", scenes: [
    T("Evaluating AI Systems", "AI literacy", "Shipping a model is the start, not the end. You must measure quality before launch and keep watching it afterwards."),
    B("What to measure", ["Accuracy and correctness", "Hallucination rate", "Latency and cost", "Safety and bias checks"], "Measure four things before launch. Correctness, meaning how often the answers are right. The hallucination rate, meaning how often it makes things up. Speed and cost per request. And safety and bias checks."),
    F("Catching hallucinations", ["Ground answers in retrieved sources", "Ask for citations", "Cross check claims", "Human review for high stakes"], "To catch hallucinations, ground answers in sources, ask for citations, cross check claims against the documents, and use human review where the stakes are high."),
    V("Data drift versus concept drift", "Data drift", ["Inputs change over time", "New slang, new products"], "Concept drift", ["The meaning of right answers changes", "Rules or behaviour shift"], "Data drift means the inputs change, such as new slang. Concept drift means the right answer itself changes, such as new policies. Both quietly lower accuracy."),
    B("Observability", ["Log prompts and outputs", "Track quality and cost dashboards", "Alert on sudden changes", "Collect user feedback"], "Observability means logging prompts and outputs, tracking quality and cost, setting alerts for sudden changes, and collecting user feedback."),
    K("If you cannot measure it, you cannot trust it.", "If you cannot measure it, you cannot trust it.")
  ] },

  "ai-in-software-dev": { title: "AI in Software Development", scenes: [
    T("AI in Software Development", "AI literacy", "AI assistants write code quickly, but speed without checking is how bugs and security holes reach production."),
    B("Where AI helps", ["Autocomplete and boilerplate", "Explaining unfamiliar code", "Writing first draft tests", "Suggesting refactors"], "AI helps with autocomplete and boilerplate, explaining unfamiliar code, drafting tests, and suggesting refactors."),
    F("A safe workflow", ["Write a clear, specific prompt", "Read the generated code", "Run tests and linters", "Review for security", "Commit only what you understand"], "A safe workflow: give a specific prompt, read what comes back, run tests and linters, review it for security issues, and only commit code you understand."),
    V("Good habit versus risky habit", "Good", ["Small tasks, review each diff", "Keep secrets out of prompts"], "Risky", ["Paste a whole project blindly", "Trust output without tests"], "Good habits are small tasks and reviewing every change. Risky habits are blind trust and sharing secrets or private code with unapproved tools."),
    B("Common AI code risks", ["Plausible but wrong logic", "Invented library functions", "Insecure patterns such as SQL injection", "Licence and copyright issues"], "AI code can look right and be wrong, invent functions that do not exist, repeat insecure patterns, and raise licensing questions."),
    K("You own the code you commit.", "Whatever the AI wrote, you own the code you commit.")
  ] }
};

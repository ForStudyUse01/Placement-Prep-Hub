# Placement Prep Hub

Static campus-placement prep site (no build step, no backend).

## Features
Study material with diagrams, company MCQ tests (incl. Capgemini AI Literacy), debugging arena (Python/Java/C/C++/JS), AI-assisted coding round with token budget and primary/backup free-tier models, Prompt Lab (real token usage), GitHub repo audit (2 repos x 100 questions), Capgemini 2026 guide with 87-item tracker.

## Deploy on GitHub Pages
1. Push this folder to a GitHub repo (root must contain `index.html`).
2. Settings > Pages > Deploy from branch > `main` / root.
3. Open the published URL.

## Local run
ES modules need http, not file://:
`python -m http.server 8000` then open http://localhost:8000

## AI keys
Open Settings, paste your own free key (Groq, Google Gemini, or OpenRouter). Keys live only in your browser's localStorage and go directly to the provider. Never commit keys.

## Extending content
Edit files in `js/data/` (topics, MCQs, debugging, repos, coding problems).

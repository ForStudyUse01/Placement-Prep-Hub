// Generates small illustrative inline-SVG diagrams for study topics.
// Pure functions returning SVG markup strings — no external chart library needed.

export function renderViz(kind) {
  const fn = { bigO: bigOChart, tree: treeDiagram, bst: bstDiagram, graph: graphDiagram, dp: dpGrid, linkedlist: linkedListDiagram, stack: stackDiagram }[kind];
  return fn ? fn() : "";
}

export function bigOChart() {
  const curves = [
    { label: "O(1)", h: 20, color: "var(--accent-2)" },
    { label: "O(log n)", h: 45, color: "#8fd1ff" },
    { label: "O(n)", h: 90, color: "var(--accent)" },
    { label: "O(n log n)", h: 130, color: "var(--warn)" },
    { label: "O(n²)", h: 175, color: "var(--danger)" }
  ];
  const barW = 60, gap = 24, baseY = 200;
  const bars = curves.map((c, i) => {
    const x = 20 + i * (barW + gap);
    return `<rect class="node" x="${x}" y="${baseY - c.h}" width="${barW}" height="${c.h}" rx="6" fill="${c.color}"/>
      <text x="${x + barW / 2}" y="${baseY + 18}" text-anchor="middle">${c.label}</text>`;
  }).join("");
  return `<svg class="svgviz" viewBox="0 0 ${20 + curves.length * (barW + gap)} 230" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="${baseY}" x2="${curves.length * (barW + gap) + 10}" y2="${baseY}" stroke="var(--border)"/>
    ${bars}
    <text x="10" y="16" font-size="11" fill="var(--text-mute)">Relative growth as input size n increases →</text>
  </svg>`;
}

export function treeDiagram() {
  const nodes = [[150, 30, "8"], [80, 90, "4"], [220, 90, "12"], [40, 150, "2"], [120, 150, "6"], [180, 150, "10"], [260, 150, "14"]];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  return svgTree(nodes, edges, 300, 180);
}
export function bstDiagram() {
  const nodes = [[150, 30, "10"], [80, 90, "5"], [220, 90, "15"], [40, 150, "2"], [120, 150, "7"]];
  const edges = [[0,1],[0,2],[1,3],[1,4]];
  return svgTree(nodes, edges, 300, 180, true);
}
function svgTree(nodes, edges, w, h, bst = false) {
  const edgeSvg = edges.map(([a,b]) => `<line class="edge" x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}"/>`).join("");
  const nodeSvg = nodes.map(([x,y,v]) => `<circle class="node" cx="${x}" cy="${y}" r="18"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="#fff">${v}</text>`).join("");
  const caption = bst ? "Binary Search Tree: left < root < right at every node" : "Binary Tree: level-order shown top to bottom";
  return `<svg class="svgviz" viewBox="0 0 ${w} ${h+30}" xmlns="http://www.w3.org/2000/svg">${edgeSvg}${nodeSvg}
    <text x="10" y="${h+20}" font-size="11" fill="var(--text-mute)">${caption}</text></svg>`;
}

export function graphDiagram() {
  const nodes = { A:[50,40], B:[160,30], C:[260,70], D:[90,130], E:[200,150] };
  const edges = [["A","B"],["A","D"],["B","C"],["B","E"],["D","E"],["C","E"]];
  const edgeSvg = edges.map(([a,b]) => `<line class="edge" x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}"/>`).join("");
  const nodeSvg = Object.entries(nodes).map(([k,[x,y]]) => `<circle class="node" cx="${x}" cy="${y}" r="18"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="#fff">${k}</text>`).join("");
  return `<svg class="svgviz" viewBox="0 0 300 190" xmlns="http://www.w3.org/2000/svg">${edgeSvg}${nodeSvg}
    <text x="10" y="180" font-size="11" fill="var(--text-mute)">Undirected graph — adjacency list / BFS-DFS traversal target</text></svg>`;
}

export function dpGrid() {
  const rows = 4, cols = 5;
  const cell = 42;
  let cells = "";
  const vals = [
    [0,0,0,0,0],
    [0,1,1,1,1],
    [0,1,1,2,2],
    [0,1,2,2,3]
  ];
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      const x = 10 + c*cell, y = 10 + r*cell;
      const filled = r>0 && c>0;
      cells += `<rect x="${x}" y="${y}" width="${cell-4}" height="${cell-4}" rx="6" fill="${filled ? "var(--accent)" : "var(--panel-2)"}" opacity="${filled?0.85:0.6}"/>
      <text x="${x+(cell-4)/2}" y="${y+(cell-4)/2+4}" text-anchor="middle" fill="${filled?'#fff':'var(--text-mute)'}">${vals[r][c]}</text>`;
    }
  }
  return `<svg class="svgviz" viewBox="0 0 ${10+cols*cell+10} ${10+rows*cell+30}" xmlns="http://www.w3.org/2000/svg">${cells}
    <text x="10" y="${10+rows*cell+20}" font-size="11" fill="var(--text-mute)">DP table: each cell built from already-solved neighbors (LCS-style)</text></svg>`;
}

export function linkedListDiagram() {
  const n = 4, gap = 80;
  let out = "";
  for (let i=0;i<n;i++){
    const x = 20 + i*gap;
    out += `<rect class="node" x="${x}" y="60" width="50" height="40" rx="8"/>
      <text x="${x+25}" y="85" text-anchor="middle" fill="#fff">${i+1}</text>`;
    if (i < n-1) out += `<line class="edge" x1="${x+50}" y1="80" x2="${x+gap}" y2="80" marker-end="url(#arrow)"/>`;
  }
  out += `<text x="${20+(n-1)*gap+55}" y="85" fill="var(--text-mute)">null</text>`;
  return `<svg class="svgviz" viewBox="0 0 ${20+n*gap+40} 120" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--text-mute)"/></marker></defs>
    ${out}<text x="10" y="110" font-size="11" fill="var(--text-mute)">Singly linked list: each node points to the next</text></svg>`;
}

export function stackDiagram() {
  const items = ["(", "[", "("];
  let out = "";
  items.forEach((v, i) => {
    const y = 140 - i*35;
    out += `<rect class="node" x="40" y="${y}" width="80" height="30" rx="6"/><text x="80" y="${y+20}" text-anchor="middle" fill="#fff">${v}</text>`;
  });
  return `<svg class="svgviz" viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg">
    ${out}
    <line x1="30" y1="170" x2="150" y2="170" stroke="var(--border)"/>
    <text x="140" y="60" font-size="11" fill="var(--text-mute)">← top of stack</text>
    <text x="10" y="170" font-size="11" fill="var(--text-mute)">base</text></svg>`;
}

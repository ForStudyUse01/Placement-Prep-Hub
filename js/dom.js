// Tiny DOM helper. All markup in this app is authored by us (static template
// strings in the js/data and js/features files) — never raw third-party or
// user-typed content. User-typed text (answers, prompts, API keys) is always
// inserted via escapeHtml()/textContent, never concatenated into a template.
// renderHTML uses DOMParser (not element.innerHTML) to build nodes, then
// moves them into the target container.
export function renderHTML(container, htmlString) {
  const doc = new DOMParser().parseFromString(String(htmlString), "text/html");
  container.replaceChildren(...doc.body.childNodes);
}

// Escapes user-supplied text before it is interpolated into a template string.
export function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function qs(root, sel) {
  return root.querySelector(sel);
}
export function qsa(root, sel) {
  return Array.from(root.querySelectorAll(sel));
}

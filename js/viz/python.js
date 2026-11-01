import { stepper, trace, cells, code, vars, esc, renderHTML } from "./core.js";

const $ = (host, s) => host.querySelector(s);

export const varsTrace = {
  title: "Types and division: trace the values",
  mount(host) {
    const L = ["x = 7", "y = 2", "a = x / y", "b = x // y", "c = int(a)", "d = '5' + '5'", "e = int('3.5')"];
    trace(host, L, [
      { line: 0, vars: { x: "7 (int)" }, note: "x is an int." },
      { line: 1, vars: { x: "7 (int)", y: "2 (int)" }, note: "y is an int." },
      { line: 2, vars: { x: 7, y: 2, a: "3.5 (float)" }, note: "Python 3: / always gives a float. In C, C++ and Java, 7 / 2 on ints is 3 (integer division)." },
      { line: 3, vars: { x: 7, y: 2, a: 3.5, b: "3 (int)" }, note: "// is floor division." },
      { line: 4, vars: { x: 7, y: 2, a: 3.5, b: 3, c: "3 (int)" }, note: "int() truncates toward zero, it does not round." },
      { line: 5, vars: { a: 3.5, b: 3, c: 3, d: "'55' (str)" }, note: "+ on two strings concatenates. It does not add." },
      { line: 6, vars: { d: "'55'" }, out: "ValueError: invalid literal for int() with base 10: '3.5'", note: "Right type, invalid value: ValueError. Use float('3.5') first." }
    ]);
  }
};

export const precedence = {
  title: "Operator precedence: evaluation order",
  mount(host) {
    const steps = [
      ["2 + 3 * 4 ** 2 > 20 and not False", "Start. Highest precedence first: ** then * then + then comparison then not then and."],
      ["2 + 3 * 16 > 20 and not False", "4 ** 2 = 16 (exponent binds tightest)."],
      ["2 + 48 > 20 and not False", "3 * 16 = 48."],
      ["50 > 20 and not False", "2 + 48 = 50."],
      ["True and not False", "50 > 20 is True (comparison binds tighter than and)."],
      ["True and True", "not False = True."],
      ["True", "True and True = True."]
    ].map(([e, note]) => ({ e, note }));
    stepper(host, steps, (x) => `<pre class="vcode"><div class="hl" style="font-size:16px;padding:8px 14px">${esc(x.e)}</div></pre>`, { speed: 1200 });
  }
};

export const loopsTrace = {
  title: "Nested loops with continue",
  mount(host) {
    const L = ["for i in range(3):", "    for j in range(3):", "        if j == 1:", "            continue", "        print(i, j)"];
    const steps = [], out = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      steps.push({ line: 1, vars: { i, j }, out: out.join("\n"), note: `Inner loop: j = ${j}` });
      steps.push({ line: 2, vars: { i, j }, out: out.join("\n"), note: `j == 1 ? ${j === 1}` });
      if (j === 1) steps.push({ line: 3, vars: { i, j }, out: out.join("\n"), note: "continue skips the rest of the INNER loop body only. The outer loop keeps going." });
      else { out.push(`${i} ${j}`); steps.push({ line: 4, vars: { i, j }, out: out.join("\n"), note: `print(${i}, ${j})` }); }
    }
    trace(host, L, steps, { speed: 450 });
  }
};

export const callStack = {
  title: "Recursion: the call stack",
  mount(host) {
    const f = [], stack = [];
    const snap = (note) => f.push({ s: stack.map((x) => ({ ...x })), note });
    const fact = (n) => {
      const fr = { label: `factorial(${n})`, ret: null }; stack.push(fr);
      snap(`Call factorial(${n}). A new frame is pushed.`);
      let r;
      if (n <= 1) { r = 1; fr.ret = 1; snap("Base case n <= 1 returns 1. Without it, the stack grows forever (RecursionError)."); }
      else { const sub = fact(n - 1); r = n * sub; fr.ret = r; snap(`factorial(${n}) = ${n} * ${sub} = ${r}. Return and pop.`); }
      stack.pop();
      return r;
    };
    fact(4);
    f.push({ s: [], note: "Stack is empty. Final answer: 24." });
    stepper(host, f, (x) => `<div class="vstack">${[...x.s].reverse().map((fr, i) => `<div class="vframe ${i === 0 ? "top" : ""}">${esc(fr.label)}${fr.ret !== null ? ` → ${fr.ret}` : ""}</div>`).join("") || '<div class="muted">empty</div>'}</div>`, { speed: 700 });
  }
};

export const scopeTrace = {
  title: "Local vs global scope",
  mount(host) {
    const L = ["x = 1", "def f():", "    x = 2", "    print('inside', x)", "f()", "print('outside', x)"];
    trace(host, L, [
      { line: 0, vars: { "global x": 1 }, note: "Global x is created." },
      { line: 4, vars: { "global x": 1 }, note: "Call f()." },
      { line: 2, vars: { "global x": 1, "local x (in f)": 2 }, note: "Assignment inside a function creates a NEW local x. It does not change the global one." },
      { line: 3, vars: { "global x": 1, "local x (in f)": 2 }, out: "inside 2", note: "Local x is read." },
      { line: 5, vars: { "global x": 1 }, out: "inside 2\noutside 1", note: "f returned, local x is gone. Global x is still 1. Use `global x` to reassign it." }
    ]);
  }
};

export const mutableDefault = {
  title: "Mutable default argument bug",
  mount(host) {
    const L = ["def add_item(item, bucket=[]):", "    bucket.append(item)", "    return bucket", "add_item(1)", "add_item(2)"];
    const box = (items, label, bad) => `<div class="vcell ${bad ? "bad" : "done"}" style="margin:4px 0">${esc(label)} = [${items.join(", ")}]</div>`;
    stepper(host, [
      { line: 0, d: "[]", note: "When `def` runs, Python creates ONE list for the default and stores it on the function." },
      { line: 3, d: "[1]", call: "add_item(1) -> [1]", note: "No bucket passed, so the shared default list is used and gets 1." },
      { line: 4, d: "[1, 2]", call: "add_item(2) -> [1, 2]", bad: true, note: "Expected [2], got [1, 2]. The same list is reused on every call. Fix: bucket=None, then create a new list inside." }
    ], (x) => code(L, [x.line]) + box(x.d === "[]" ? [] : x.d.slice(1, -1).split(", "), "function default (one shared object)", x.bad) + (x.call ? `<div class="vout">${esc(x.call)}</div>` : ""), { speed: 1300 });
  }
};

function pySlice(n, start, stop, step) {
  step = step === null ? 1 : step;
  if (step === 0) return null;
  const idx = [];
  const norm = (v, lo, hi) => { if (v < 0) v += n; return Math.min(Math.max(v, lo), hi); };
  if (step > 0) {
    let s = start === null ? 0 : norm(start, 0, n), e = stop === null ? n : norm(stop, 0, n);
    for (let i = s; i < e; i += step) idx.push(i);
  } else {
    let s = start === null ? n - 1 : norm(start, -1, n - 1), e = stop === null ? -1 : norm(stop, -1, n - 1);
    for (let i = s; i > e; i += step) idx.push(i);
  }
  return idx;
}
export const slicing = {
  title: "Slicing explorer: a[start:stop:step]",
  mount(host) {
    renderHTML(host, `<div class="vrow"><label>start <input type="text" id="a" value="1" style="width:60px"></label><label>stop <input type="text" id="b" value="5" style="width:60px"></label><label>step <input type="text" id="c" value="2" style="width:60px"></label><span class="muted">Leave blank for default. Negatives allowed.</span></div><div class="stage"></div><p class="vnote"></p>`);
    const arr = [10, 20, 30, 40, 50, 60, 70];
    const parse = (id) => { const t = $(host, id).value.trim(); return t === "" ? null : Number.isNaN(Number(t)) ? undefined : Number(t); };
    const paint = () => {
      const a = parse("#a"), b = parse("#b"), c = parse("#c");
      if ([a, b, c].includes(undefined)) { $(host, ".vnote").textContent = "Enter whole numbers or leave blank."; return; }
      const idx = pySlice(arr.length, a, b, c);
      if (!idx) { $(host, ".vnote").textContent = "ValueError: slice step cannot be zero."; return; }
      const hi = Object.fromEntries(idx.map((i) => [i, "on"]));
      renderHTML($(host, ".stage"), cells(arr, { hi, neg: true }));
      $(host, ".vnote").textContent = `a[${a ?? ""}:${b ?? ""}:${c ?? ""}] = [${idx.map((i) => arr[i]).join(", ")}]   The stop index is exclusive.`;
    };
    host.querySelectorAll("input").forEach((e) => e.addEventListener("input", paint));
    paint();
  }
};

export const copyDemo = {
  title: "Shallow copy vs deep copy",
  mount(host) {
    const L = ["a = [[1, 2], [3]]", "b = a.copy()", "b[0].append(9)", "print(a)"];
    trace(host, L, [
      { line: 0, vars: { a: "[[1, 2], [3]]" }, note: "a holds two inner lists." },
      { line: 1, vars: { a: "[[1, 2], [3]]", b: "[[1, 2], [3]]" }, extra: `<div class="vout">a[0] and b[0] are the SAME inner list object</div>`, note: "A shallow copy duplicates only the outer list. Inner lists are shared." },
      { line: 2, vars: { a: "[[1, 2, 9], [3]]", b: "[[1, 2, 9], [3]]" }, note: "Appending through b changes the inner list that a also points to." },
      { line: 3, vars: { a: "[[1, 2, 9], [3]]" }, out: "[[1, 2, 9], [3]]", note: "a changed unexpectedly. Use copy.deepcopy(a) for fully independent data." }
    ]);
  }
};

export const comprehension = {
  title: "List comprehension, one item at a time",
  mount(host) {
    const L = ["squares = [x*x for x in range(10) if x % 2 == 0]"];
    const f = [], out = [];
    for (let x = 0; x < 10; x++) {
      const ok = x % 2 === 0;
      if (ok) out.push(x * x);
      f.push({ vars: { x, "x % 2 == 0": ok, squares: `[${out.join(", ")}]` }, note: ok ? `${x} passes the filter: append ${x}*${x} = ${x * x}.` : `${x} fails the filter: skipped.` });
    }
    stepper(host, f, (x) => code(L, [0]) + vars(x.vars), { speed: 550 });
  }
};

export const lateBinding = {
  title: "Lambda late-binding trap",
  mount(host) {
    const L = ["fns = [lambda: i for i in range(3)]", "[f() for f in fns]", "", "# fix", "fns = [lambda i=i: i for i in range(3)]"];
    stepper(host, [
      { line: 0, v: { i: "0, 1, 2 (loop ends at 2)" }, note: "Three lambdas are created. Each one captures the VARIABLE i, not its value at that moment." },
      { line: 1, v: { "f() results": "[2, 2, 2]" }, out: "[2, 2, 2]", note: "When called later, every lambda reads the final i = 2." },
      { line: 4, v: { "f() results": "[0, 1, 2]" }, out: "[0, 1, 2]", note: "Default argument i=i freezes the value at creation time." }
    ], (x) => code(L, [x.line]) + vars(x.v) + (x.out ? `<div class="vout">${esc(x.out)}</div>` : ""), { speed: 1400 });
  }
};

export const argsBinder = {
  title: "How a call binds to f(a, b=10, *args, **kwargs)",
  mount(host) {
    const calls = [
      ["f(1)", { a: "1", b: "10 (default)", args: "()", kwargs: "{}" }],
      ["f(1, 2, 3, 4, x=5)", { a: "1", b: "2", args: "(3, 4)", kwargs: "{'x': 5}" }],
      ["f(1, b=7)", { a: "1", b: "7 (keyword)", args: "()", kwargs: "{}" }],
      ["f(1, 2, 3, y=1, z=2)", { a: "1", b: "2", args: "(3,)", kwargs: "{'y': 1, 'z': 2}" }],
      ["f(b=2)", null]
    ];
    renderHTML(host, `<div class="vrow"><label>Call</label><select>${calls.map((c, i) => `<option value="${i}">${esc(c[0])}</option>`).join("")}</select></div><div class="stage"></div>`);
    const paint = () => {
      const [call, b] = calls[Number($(host, "select").value)];
      renderHTML($(host, ".stage"), `<pre class="vcode"><div>def f(a, b=10, *args, **kwargs): ...</div><div class="hl">${esc(call)}</div></pre>` + (b ? vars(b) : `<div class="vout" style="border-color:var(--danger)">TypeError: f() missing 1 required positional argument: 'a'</div>`));
    };
    $(host, "select").addEventListener("change", paint);
    paint();
  }
};

export const exceptionFlow = {
  title: "try / except / else / finally: which blocks run?",
  mount(host) {
    renderHTML(host, `<div class="vrow"><label>Scenario</label><select><option value="0">No error</option><option value="1">KeyError, caught</option><option value="2">ZeroDivisionError, not caught</option></select></div><div class="sub"></div>`);
    const names = ["try", "except KeyError", "else", "finally"];
    const S = {
      0: [[["on", "", "", ""], "try block starts and runs without raising."], [["done", "skip", "on", ""], "No exception: except is skipped, else runs."], [["done", "skip", "done", "on"], "finally always runs."]],
      1: [[["on", "", "", ""], "try block starts."], [["bad", "", "", ""], "A KeyError is raised inside try."], [["bad", "on", "skip", ""], "Matching except block handles it. else is skipped."], [["bad", "done", "skip", "on"], "finally runs, then the program continues normally."]],
      2: [[["on", "", "", ""], "try block starts."], [["bad", "", "", ""], "ZeroDivisionError is raised."], [["bad", "skip", "skip", ""], "except KeyError does not match this error type."], [["bad", "skip", "skip", "on"], "finally still runs, then the error propagates and the program crashes. Catch the specific error you expect."]]
    };
    const load = () => {
      const frames = S[$(host, "select").value].map(([st, note]) => ({ st, note }));
      stepper($(host, ".sub"), frames, (x) => `<div class="vflow">${names.map((n, i) => `<div class="vstep ${x.st[i] === "on" ? "on" : x.st[i] === "done" ? "done" : ""}" style="${x.st[i] === "bad" ? "border-color:var(--danger);background:color-mix(in srgb,var(--danger) 18%,transparent)" : x.st[i] === "skip" ? "opacity:.35" : ""}">${n}</div>`).join("")}</div>`, { speed: 1100 });
    };
    $(host, "select").addEventListener("change", load);
    load();
  }
};

export const generatorTrace = {
  title: "Generator: pause and resume at yield",
  mount(host) {
    const L = ["def countdown(n):", "    while n > 0:", "        yield n", "        n -= 1", "g = countdown(3)", "next(g)", "next(g)", "next(g)", "next(g)"];
    trace(host, L, [
      { line: 4, vars: { g: "<generator, not started>" }, note: "Calling the function runs NO code yet. It only creates a generator object." },
      { line: 2, vars: { n: 3 }, out: "next(g) -> 3", note: "First next(): runs up to yield, hands back 3, then PAUSES with state kept." },
      { line: 2, vars: { n: 2 }, out: "next(g) -> 3\nnext(g) -> 2", note: "Resumes after yield: n -= 1, loops, yields 2." },
      { line: 2, vars: { n: 1 }, out: "next(g) -> 3\nnext(g) -> 2\nnext(g) -> 1", note: "Same again: yields 1." },
      { line: 1, vars: { n: 0 }, out: "...\nStopIteration", note: "n is 0, loop ends, function returns: StopIteration. A for-loop handles this for you. Only one value lives in memory at a time." }
    ]);
  }
};

export const errorExplorer = {
  title: "Which error is it?",
  mount(host) {
    const items = [
      ["a = [1, 2, 3]\nprint(a[3])", "IndexError", "list index out of range. Valid indices are 0..2."],
      ["d = {'a': 1}\nprint(d['b'])", "KeyError", "Key missing. Use d.get('b', default)."],
      ["print('2' + 2)", "TypeError", "Cannot add str and int."],
      ["int('abc')", "ValueError", "Right type, invalid value."],
      ["print(total)", "NameError", "Variable was never defined (or typo)."],
      ["x = None\nx.append(1)", "AttributeError", "None has no append. A function probably returned None."],
      ["print(10 / 0)", "ZeroDivisionError", "Check the denominator."],
      ["def f(:\n    pass", "SyntaxError", "Code does not parse, so nothing runs."],
      ["total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)   # expected 15", "Logical error", "No error message, wrong answer: range(1, 5) stops at 4. Needs range(1, 6)."]
    ];
    renderHTML(host, `<p class="muted" style="margin-top:0">Pick a snippet, guess the error, then reveal.</p><div class="vrow"><select>${items.map((x, i) => `<option value="${i}">Snippet ${i + 1}</option>`).join("")}</select><button class="btn">Reveal</button></div><div class="stage"></div>`);
    const paint = (reveal) => {
      const [c, e, why] = items[Number($(host, "select").value)];
      renderHTML($(host, ".stage"), `<pre class="vcode" style="white-space:pre"></pre>${reveal ? `<div class="vout" style="border-color:var(--danger)"><b>${esc(e)}</b>: ${esc(why)}</div>` : ""}`);
      $(host, ".stage pre").textContent = c;
    };
    $(host, "select").addEventListener("change", () => paint(false));
    $(host, ".btn").addEventListener("click", () => paint(true));
    paint(false);
  }
};

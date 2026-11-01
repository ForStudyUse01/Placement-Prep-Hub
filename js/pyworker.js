// Runs Python in a WebAssembly runtime (Pyodide) inside a Web Worker, so user code
// is isolated from the page (no DOM, no localStorage) and can be killed on timeout.
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

let py = null;
const ready = loadPyodide().then((p) => { py = p; postMessage({ type: "ready" }); });

const HARNESS = `
import json as _json
_out = []
_cases = _json.loads(_cases_json)
_target = globals().get(_fn)
if _target is None:
    _out = [{"err": "Name '%s' not found. Define it with exactly that name." % _fn} for _ in _cases]
else:
    for _c in _cases:
        try:
            if _kind == "lru":
                _o = _target(_c["args"][0])
                _r = []
                for _op in _c["args"][1]:
                    if _op[0] == "put":
                        _o.put(_op[1], _op[2])
                    else:
                        _r.append(_o.get(_op[1]))
            else:
                _r = _target(*_c["args"])
            _out.append({"got": _json.dumps(_r)})
        except BaseException as _e:
            _out.append({"err": type(_e).__name__ + ": " + str(_e)})
_json.dumps(_out)
`;

const STDIO_SETUP = ["import sys, io", "sys.stdin = io.StringIO(_stdin)", "sys.stdout = io.StringIO()"].join("\n");

onmessage = async (e) => {
  await ready;

  if (e.data.mode === "stdio") {
    // Whole-program mode: feed stdin, capture stdout.
    const ns = py.globals.get("dict")();
    ns.set("_stdin", e.data.stdin);
    py.runPython(STDIO_SETUP, { globals: ns });
    let err = null;
    try {
      await py.runPythonAsync(e.data.code, { globals: ns });
    } catch (ex) {
      err = String((ex && ex.message) || ex).split("\n").filter(Boolean).slice(-2).join(" | ");
    }
    const out = py.runPython("sys.stdout.getvalue()", { globals: ns });
    py.runPython("sys.stdout = sys.__stdout__", { globals: ns });
    postMessage({ type: "stdio", out, err });
    return;
  }

  const { code, fn, cases, kind } = e.data;
  try {
    const ns = py.globals.get("dict")();
    ns.set("_cases_json", JSON.stringify(cases));
    ns.set("_fn", fn);
    ns.set("_kind", kind || "");
    const out = await py.runPythonAsync(code + "\n\n" + HARNESS, { globals: ns });
    postMessage({ type: "result", out });
  } catch (err) {
    postMessage({ type: "error", message: String((err && err.message) || err) });
  }
};

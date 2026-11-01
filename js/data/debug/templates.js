// Program templates. Every problem is a complete stdin/stdout program:
//   first token T = number of cases, then each case's tokens by `kind`:
//   int: n | ints: n a1..an | kints: k n a1..an | str: s | str2: s t
// The learner debugs the solve() function; the surrounding I/O code is correct.
export const KINDS = {
  int: "one integer n",
  ints: "n, then n integers",
  kints: "k, then n, then n integers",
  str: "one string (no spaces)",
  str2: "two strings (no spaces)"
};

const READ = {
  py: {
    int: ["n = int(next(it))", "solve(n)"],
    ints: ["n = int(next(it))\n        a = [int(next(it)) for _ in range(n)]", "solve(a)"],
    kints: ["k = int(next(it))\n        n = int(next(it))\n        a = [int(next(it)) for _ in range(n)]", "solve(k, a)"],
    str: ["s = next(it)", "solve(s)"],
    str2: ["s = next(it)\n        t = next(it)", "solve(s, t)"]
  },
  js: {
    int: ["const n = parseInt(next());", "solve(n)"],
    ints: ["const n = parseInt(next());\n  const a = [];\n  for (let i = 0; i < n; i++) a.push(parseInt(next()));", "solve(a)"],
    kints: ["const k = parseInt(next());\n  const n = parseInt(next());\n  const a = [];\n  for (let i = 0; i < n; i++) a.push(parseInt(next()));", "solve(k, a)"],
    str: ["const s = next();", "solve(s)"],
    str2: ["const s = next();\n  const t = next();", "solve(s, t)"]
  },
  c: {
    int: ["int n;\n        scanf(\"%d\", &n);", "solve(n)"],
    ints: ["int n;\n        scanf(\"%d\", &n);\n        int a[1005];\n        for (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);", "solve(a, n)"],
    kints: ["int k, n;\n        scanf(\"%d %d\", &k, &n);\n        int a[1005];\n        for (int i = 0; i < n; i++) scanf(\"%d\", &a[i]);", "solve(k, a, n)"],
    str: ["char s[1005];\n        scanf(\"%s\", s);", "solve(s)"],
    str2: ["char s[1005], t[1005];\n        scanf(\"%s %s\", s, t);", "solve(s, t)"]
  },
  cpp: {
    int: ["int n;\n        cin >> n;", "solve(n)"],
    ints: ["int n;\n        cin >> n;\n        vector<int> a(n);\n        for (int i = 0; i < n; i++) cin >> a[i];", "solve(a)"],
    kints: ["int k, n;\n        cin >> k >> n;\n        vector<int> a(n);\n        for (int i = 0; i < n; i++) cin >> a[i];", "solve(k, a)"],
    str: ["string s;\n        cin >> s;", "solve(s)"],
    str2: ["string s, t;\n        cin >> s >> t;", "solve(s, t)"]
  },
  java: {
    int: ["int n = sc.nextInt();", "solve(n)"],
    ints: ["int n = sc.nextInt();\n            int[] a = new int[n];\n            for (int i = 0; i < n; i++) a[i] = sc.nextInt();", "solve(a)"],
    kints: ["int k = sc.nextInt();\n            int n = sc.nextInt();\n            int[] a = new int[n];\n            for (int i = 0; i < n; i++) a[i] = sc.nextInt();", "solve(k, a)"],
    str: ["String s = sc.next();", "solve(s)"],
    str2: ["String s = sc.next();\n            String t = sc.next();", "solve(s, t)"]
  }
};

const indent = (s, pad) => s.split("\n").map((l) => (l ? pad + l : l)).join("\n");

export function assemble(lang, kind, solveCode) {
  const [read, call] = READ[lang][kind];
  switch (lang) {
    case "py":
      return `import sys\n\n${solveCode}\n\n\ndef main():\n    it = iter(sys.stdin.read().split())\n    for _ in range(int(next(it))):\n        ${read}\n        print(${call})\n\n\nmain()\n`;
    case "js":
      return `const tokens = readAll().split(/\\s+/).filter(Boolean);\nlet pos = 0;\nconst next = () => tokens[pos++];\n\n${solveCode}\n\nconst T = parseInt(next());\nfor (let c = 0; c < T; c++) {\n  ${read}\n  console.log(String(${call}));\n}\n`;
    case "c":
      return `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n${solveCode}\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        ${read}\n        printf("%d\\n", ${call});\n    }\n    return 0;\n}\n`;
    case "cpp":
      return `#include <bits/stdc++.h>\nusing namespace std;\n\n${solveCode}\n\nint main() {\n    int T;\n    cin >> T;\n    while (T--) {\n        ${read}\n        cout << ${call} << "\\n";\n    }\n    return 0;\n}\n`;
    case "java":
      return `import java.util.*;\n\npublic class Main {\n${indent(solveCode, "    ")}\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int T = sc.nextInt();\n        while (T-- > 0) {\n            ${read}\n            System.out.println(${call});\n        }\n    }\n}\n`;
    default:
      throw new Error("bad lang " + lang);
  }
}

export const LANG_LABEL = { py: "Python", js: "JavaScript", c: "C", cpp: "C++", java: "Java" };

// Batch 1: Arrays. Row shape: lang: [fixedSolveCode, [[from, to], ...bug replacements]]
const L = (code, ...pairs) => [code, pairs];

export const BATCH1 = [
  {
    id: "d001", title: "Sum of Array", topic: "Arrays", level: "Easy", kind: "ints",
    statement: "Given an array of integers, print the sum of all its elements.",
    cases: ["5 1 2 3 4 5", "3 -1 -2 -3", "0", "1 7"], hidden: ["4 10 -10 5 5", "2 100 200"],
    bug: { type: "syntax", note: "A missing token makes the program fail to compile or parse." },
    py: L(`def solve(a):
    total = 0
    for x in a:
        total += x
    return total`, ["for x in a:", "for x in a"]),
    js: L(`function solve(a) {
  let total = 0;
  for (const x of a) {
    total += x;
  }
  return total;
}`, ["for (const x of a) {", "for (const x of a {"]),
    c: L(`int solve(int a[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        total += a[i];
    }
    return total;
}`, ["total += a[i];", "total += a[i]"]),
    cpp: L(`int solve(vector<int>& a) {
    int total = 0;
    for (int x : a) {
        total += x;
    }
    return total;
}`, ["total += x;", "total += x"]),
    java: L(`static int solve(int[] a) {
    int total = 0;
    for (int x : a) {
        total += x;
    }
    return total;
}`, ["total += x;", "total += x"])
  },
  {
    id: "d002", title: "Maximum Element", topic: "Arrays", level: "Easy", kind: "ints",
    statement: "Given a non-empty array of integers, print its largest element. Values may be negative.",
    cases: ["5 3 9 2 7 1", "3 -5 -2 -9", "1 4"], hidden: ["4 -1 -1 -1 -1", "6 0 0 5 0 0 0"],
    bug: { type: "logic", note: "Wrong starting value for the running maximum." },
    py: L(`def solve(a):
    best = a[0]
    for x in a:
        if x > best:
            best = x
    return best`, ["best = a[0]", "best = 0"]),
    js: L(`function solve(a) {
  let best = a[0];
  for (const x of a) {
    if (x > best) best = x;
  }
  return best;
}`, ["let best = a[0];", "let best = 0;"]),
    c: L(`int solve(int a[], int n) {
    int best = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] > best) best = a[i];
    }
    return best;
}`, ["int best = a[0];", "int best = 0;"]),
    cpp: L(`int solve(vector<int>& a) {
    int best = a[0];
    for (int x : a) {
        if (x > best) best = x;
    }
    return best;
}`, ["int best = a[0];", "int best = 0;"]),
    java: L(`static int solve(int[] a) {
    int best = a[0];
    for (int x : a) {
        if (x > best) best = x;
    }
    return best;
}`, ["int best = a[0];", "int best = 0;"])
  },
  {
    id: "d003", title: "Second Largest Distinct", topic: "Arrays", level: "Medium", kind: "ints",
    statement: "Given an array of non-negative integers, print the second largest DISTINCT value. If there is none, print -1.",
    cases: ["6 4 9 9 2 7 7", "2 5 5", "3 1 2 3"], hidden: ["1 8", "4 3 3 3 2"],
    bug: { type: "logic", note: "Duplicates of the maximum are being counted as the second largest." },
    py: L(`def solve(a):
    first = -1
    second = -1
    for x in a:
        if x > first:
            second = first
            first = x
        elif x < first and x > second:
            second = x
    return second`, ["elif x < first and x > second:", "elif x > second:"]),
    js: L(`function solve(a) {
  let first = -1;
  let second = -1;
  for (const x of a) {
    if (x > first) {
      second = first;
      first = x;
    } else if (x < first && x > second) {
      second = x;
    }
  }
  return second;
}`, ["else if (x < first && x > second) {", "else if (x > second) {"]),
    c: L(`int solve(int a[], int n) {
    int first = -1, second = -1;
    for (int i = 0; i < n; i++) {
        int x = a[i];
        if (x > first) {
            second = first;
            first = x;
        } else if (x < first && x > second) {
            second = x;
        }
    }
    return second;
}`, ["else if (x < first && x > second) {", "else if (x > second) {"]),
    cpp: L(`int solve(vector<int>& a) {
    int first = -1, second = -1;
    for (int x : a) {
        if (x > first) {
            second = first;
            first = x;
        } else if (x < first && x > second) {
            second = x;
        }
    }
    return second;
}`, ["else if (x < first && x > second) {", "else if (x > second) {"]),
    java: L(`static int solve(int[] a) {
    int first = -1, second = -1;
    for (int x : a) {
        if (x > first) {
            second = first;
            first = x;
        } else if (x < first && x > second) {
            second = x;
        }
    }
    return second;
}`, ["else if (x < first && x > second) {", "else if (x > second) {"])
  },
  {
    id: "d004", title: "Count Even Numbers", topic: "Arrays", level: "Easy", kind: "ints",
    statement: "Given an array of integers, print how many of them are even (zero counts as even).",
    cases: ["5 1 2 3 4 6", "3 1 3 5", "0"], hidden: ["4 -2 -4 7 0", "2 0 0"],
    bug: { type: "logic", note: "The parity test is inverted." },
    py: L(`def solve(a):
    count = 0
    for x in a:
        if x % 2 == 0:
            count += 1
    return count`, ["x % 2 == 0", "x % 2 == 1"]),
    js: L(`function solve(a) {
  let count = 0;
  for (const x of a) {
    if (x % 2 === 0) count++;
  }
  return count;
}`, ["x % 2 === 0", "x % 2 === 1"]),
    c: L(`int solve(int a[], int n) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] % 2 == 0) count++;
    }
    return count;
}`, ["a[i] % 2 == 0", "a[i] % 2 == 1"]),
    cpp: L(`int solve(vector<int>& a) {
    int count = 0;
    for (int x : a) {
        if (x % 2 == 0) count++;
    }
    return count;
}`, ["x % 2 == 0", "x % 2 == 1"]),
    java: L(`static int solve(int[] a) {
    int count = 0;
    for (int x : a) {
        if (x % 2 == 0) count++;
    }
    return count;
}`, ["x % 2 == 0", "x % 2 == 1"])
  },
  {
    id: "d005", title: "Index of First Maximum", topic: "Arrays", level: "Easy", kind: "ints",
    statement: "Given a non-empty array, print the index (0-based) of the FIRST occurrence of its maximum value.",
    cases: ["5 3 9 2 9 1", "3 5 1 2", "1 7"], hidden: ["4 2 2 2 2", "5 1 2 3 4 5"],
    bug: { type: "logic", note: "Ties move the index to the last maximum." },
    py: L(`def solve(a):
    idx = 0
    for i in range(len(a)):
        if a[i] > a[idx]:
            idx = i
    return idx`, ["a[i] > a[idx]", "a[i] >= a[idx]"]),
    js: L(`function solve(a) {
  let idx = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] > a[idx]) idx = i;
  }
  return idx;
}`, ["a[i] > a[idx]", "a[i] >= a[idx]"]),
    c: L(`int solve(int a[], int n) {
    int idx = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] > a[idx]) idx = i;
    }
    return idx;
}`, ["a[i] > a[idx]", "a[i] >= a[idx]"]),
    cpp: L(`int solve(vector<int>& a) {
    int idx = 0;
    for (int i = 0; i < (int)a.size(); i++) {
        if (a[i] > a[idx]) idx = i;
    }
    return idx;
}`, ["a[i] > a[idx]", "a[i] >= a[idx]"]),
    java: L(`static int solve(int[] a) {
    int idx = 0;
    for (int i = 0; i < a.length; i++) {
        if (a[i] > a[idx]) idx = i;
    }
    return idx;
}`, ["a[i] > a[idx]", "a[i] >= a[idx]"])
  },
  {
    id: "d006", title: "Linear Search", topic: "Arrays", level: "Easy", kind: "kints",
    statement: "Given k and an array, print the index of the first occurrence of k in the array, or -1 if it is absent.",
    cases: ["7 5 1 7 3 9 7", "4 3 1 2 3", "9 4 1 2 3 9"], hidden: ["5 0", "1 1 1"],
    bug: { type: "logic", note: "The loop stops one element early." },
    py: L(`def solve(k, a):
    for i in range(len(a)):
        if a[i] == k:
            return i
    return -1`, ["range(len(a))", "range(len(a) - 1)"]),
    js: L(`function solve(k, a) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === k) return i;
  }
  return -1;
}`, ["i < a.length;", "i < a.length - 1;"]),
    c: L(`int solve(int k, int a[], int n) {
    for (int i = 0; i < n; i++) {
        if (a[i] == k) return i;
    }
    return -1;
}`, ["i < n;", "i < n - 1;"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    for (int i = 0; i < (int)a.size(); i++) {
        if (a[i] == k) return i;
    }
    return -1;
}`, ["i < (int)a.size();", "i < (int)a.size() - 1;"]),
    java: L(`static int solve(int k, int[] a) {
    for (int i = 0; i < a.length; i++) {
        if (a[i] == k) return i;
    }
    return -1;
}`, ["i < a.length;", "i < a.length - 1;"])
  },
  {
    id: "d007", title: "Count Occurrences of k", topic: "Arrays", level: "Easy", kind: "kints",
    statement: "Given k and an array, print how many times k appears in the array.",
    cases: ["2 6 1 2 2 3 2 5", "9 3 1 2 3", "1 4 1 1 1 1"], hidden: ["0 0", "5 3 5 5 4"],
    bug: { type: "logic", note: "The comparison counts values that are not equal to k." },
    py: L(`def solve(k, a):
    count = 0
    for x in a:
        if x == k:
            count += 1
    return count`, ["if x == k:", "if x >= k:"]),
    js: L(`function solve(k, a) {
  let count = 0;
  for (const x of a) {
    if (x === k) count++;
  }
  return count;
}`, ["if (x === k)", "if (x >= k)"]),
    c: L(`int solve(int k, int a[], int n) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] == k) count++;
    }
    return count;
}`, ["if (a[i] == k)", "if (a[i] >= k)"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int count = 0;
    for (int x : a) {
        if (x == k) count++;
    }
    return count;
}`, ["if (x == k)", "if (x >= k)"]),
    java: L(`static int solve(int k, int[] a) {
    int count = 0;
    for (int x : a) {
        if (x == k) count++;
    }
    return count;
}`, ["if (x == k)", "if (x >= k)"])
  },
  {
    id: "d008", title: "Sum of First k Elements", topic: "Arrays", level: "Easy", kind: "kints",
    statement: "Given k and an array with k <= n, print the sum of the first k elements.",
    cases: ["3 5 1 2 3 4 5", "5 5 1 2 3 4 5", "0 3 9 9 9"], hidden: ["1 4 10 20 30 40", "2 2 -1 -1"],
    bug: { type: "logic", note: "Off-by-one: one element too many is added." },
    py: L(`def solve(k, a):
    total = 0
    for i in range(k):
        total += a[i]
    return total`, ["range(k)", "range(k + 1)"]),
    js: L(`function solve(k, a) {
  let total = 0;
  for (let i = 0; i < k; i++) {
    total += a[i];
  }
  return total;
}`, ["i < k;", "i <= k;"]),
    c: L(`int solve(int k, int a[], int n) {
    int total = 0;
    for (int i = 0; i < k; i++) {
        total += a[i];
    }
    return total;
}`, ["i < k;", "i <= k;"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int total = 0;
    for (int i = 0; i < k; i++) {
        total += a[i];
    }
    return total;
}`, ["i < k;", "i <= k;"]),
    java: L(`static int solve(int k, int[] a) {
    int total = 0;
    for (int i = 0; i < k; i++) {
        total += a[i];
    }
    return total;
}`, ["i < k;", "i <= k;"])
  },
  {
    id: "d009", title: "Is the Array Sorted?", topic: "Arrays", level: "Easy", kind: "ints",
    statement: "Print 1 if the array is sorted in non-decreasing order (equal neighbours are allowed), otherwise print 0. An empty array is sorted.",
    cases: ["5 1 2 2 3 4", "3 3 2 1", "1 5"], hidden: ["0", "4 1 1 1 1"],
    bug: { type: "logic", note: "Equal neighbours are wrongly treated as out of order." },
    py: L(`def solve(a):
    for i in range(1, len(a)):
        if a[i] < a[i - 1]:
            return 0
    return 1`, ["a[i] < a[i - 1]", "a[i] <= a[i - 1]"]),
    js: L(`function solve(a) {
  for (let i = 1; i < a.length; i++) {
    if (a[i] < a[i - 1]) return 0;
  }
  return 1;
}`, ["a[i] < a[i - 1]", "a[i] <= a[i - 1]"]),
    c: L(`int solve(int a[], int n) {
    for (int i = 1; i < n; i++) {
        if (a[i] < a[i - 1]) return 0;
    }
    return 1;
}`, ["a[i] < a[i - 1]", "a[i] <= a[i - 1]"]),
    cpp: L(`int solve(vector<int>& a) {
    for (int i = 1; i < (int)a.size(); i++) {
        if (a[i] < a[i - 1]) return 0;
    }
    return 1;
}`, ["a[i] < a[i - 1]", "a[i] <= a[i - 1]"]),
    java: L(`static int solve(int[] a) {
    for (int i = 1; i < a.length; i++) {
        if (a[i] < a[i - 1]) return 0;
    }
    return 1;
}`, ["a[i] < a[i - 1]", "a[i] <= a[i - 1]"])
  },
  {
    id: "d010", title: "Element After Rotation", topic: "Arrays", level: "Medium", kind: "kints",
    statement: "Given k and a non-empty array, rotate the array left by k positions. Print the element that ends up at index 0. k may be larger than the array length.",
    cases: ["2 5 1 2 3 4 5", "7 3 10 20 30", "0 4 9 8 7 6"], hidden: ["3 3 4 5 6", "10 1 42"],
    bug: { type: "logic", note: "The wrap-around index is computed in the wrong direction." },
    py: L(`def solve(k, a):
    n = len(a)
    return a[k % n]`, ["a[k % n]", "a[(n - k) % n]"]),
    js: L(`function solve(k, a) {
  const n = a.length;
  return a[k % n];
}`, ["a[k % n]", "a[(n - k) % n]"]),
    c: L(`int solve(int k, int a[], int n) {
    return a[k % n];
}`, ["a[k % n]", "a[(n - k % n) % n]"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int n = a.size();
    return a[k % n];
}`, ["a[k % n]", "a[(n - k % n) % n]"]),
    java: L(`static int solve(int k, int[] a) {
    int n = a.length;
    return a[k % n];
}`, ["a[k % n]", "a[(n - k % n) % n]"])
  },
  {
    id: "d011", title: "Missing Number", topic: "Arrays", level: "Easy", kind: "ints",
    statement: "An array holds n distinct numbers taken from 0..n, so exactly one number from that range is missing. Print the missing number.",
    cases: ["4 0 1 3 4", "3 3 0 1", "1 0"], hidden: ["5 5 4 3 2 0", "2 1 2"],
    bug: { type: "logic", note: "The formula for the expected total is wrong." },
    py: L(`def solve(a):
    n = len(a)
    expected = n * (n + 1) // 2
    actual = 0
    for x in a:
        actual += x
    return expected - actual`, ["n * (n + 1) // 2", "n * (n - 1) // 2"]),
    js: L(`function solve(a) {
  const n = a.length;
  const expected = (n * (n + 1)) / 2;
  let actual = 0;
  for (const x of a) actual += x;
  return expected - actual;
}`, ["(n * (n + 1)) / 2", "(n * (n - 1)) / 2"]),
    c: L(`int solve(int a[], int n) {
    int expected = n * (n + 1) / 2;
    int actual = 0;
    for (int i = 0; i < n; i++) actual += a[i];
    return expected - actual;
}`, ["n * (n + 1) / 2", "n * (n - 1) / 2"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    int expected = n * (n + 1) / 2;
    int actual = 0;
    for (int x : a) actual += x;
    return expected - actual;
}`, ["n * (n + 1) / 2", "n * (n - 1) / 2"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    int expected = n * (n + 1) / 2;
    int actual = 0;
    for (int x : a) actual += x;
    return expected - actual;
}`, ["n * (n + 1) / 2", "n * (n - 1) / 2"])
  },
  {
    id: "d012", title: "Maximum Subarray Sum", topic: "Arrays", level: "Medium", kind: "ints",
    statement: "Given a non-empty array (values may be negative), print the largest sum of any contiguous, non-empty subarray (Kadane's algorithm).",
    cases: ["9 -2 1 -3 4 -1 2 1 -5 4", "3 -3 -1 -2", "5 5 4 -1 7 8"], hidden: ["1 -4", "4 1 -1 1 -1"],
    bug: { type: "missing", note: "The running sum never restarts after it becomes a bad prefix." },
    py: L(`def solve(a):
    best = a[0]
    cur = a[0]
    for i in range(1, len(a)):
        cur = max(a[i], cur + a[i])
        best = max(best, cur)
    return best`, ["cur = max(a[i], cur + a[i])", "cur = cur + a[i]"]),
    js: L(`function solve(a) {
  let best = a[0];
  let cur = a[0];
  for (let i = 1; i < a.length; i++) {
    cur = Math.max(a[i], cur + a[i]);
    best = Math.max(best, cur);
  }
  return best;
}`, ["cur = Math.max(a[i], cur + a[i]);", "cur = cur + a[i];"]),
    c: L(`int solve(int a[], int n) {
    int best = a[0], cur = a[0];
    for (int i = 1; i < n; i++) {
        cur = (a[i] > cur + a[i]) ? a[i] : cur + a[i];
        if (cur > best) best = cur;
    }
    return best;
}`, ["cur = (a[i] > cur + a[i]) ? a[i] : cur + a[i];", "cur = cur + a[i];"]),
    cpp: L(`int solve(vector<int>& a) {
    int best = a[0], cur = a[0];
    for (int i = 1; i < (int)a.size(); i++) {
        cur = max(a[i], cur + a[i]);
        best = max(best, cur);
    }
    return best;
}`, ["cur = max(a[i], cur + a[i]);", "cur = cur + a[i];"]),
    java: L(`static int solve(int[] a) {
    int best = a[0], cur = a[0];
    for (int i = 1; i < a.length; i++) {
        cur = Math.max(a[i], cur + a[i]);
        best = Math.max(best, cur);
    }
    return best;
}`, ["cur = Math.max(a[i], cur + a[i]);", "cur = cur + a[i];"])
  },
  {
    id: "d013", title: "Contains Duplicate", topic: "Arrays", level: "Easy", kind: "ints",
    statement: "Print 1 if any value appears at least twice in the array, otherwise print 0.",
    cases: ["5 1 2 3 4 1", "4 1 2 3 4", "1 7"], hidden: ["0", "3 2 2 2"],
    bug: { type: "logic", note: "An element is being compared with itself." },
    py: L(`def solve(a):
    n = len(a)
    for i in range(n):
        for j in range(i + 1, n):
            if a[i] == a[j]:
                return 1
    return 0`, ["range(i + 1, n)", "range(i, n)"]),
    js: L(`function solve(a) {
  const n = a.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (a[i] === a[j]) return 1;
    }
  }
  return 0;
}`, ["let j = i + 1;", "let j = i;"]),
    c: L(`int solve(int a[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] == a[j]) return 1;
        }
    }
    return 0;
}`, ["int j = i + 1;", "int j = i;"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] == a[j]) return 1;
        }
    }
    return 0;
}`, ["int j = i + 1;", "int j = i;"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] == a[j]) return 1;
        }
    }
    return 0;
}`, ["int j = i + 1;", "int j = i;"])
  },
  {
    id: "d014", title: "Count Pairs with Sum k", topic: "Arrays", level: "Medium", kind: "kints",
    statement: "Given k and an array, print the number of index pairs (i, j) with i < j and a[i] + a[j] == k.",
    cases: ["5 5 1 2 3 4 5", "6 4 3 3 3 3", "10 3 1 2 3"], hidden: ["0 4 0 0 1 -1", "4 1 4"],
    bug: { type: "logic", note: "Pairs are counted twice or paired with themselves." },
    py: L(`def solve(k, a):
    n = len(a)
    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            if a[i] + a[j] == k:
                count += 1
    return count`, ["range(i + 1, n)", "range(n)"]),
    js: L(`function solve(k, a) {
  const n = a.length;
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (a[i] + a[j] === k) count++;
    }
  }
  return count;
}`, ["let j = i + 1;", "let j = 0;"]),
    c: L(`int solve(int k, int a[], int n) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] + a[j] == k) count++;
        }
    }
    return count;
}`, ["int j = i + 1;", "int j = 0;"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int n = a.size();
    int count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] + a[j] == k) count++;
        }
    }
    return count;
}`, ["int j = i + 1;", "int j = 0;"]),
    java: L(`static int solve(int k, int[] a) {
    int n = a.length;
    int count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] + a[j] == k) count++;
        }
    }
    return count;
}`, ["int j = i + 1;", "int j = 0;"])
  },
  {
    id: "d015", title: "Two Sum Exists", topic: "Arrays", level: "Easy", kind: "kints",
    statement: "Given k and an array, print 1 if two elements at different indices add up to k, otherwise print 0.",
    cases: ["9 4 2 7 11 15", "5 3 1 1 1", "0 2 5 -5"], hidden: ["3 1 3", "4 2 2 2"],
    bug: { type: "missing", note: "The default result when nothing matches is wrong." },
    py: L(`def solve(k, a):
    n = len(a)
    for i in range(n):
        for j in range(i + 1, n):
            if a[i] + a[j] == k:
                return 1
    return 0`, ["    return 0", "    return 1"]),
    js: L(`function solve(k, a) {
  const n = a.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (a[i] + a[j] === k) return 1;
    }
  }
  return 0;
}`, ["return 0;", "return 1;"]),
    c: L(`int solve(int k, int a[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] + a[j] == k) return 1;
        }
    }
    return 0;
}`, ["return 0;", "return 1;"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] + a[j] == k) return 1;
        }
    }
    return 0;
}`, ["return 0;", "return 1;"]),
    java: L(`static int solve(int k, int[] a) {
    int n = a.length;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] + a[j] == k) return 1;
        }
    }
    return 0;
}`, ["return 0;", "return 1;"])
  },
  {
    id: "d016", title: "Equilibrium Index", topic: "Arrays", level: "Medium", kind: "ints",
    statement: "Print the first index i where the sum of elements to its left equals the sum of elements to its right (the element itself is excluded from both). Print -1 if no such index exists.",
    cases: ["6 1 7 3 6 5 6", "3 1 2 3", "1 5"], hidden: ["5 2 1 -1 1 2", "4 1 2 3 3"],
    bug: { type: "logic", note: "The element at i is not excluded from the right-hand sum." },
    py: L(`def solve(a):
    total = 0
    for x in a:
        total += x
    left = 0
    for i in range(len(a)):
        right = total - left - a[i]
        if left == right:
            return i
        left += a[i]
    return -1`, ["right = total - left - a[i]", "right = total - left"]),
    js: L(`function solve(a) {
  let total = 0;
  for (const x of a) total += x;
  let left = 0;
  for (let i = 0; i < a.length; i++) {
    const right = total - left - a[i];
    if (left === right) return i;
    left += a[i];
  }
  return -1;
}`, ["const right = total - left - a[i];", "const right = total - left;"]),
    c: L(`int solve(int a[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) total += a[i];
    int left = 0;
    for (int i = 0; i < n; i++) {
        int right = total - left - a[i];
        if (left == right) return i;
        left += a[i];
    }
    return -1;
}`, ["int right = total - left - a[i];", "int right = total - left;"]),
    cpp: L(`int solve(vector<int>& a) {
    int total = 0;
    for (int x : a) total += x;
    int left = 0;
    for (int i = 0; i < (int)a.size(); i++) {
        int right = total - left - a[i];
        if (left == right) return i;
        left += a[i];
    }
    return -1;
}`, ["int right = total - left - a[i];", "int right = total - left;"]),
    java: L(`static int solve(int[] a) {
    int total = 0;
    for (int x : a) total += x;
    int left = 0;
    for (int i = 0; i < a.length; i++) {
        int right = total - left - a[i];
        if (left == right) return i;
        left += a[i];
    }
    return -1;
}`, ["int right = total - left - a[i];", "int right = total - left;"])
  },
  {
    id: "d017", title: "Maximum Product of Two", topic: "Arrays", level: "Medium", kind: "ints",
    statement: "Given an array with at least two elements, print the largest product a[i] * a[j] over all pairs i < j. Values may be negative.",
    cases: ["4 1 5 3 2", "3 -4 -3 1", "2 -1 5"], hidden: ["3 -5 -2 -3", "2 -2 -3"],
    bug: { type: "logic", note: "The starting best value hides negative-only results." },
    py: L(`def solve(a):
    n = len(a)
    best = a[0] * a[1]
    for i in range(n):
        for j in range(i + 1, n):
            if a[i] * a[j] > best:
                best = a[i] * a[j]
    return best`, ["best = a[0] * a[1]", "best = 0"]),
    js: L(`function solve(a) {
  const n = a.length;
  let best = a[0] * a[1];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (a[i] * a[j] > best) best = a[i] * a[j];
    }
  }
  return best;
}`, ["let best = a[0] * a[1];", "let best = 0;"]),
    c: L(`int solve(int a[], int n) {
    int best = a[0] * a[1];
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] * a[j] > best) best = a[i] * a[j];
        }
    }
    return best;
}`, ["int best = a[0] * a[1];", "int best = 0;"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    int best = a[0] * a[1];
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] * a[j] > best) best = a[i] * a[j];
        }
    }
    return best;
}`, ["int best = a[0] * a[1];", "int best = 0;"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    int best = a[0] * a[1];
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] * a[j] > best) best = a[i] * a[j];
        }
    }
    return best;
}`, ["int best = a[0] * a[1];", "int best = 0;"])
  },
  {
    id: "d018", title: "Count Inversions", topic: "Arrays", level: "Medium", kind: "ints",
    statement: "An inversion is a pair of indices i < j with a[i] > a[j]. Print the number of inversions in the array.",
    cases: ["5 2 4 1 3 5", "3 1 2 3", "4 4 3 2 1"], hidden: ["3 2 2 2", "1 9"],
    bug: { type: "logic", note: "Equal values are counted as inversions." },
    py: L(`def solve(a):
    n = len(a)
    count = 0
    for i in range(n):
        for j in range(i + 1, n):
            if a[i] > a[j]:
                count += 1
    return count`, ["a[i] > a[j]", "a[i] >= a[j]"]),
    js: L(`function solve(a) {
  const n = a.length;
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (a[i] > a[j]) count++;
    }
  }
  return count;
}`, ["a[i] > a[j]", "a[i] >= a[j]"]),
    c: L(`int solve(int a[], int n) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] > a[j]) count++;
        }
    }
    return count;
}`, ["a[i] > a[j]", "a[i] >= a[j]"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    int count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] > a[j]) count++;
        }
    }
    return count;
}`, ["a[i] > a[j]", "a[i] >= a[j]"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    int count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] > a[j]) count++;
        }
    }
    return count;
}`, ["a[i] > a[j]", "a[i] >= a[j]"])
  },
  {
    id: "d019", title: "Longest Run of Equal Elements", topic: "Arrays", level: "Easy", kind: "ints",
    statement: "Given a non-empty array, print the length of the longest block of consecutive equal elements.",
    cases: ["7 1 1 2 2 2 3 3", "4 5 4 3 2", "1 9"], hidden: ["5 7 7 7 7 7", "6 1 2 2 1 1 1"],
    bug: { type: "logic", note: "The run counter restarts at the wrong value." },
    py: L(`def solve(a):
    best = 1
    run = 1
    for i in range(1, len(a)):
        if a[i] == a[i - 1]:
            run += 1
        else:
            run = 1
        best = max(best, run)
    return best`, ["        else:\n            run = 1", "        else:\n            run = 0"]),
    js: L(`function solve(a) {
  let best = 1;
  let run = 1;
  for (let i = 1; i < a.length; i++) {
    if (a[i] === a[i - 1]) {
      run++;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
  }
  return best;
}`, ["} else {\n      run = 1;", "} else {\n      run = 0;"]),
    c: L(`int solve(int a[], int n) {
    int best = 1, run = 1;
    for (int i = 1; i < n; i++) {
        if (a[i] == a[i - 1]) {
            run++;
        } else {
            run = 1;
        }
        if (run > best) best = run;
    }
    return best;
}`, ["} else {\n            run = 1;", "} else {\n            run = 0;"]),
    cpp: L(`int solve(vector<int>& a) {
    int best = 1, run = 1;
    for (int i = 1; i < (int)a.size(); i++) {
        if (a[i] == a[i - 1]) {
            run++;
        } else {
            run = 1;
        }
        best = max(best, run);
    }
    return best;
}`, ["} else {\n            run = 1;", "} else {\n            run = 0;"]),
    java: L(`static int solve(int[] a) {
    int best = 1, run = 1;
    for (int i = 1; i < a.length; i++) {
        if (a[i] == a[i - 1]) {
            run++;
        } else {
            run = 1;
        }
        best = Math.max(best, run);
    }
    return best;
}`, ["} else {\n            run = 1;", "} else {\n            run = 0;"])
  },
  {
    id: "d020", title: "Majority Element", topic: "Arrays", level: "Medium", kind: "ints",
    statement: "Print the value that appears MORE than n/2 times (integer division), or -1 if no such value exists. Values are non-negative.",
    cases: ["5 2 2 1 2 3", "4 1 1 2 2", "1 6"], hidden: ["3 4 4 4", "6 1 2 3 1 2 3"],
    bug: { type: "logic", note: "The threshold uses >= instead of strictly more than half." },
    py: L(`def solve(a):
    n = len(a)
    for x in a:
        count = 0
        for y in a:
            if y == x:
                count += 1
        if count > n // 2:
            return x
    return -1`, ["count > n // 2", "count >= n // 2"]),
    js: L(`function solve(a) {
  const n = a.length;
  for (const x of a) {
    let count = 0;
    for (const y of a) {
      if (y === x) count++;
    }
    if (count > Math.floor(n / 2)) return x;
  }
  return -1;
}`, ["count > Math.floor(n / 2)", "count >= Math.floor(n / 2)"]),
    c: L(`int solve(int a[], int n) {
    for (int i = 0; i < n; i++) {
        int count = 0;
        for (int j = 0; j < n; j++) {
            if (a[j] == a[i]) count++;
        }
        if (count > n / 2) return a[i];
    }
    return -1;
}`, ["count > n / 2", "count >= n / 2"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n; i++) {
        int count = 0;
        for (int j = 0; j < n; j++) {
            if (a[j] == a[i]) count++;
        }
        if (count > n / 2) return a[i];
    }
    return -1;
}`, ["count > n / 2", "count >= n / 2"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    for (int i = 0; i < n; i++) {
        int count = 0;
        for (int j = 0; j < n; j++) {
            if (a[j] == a[i]) count++;
        }
        if (count > n / 2) return a[i];
    }
    return -1;
}`, ["count > n / 2", "count >= n / 2"])
  }
];

// Batch 4: Dynamic programming (d071-d085) and Greedy (d086-d090)
const L = (code, ...pairs) => [code, pairs];

export const BATCH4 = [
  {
    id: "d071", title: "Climbing Stairs", topic: "Dynamic Programming", level: "Easy", kind: "int",
    statement: "You can climb 1 or 2 steps at a time. Print the number of distinct ways to climb n steps (0 <= n <= 40; there is 1 way for n = 0).",
    cases: ["5", "1", "10"], hidden: ["0", "30"],
    bug: { type: "logic", note: "The recurrence adds the same state twice." },
    py: L(`def solve(n):
    dp = [0] * (n + 2)
    dp[0] = 1
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`, ["dp[i] = dp[i - 1] + dp[i - 2]", "dp[i] = dp[i - 1] + dp[i - 1]"]),
    js: L(`function solve(n) {
  const dp = new Array(n + 2).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`, ["dp[i] = dp[i - 1] + dp[i - 2];", "dp[i] = dp[i - 1] + dp[i - 1];"]),
    c: L(`int solve(int n) {
    int dp[1005];
    dp[0] = 1;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`, ["dp[i] = dp[i - 1] + dp[i - 2];", "dp[i] = dp[i - 1] + dp[i - 1];"]),
    cpp: L(`int solve(int n) {
    vector<int> dp(n + 2, 0);
    dp[0] = 1;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`, ["dp[i] = dp[i - 1] + dp[i - 2];", "dp[i] = dp[i - 1] + dp[i - 1];"]),
    java: L(`static int solve(int n) {
    int[] dp = new int[n + 2];
    dp[0] = 1;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`, ["dp[i] = dp[i - 1] + dp[i - 2];", "dp[i] = dp[i - 1] + dp[i - 1];"])
  },
  {
    id: "d072", title: "House Robber", topic: "Dynamic Programming", level: "Medium", kind: "ints",
    statement: "Each array value is the money in a house. You cannot rob two adjacent houses. Print the maximum amount you can rob. Values are non-negative.",
    cases: ["4 1 2 3 1", "5 2 7 9 3 1", "1 5"], hidden: ["0", "3 2 1 1"],
    bug: { type: "logic", note: "Robbing a house is added to the wrong previous state, allowing adjacent houses." },
    py: L(`def solve(a):
    take = 0
    skip = 0
    for x in a:
        take, skip = skip + x, max(take, skip)
    return max(take, skip)`, ["take, skip = skip + x, max(take, skip)", "take, skip = take + x, max(take, skip)"]),
    js: L(`function solve(a) {
  let take = 0, skip = 0;
  for (const x of a) {
    const nt = skip + x;
    const ns = Math.max(take, skip);
    take = nt;
    skip = ns;
  }
  return Math.max(take, skip);
}`, ["const nt = skip + x;", "const nt = take + x;"]),
    c: L(`int solve(int a[], int n) {
    int take = 0, skip = 0;
    for (int i = 0; i < n; i++) {
        int nt = skip + a[i];
        int ns = take > skip ? take : skip;
        take = nt;
        skip = ns;
    }
    return take > skip ? take : skip;
}`, ["int nt = skip + a[i];", "int nt = take + a[i];"]),
    cpp: L(`int solve(vector<int>& a) {
    int take = 0, skip = 0;
    for (int x : a) {
        int nt = skip + x;
        int ns = max(take, skip);
        take = nt;
        skip = ns;
    }
    return max(take, skip);
}`, ["int nt = skip + x;", "int nt = take + x;"]),
    java: L(`static int solve(int[] a) {
    int take = 0, skip = 0;
    for (int x : a) {
        int nt = skip + x;
        int ns = Math.max(take, skip);
        take = nt;
        skip = ns;
    }
    return Math.max(take, skip);
}`, ["int nt = skip + x;", "int nt = take + x;"])
  },
  {
    id: "d073", title: "Minimum Coins to Make Amount", topic: "Dynamic Programming", level: "Medium", kind: "kints",
    statement: "k is the target amount (0 <= k <= 1000) and the array holds coin values (positive, unlimited supply). Print the fewest coins that sum to k, or -1 if impossible.",
    cases: ["11 3 1 2 5", "3 1 2", "0 2 1 2"], hidden: ["7 2 2 4", "6 3 1 3 4"],
    bug: { type: "logic", note: "Zero coins are needed for amount 0, but the base case says one." },
    py: L(`def solve(k, a):
    INF = 1000000
    dp = [INF] * (k + 1)
    dp[0] = 0
    for amt in range(1, k + 1):
        for c in a:
            if c <= amt and dp[amt - c] + 1 < dp[amt]:
                dp[amt] = dp[amt - c] + 1
    return -1 if dp[k] >= INF else dp[k]`, ["dp[0] = 0", "dp[0] = 1"]),
    js: L(`function solve(k, a) {
  const INF = 1000000;
  const dp = new Array(k + 1).fill(INF);
  dp[0] = 0;
  for (let amt = 1; amt <= k; amt++) {
    for (const c of a) {
      if (c <= amt && dp[amt - c] + 1 < dp[amt]) dp[amt] = dp[amt - c] + 1;
    }
  }
  return dp[k] >= INF ? -1 : dp[k];
}`, ["dp[0] = 0;", "dp[0] = 1;"]),
    c: L(`int solve(int k, int a[], int n) {
    int INF = 1000000;
    int dp[1005];
    for (int i = 0; i <= k; i++) dp[i] = INF;
    dp[0] = 0;
    for (int amt = 1; amt <= k; amt++) {
        for (int j = 0; j < n; j++) {
            int c = a[j];
            if (c <= amt && dp[amt - c] + 1 < dp[amt]) dp[amt] = dp[amt - c] + 1;
        }
    }
    return dp[k] >= INF ? -1 : dp[k];
}`, ["dp[0] = 0;", "dp[0] = 1;"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int INF = 1000000;
    vector<int> dp(k + 1, INF);
    dp[0] = 0;
    for (int amt = 1; amt <= k; amt++) {
        for (int c : a) {
            if (c <= amt && dp[amt - c] + 1 < dp[amt]) dp[amt] = dp[amt - c] + 1;
        }
    }
    return dp[k] >= INF ? -1 : dp[k];
}`, ["dp[0] = 0;", "dp[0] = 1;"]),
    java: L(`static int solve(int k, int[] a) {
    int INF = 1000000;
    int[] dp = new int[k + 1];
    Arrays.fill(dp, INF);
    dp[0] = 0;
    for (int amt = 1; amt <= k; amt++) {
        for (int c : a) {
            if (c <= amt && dp[amt - c] + 1 < dp[amt]) dp[amt] = dp[amt - c] + 1;
        }
    }
    return dp[k] >= INF ? -1 : dp[k];
}`, ["dp[0] = 0;", "dp[0] = 1;"])
  },
  {
    id: "d074", title: "Number of Ways to Make Change", topic: "Dynamic Programming", level: "Medium", kind: "kints",
    statement: "k is the target amount (0 <= k <= 1000), the array holds coin values (positive, unlimited supply). Print how many different COMBINATIONS of coins sum to k (order does not matter). There is 1 way to make 0.",
    cases: ["5 3 1 2 5", "3 1 2", "0 2 1 2"], hidden: ["10 2 2 5", "4 3 1 2 3"],
    bug: { type: "logic", note: "The inner loop skips the position where a coin equals the amount." },
    py: L(`def solve(k, a):
    dp = [0] * (k + 1)
    dp[0] = 1
    for c in a:
        for amt in range(c, k + 1):
            dp[amt] += dp[amt - c]
    return dp[k]`, ["for amt in range(c, k + 1):", "for amt in range(c + 1, k + 1):"]),
    js: L(`function solve(k, a) {
  const dp = new Array(k + 1).fill(0);
  dp[0] = 1;
  for (const c of a) {
    for (let amt = c; amt <= k; amt++) {
      dp[amt] += dp[amt - c];
    }
  }
  return dp[k];
}`, ["let amt = c;", "let amt = c + 1;"]),
    c: L(`int solve(int k, int a[], int n) {
    int dp[1005] = {0};
    dp[0] = 1;
    for (int j = 0; j < n; j++) {
        int c = a[j];
        for (int amt = c; amt <= k; amt++) {
            dp[amt] += dp[amt - c];
        }
    }
    return dp[k];
}`, ["int amt = c;", "int amt = c + 1;"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    vector<int> dp(k + 1, 0);
    dp[0] = 1;
    for (int c : a) {
        for (int amt = c; amt <= k; amt++) {
            dp[amt] += dp[amt - c];
        }
    }
    return dp[k];
}`, ["int amt = c;", "int amt = c + 1;"]),
    java: L(`static int solve(int k, int[] a) {
    int[] dp = new int[k + 1];
    dp[0] = 1;
    for (int c : a) {
        for (int amt = c; amt <= k; amt++) {
            dp[amt] += dp[amt - c];
        }
    }
    return dp[k];
}`, ["int amt = c;", "int amt = c + 1;"])
  },
  {
    id: "d075", title: "Longest Increasing Subsequence", topic: "Dynamic Programming", level: "Medium", kind: "ints",
    statement: "Print the length of the longest STRICTLY increasing subsequence (elements need not be contiguous). An empty array prints 0.",
    cases: ["8 10 9 2 5 3 7 101 18", "4 7 7 7 7", "5 1 2 3 4 5"], hidden: ["0", "6 0 1 0 3 2 3"],
    bug: { type: "logic", note: "Equal values are allowed to extend a subsequence." },
    py: L(`def solve(a):
    n = len(a)
    if n == 0:
        return 0
    dp = [1] * n
    for i in range(n):
        for j in range(i):
            if a[j] < a[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
    best = 0
    for x in dp:
        best = max(best, x)
    return best`, ["if a[j] < a[i] and", "if a[j] <= a[i] and"]),
    js: L(`function solve(a) {
  const n = a.length;
  if (n === 0) return 0;
  const dp = new Array(n).fill(1);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (a[j] < a[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    }
  }
  let best = 0;
  for (const x of dp) best = Math.max(best, x);
  return best;
}`, ["if (a[j] < a[i] &&", "if (a[j] <= a[i] &&"]),
    c: L(`int solve(int a[], int n) {
    if (n == 0) return 0;
    int dp[1005];
    for (int i = 0; i < n; i++) dp[i] = 1;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (a[j] < a[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
        }
    }
    int best = 0;
    for (int i = 0; i < n; i++) {
        if (dp[i] > best) best = dp[i];
    }
    return best;
}`, ["if (a[j] < a[i] &&", "if (a[j] <= a[i] &&"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    if (n == 0) return 0;
    vector<int> dp(n, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (a[j] < a[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
        }
    }
    int best = 0;
    for (int x : dp) best = max(best, x);
    return best;
}`, ["if (a[j] < a[i] &&", "if (a[j] <= a[i] &&"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    if (n == 0) return 0;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (a[j] < a[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
        }
    }
    int best = 0;
    for (int x : dp) best = Math.max(best, x);
    return best;
}`, ["if (a[j] < a[i] &&", "if (a[j] <= a[i] &&"])
  },
  {
    id: "d076", title: "Longest Common Subsequence", topic: "Dynamic Programming", level: "Medium", kind: "str2",
    statement: "Print the length of the longest common subsequence of s and t (each at most 100 characters).",
    cases: ["abcde ace", "abc def", "abcbdab bdcaba"], hidden: ["a a", "aaaa aa"],
    bug: { type: "missing", note: "A matching pair of characters never increases the length." },
    py: L(`def solve(s, t):
    n = len(s)
    m = len(t)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s[i - 1] == t[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]`, ["dp[i - 1][j - 1] + 1", "dp[i - 1][j - 1]"]),
    js: L(`function solve(s, t) {
  const n = s.length, m = t.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[n][m];
}`, ["dp[i - 1][j - 1] + 1;", "dp[i - 1][j - 1];"]),
    c: L(`int solve(char s[], char t[]) {
    int n = (int)strlen(s), m = (int)strlen(t);
    int dp[105][105] = {0};
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s[i - 1] == t[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = dp[i - 1][j] > dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];
            }
        }
    }
    return dp[n][m];
}`, ["dp[i - 1][j - 1] + 1;", "dp[i - 1][j - 1];"]),
    cpp: L(`int solve(string s, string t) {
    int n = s.size(), m = t.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s[i - 1] == t[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[n][m];
}`, ["dp[i - 1][j - 1] + 1;", "dp[i - 1][j - 1];"]),
    java: L(`static int solve(String s, String t) {
    int n = s.length(), m = t.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s.charAt(i - 1) == t.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[n][m];
}`, ["dp[i - 1][j - 1] + 1;", "dp[i - 1][j - 1];"])
  },
  {
    id: "d077", title: "Edit Distance", topic: "Dynamic Programming", level: "Hard", kind: "str2",
    statement: "Print the minimum number of single-character insertions, deletions and substitutions needed to turn s into t (each at most 100 characters).",
    cases: ["kitten sitting", "abc abc", "abc xyz"], hidden: ["a b", "intention execution"],
    bug: { type: "missing", note: "The base case for turning a prefix of s into the empty string is wrong." },
    py: L(`def solve(s, t):
    n = len(s)
    m = len(t)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s[i - 1] == t[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[n][m]`, ["dp[i][0] = i", "dp[i][0] = 0"]),
    js: L(`function solve(s, t) {
  const n = s.length, m = t.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[n][m];
}`, ["dp[i][0] = i;", "dp[i][0] = 0;"]),
    c: L(`int solve(char s[], char t[]) {
    int n = (int)strlen(s), m = (int)strlen(t);
    int dp[105][105];
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s[i - 1] == t[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                int best = dp[i - 1][j];
                if (dp[i][j - 1] < best) best = dp[i][j - 1];
                if (dp[i - 1][j - 1] < best) best = dp[i - 1][j - 1];
                dp[i][j] = 1 + best;
            }
        }
    }
    return dp[n][m];
}`, ["dp[i][0] = i;", "dp[i][0] = 0;"]),
    cpp: L(`int solve(string s, string t) {
    int n = s.size(), m = t.size();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s[i - 1] == t[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + min(dp[i - 1][j], min(dp[i][j - 1], dp[i - 1][j - 1]));
            }
        }
    }
    return dp[n][m];
}`, ["dp[i][0] = i;", "dp[i][0] = 0;"]),
    java: L(`static int solve(String s, String t) {
    int n = s.length(), m = t.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 0; i <= n; i++) dp[i][0] = i;
    for (int j = 0; j <= m; j++) dp[0][j] = j;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            if (s.charAt(i - 1) == t.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
            }
        }
    }
    return dp[n][m];
}`, ["dp[i][0] = i;", "dp[i][0] = 0;"])
  },
  {
    id: "d078", title: "0/1 Knapsack", topic: "Dynamic Programming", level: "Hard", kind: "kints",
    statement: "k is the knapsack capacity (k <= 1000). The array lists items as pairs: weight, value, weight, value, ... Each item can be used at most once. Print the maximum total value.",
    cases: ["7 8 1 1 3 4 4 5 5 7", "5 2 10 100", "10 6 5 10 4 40 6 30"], hidden: ["3 4 1 10 2 15", "4 2 2 3"],
    bug: { type: "logic", note: "The capacity loop runs upwards, so an item can be used more than once." },
    py: L(`def solve(k, a):
    items = len(a) // 2
    dp = [0] * (k + 1)
    for i in range(items):
        w = a[2 * i]
        v = a[2 * i + 1]
        for cap in range(k, w - 1, -1):
            dp[cap] = max(dp[cap], dp[cap - w] + v)
    return dp[k]`, ["for cap in range(k, w - 1, -1):", "for cap in range(w, k + 1):"]),
    js: L(`function solve(k, a) {
  const items = Math.floor(a.length / 2);
  const dp = new Array(k + 1).fill(0);
  for (let i = 0; i < items; i++) {
    const w = a[2 * i], v = a[2 * i + 1];
    for (let cap = k; cap >= w; cap--) {
      dp[cap] = Math.max(dp[cap], dp[cap - w] + v);
    }
  }
  return dp[k];
}`, ["for (let cap = k; cap >= w; cap--)", "for (let cap = w; cap <= k; cap++)"]),
    c: L(`int solve(int k, int a[], int n) {
    int items = n / 2;
    int dp[1005] = {0};
    for (int i = 0; i < items; i++) {
        int w = a[2 * i], v = a[2 * i + 1];
        for (int cap = k; cap >= w; cap--) {
            if (dp[cap - w] + v > dp[cap]) dp[cap] = dp[cap - w] + v;
        }
    }
    return dp[k];
}`, ["for (int cap = k; cap >= w; cap--)", "for (int cap = w; cap <= k; cap++)"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int items = a.size() / 2;
    vector<int> dp(k + 1, 0);
    for (int i = 0; i < items; i++) {
        int w = a[2 * i], v = a[2 * i + 1];
        for (int cap = k; cap >= w; cap--) {
            dp[cap] = max(dp[cap], dp[cap - w] + v);
        }
    }
    return dp[k];
}`, ["for (int cap = k; cap >= w; cap--)", "for (int cap = w; cap <= k; cap++)"]),
    java: L(`static int solve(int k, int[] a) {
    int items = a.length / 2;
    int[] dp = new int[k + 1];
    for (int i = 0; i < items; i++) {
        int w = a[2 * i], v = a[2 * i + 1];
        for (int cap = k; cap >= w; cap--) {
            dp[cap] = Math.max(dp[cap], dp[cap - w] + v);
        }
    }
    return dp[k];
}`, ["for (int cap = k; cap >= w; cap--)", "for (int cap = w; cap <= k; cap++)"])
  },
  {
    id: "d079", title: "Unique Paths in a Grid", topic: "Dynamic Programming", level: "Medium", kind: "ints",
    statement: "The array holds two integers: rows r and columns c (each at most 15). A robot starts at the top-left and may move only right or down. Print the number of distinct paths to the bottom-right cell.",
    cases: ["2 3 7", "2 3 2", "2 1 5"], hidden: ["2 1 1", "2 5 5"],
    bug: { type: "logic", note: "A cell adds the up-left cell instead of the cell to its left." },
    py: L(`def solve(a):
    r = a[0]
    c = a[1]
    dp = [[1] * c for _ in range(r)]
    for i in range(1, r):
        for j in range(1, c):
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    return dp[r - 1][c - 1]`, ["dp[i - 1][j] + dp[i][j - 1]", "dp[i - 1][j] + dp[i - 1][j - 1]"]),
    js: L(`function solve(a) {
  const r = a[0], c = a[1];
  const dp = Array.from({ length: r }, () => new Array(c).fill(1));
  for (let i = 1; i < r; i++) {
    for (let j = 1; j < c; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[r - 1][c - 1];
}`, ["dp[i - 1][j] + dp[i][j - 1];", "dp[i - 1][j] + dp[i - 1][j - 1];"]),
    c: L(`int solve(int a[], int n) {
    int r = a[0], c = a[1];
    int dp[20][20];
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) dp[i][j] = 1;
    for (int i = 1; i < r; i++) {
        for (int j = 1; j < c; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[r - 1][c - 1];
}`, ["dp[i - 1][j] + dp[i][j - 1];", "dp[i - 1][j] + dp[i - 1][j - 1];"]),
    cpp: L(`int solve(vector<int>& a) {
    int r = a[0], c = a[1];
    vector<vector<int>> dp(r, vector<int>(c, 1));
    for (int i = 1; i < r; i++) {
        for (int j = 1; j < c; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[r - 1][c - 1];
}`, ["dp[i - 1][j] + dp[i][j - 1];", "dp[i - 1][j] + dp[i - 1][j - 1];"]),
    java: L(`static int solve(int[] a) {
    int r = a[0], c = a[1];
    int[][] dp = new int[r][c];
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) dp[i][j] = 1;
    for (int i = 1; i < r; i++) {
        for (int j = 1; j < c; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[r - 1][c - 1];
}`, ["dp[i - 1][j] + dp[i][j - 1];", "dp[i - 1][j] + dp[i - 1][j - 1];"])
  },
  {
    id: "d080", title: "Maximum Product Subarray", topic: "Dynamic Programming", level: "Hard", kind: "ints",
    statement: "Given a non-empty array (values may be negative or zero), print the largest product of any contiguous non-empty subarray. Products fit in 32 bits.",
    cases: ["4 2 3 -2 4", "3 -2 0 -1", "3 -2 3 -4"], hidden: ["1 -5", "4 -1 -2 -3 -4"],
    bug: { type: "logic", note: "The minimum product is tracked incorrectly, so negative pairs are missed." },
    py: L(`def solve(a):
    best = a[0]
    hi = a[0]
    lo = a[0]
    for i in range(1, len(a)):
        x = a[i]
        cand = (x, hi * x, lo * x)
        hi = max(cand)
        lo = min(cand)
        best = max(best, hi)
    return best`, ["cand = (x, hi * x, lo * x)", "cand = (x, hi * x, hi * x)"]),
    js: L(`function solve(a) {
  let best = a[0], hi = a[0], lo = a[0];
  for (let i = 1; i < a.length; i++) {
    const x = a[i];
    const cand = [x, hi * x, lo * x];
    hi = Math.max(...cand);
    lo = Math.min(...cand);
    best = Math.max(best, hi);
  }
  return best;
}`, ["const cand = [x, hi * x, lo * x];", "const cand = [x, hi * x, hi * x];"]),
    c: L(`int solve(int a[], int n) {
    int best = a[0], hi = a[0], lo = a[0];
    for (int i = 1; i < n; i++) {
        int x = a[i];
        int p = hi * x;
        int q = lo * x;
        int nh = x, nl = x;
        if (p > nh) nh = p;
        if (q > nh) nh = q;
        if (p < nl) nl = p;
        if (q < nl) nl = q;
        hi = nh;
        lo = nl;
        if (hi > best) best = hi;
    }
    return best;
}`, ["int q = lo * x;", "int q = hi * x;"]),
    cpp: L(`int solve(vector<int>& a) {
    int best = a[0], hi = a[0], lo = a[0];
    for (int i = 1; i < (int)a.size(); i++) {
        int x = a[i];
        int p = hi * x;
        int q = lo * x;
        int nh = max(x, max(p, q));
        int nl = min(x, min(p, q));
        hi = nh;
        lo = nl;
        best = max(best, hi);
    }
    return best;
}`, ["int q = lo * x;", "int q = hi * x;"]),
    java: L(`static int solve(int[] a) {
    int best = a[0], hi = a[0], lo = a[0];
    for (int i = 1; i < a.length; i++) {
        int x = a[i];
        int p = hi * x;
        int q = lo * x;
        int nh = Math.max(x, Math.max(p, q));
        int nl = Math.min(x, Math.min(p, q));
        hi = nh;
        lo = nl;
        best = Math.max(best, hi);
    }
    return best;
}`, ["int q = lo * x;", "int q = hi * x;"])
  },
  {
    id: "d081", title: "Partition Equal Subset Sum", topic: "Dynamic Programming", level: "Hard", kind: "ints",
    statement: "Values are positive and their total is at most 1000. Print 1 if the array can be split into two groups with equal sums, otherwise 0. Each element is used exactly once.",
    cases: ["4 1 5 11 5", "4 1 2 3 5", "2 1 5"], hidden: ["1 2", "3 3 3 6"],
    bug: { type: "logic", note: "The sum loop runs upwards, so an element can be reused." },
    py: L(`def solve(a):
    total = 0
    for x in a:
        total += x
    if total % 2 == 1:
        return 0
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for x in a:
        for s in range(target, x - 1, -1):
            if dp[s - x]:
                dp[s] = True
    return 1 if dp[target] else 0`, ["for s in range(target, x - 1, -1):", "for s in range(x, target + 1):"]),
    js: L(`function solve(a) {
  let total = 0;
  for (const x of a) total += x;
  if (total % 2 === 1) return 0;
  const target = total / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const x of a) {
    for (let s = target; s >= x; s--) {
      if (dp[s - x]) dp[s] = true;
    }
  }
  return dp[target] ? 1 : 0;
}`, ["for (let s = target; s >= x; s--)", "for (let s = x; s <= target; s++)"]),
    c: L(`int solve(int a[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) total += a[i];
    if (total % 2 == 1) return 0;
    int target = total / 2;
    int dp[1005] = {0};
    dp[0] = 1;
    for (int i = 0; i < n; i++) {
        int x = a[i];
        for (int s = target; s >= x; s--) {
            if (dp[s - x]) dp[s] = 1;
        }
    }
    return dp[target] ? 1 : 0;
}`, ["for (int s = target; s >= x; s--)", "for (int s = x; s <= target; s++)"]),
    cpp: L(`int solve(vector<int>& a) {
    int total = 0;
    for (int x : a) total += x;
    if (total % 2 == 1) return 0;
    int target = total / 2;
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int x : a) {
        for (int s = target; s >= x; s--) {
            if (dp[s - x]) dp[s] = true;
        }
    }
    return dp[target] ? 1 : 0;
}`, ["for (int s = target; s >= x; s--)", "for (int s = x; s <= target; s++)"]),
    java: L(`static int solve(int[] a) {
    int total = 0;
    for (int x : a) total += x;
    if (total % 2 == 1) return 0;
    int target = total / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int x : a) {
        for (int s = target; s >= x; s--) {
            if (dp[s - x]) dp[s] = true;
        }
    }
    return dp[target] ? 1 : 0;
}`, ["for (int s = target; s >= x; s--)", "for (int s = x; s <= target; s++)"])
  },
  {
    id: "d082", title: "Minimum Path Sum in a Grid", topic: "Dynamic Programming", level: "Medium", kind: "ints",
    statement: "The array starts with two integers r and c, followed by r*c grid values in row-major order. Moving only right or down from the top-left to the bottom-right, print the minimum possible sum of values on the path (including both ends).",
    cases: ["11 3 3 1 3 1 1 5 1 4 2 1", "5 1 3 1 2 3", "6 2 2 1 2 1 1"], hidden: ["3 1 1 7", "6 2 2 5 1 1 5"],
    bug: { type: "logic", note: "The code takes the larger neighbour instead of the smaller one." },
    py: L(`def solve(a):
    r = a[0]
    c = a[1]
    g = a[2:]
    dp = [[0] * c for _ in range(r)]
    for i in range(r):
        for j in range(c):
            v = g[i * c + j]
            if i == 0 and j == 0:
                dp[i][j] = v
            elif i == 0:
                dp[i][j] = dp[i][j - 1] + v
            elif j == 0:
                dp[i][j] = dp[i - 1][j] + v
            else:
                dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + v
    return dp[r - 1][c - 1]`, ["min(dp[i - 1][j], dp[i][j - 1]) + v", "max(dp[i - 1][j], dp[i][j - 1]) + v"]),
    js: L(`function solve(a) {
  const r = a[0], c = a[1];
  const g = a.slice(2);
  const dp = Array.from({ length: r }, () => new Array(c).fill(0));
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      const v = g[i * c + j];
      if (i === 0 && j === 0) dp[i][j] = v;
      else if (i === 0) dp[i][j] = dp[i][j - 1] + v;
      else if (j === 0) dp[i][j] = dp[i - 1][j] + v;
      else dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + v;
    }
  }
  return dp[r - 1][c - 1];
}`, ["Math.min(dp[i - 1][j], dp[i][j - 1]) + v", "Math.max(dp[i - 1][j], dp[i][j - 1]) + v"]),
    c: L(`int solve(int a[], int n) {
    int r = a[0], c = a[1];
    int dp[20][20];
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            int v = a[2 + i * c + j];
            if (i == 0 && j == 0) dp[i][j] = v;
            else if (i == 0) dp[i][j] = dp[i][j - 1] + v;
            else if (j == 0) dp[i][j] = dp[i - 1][j] + v;
            else dp[i][j] = (dp[i - 1][j] < dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1]) + v;
        }
    }
    return dp[r - 1][c - 1];
}`, ["(dp[i - 1][j] < dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1])", "(dp[i - 1][j] > dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1])"]),
    cpp: L(`int solve(vector<int>& a) {
    int r = a[0], c = a[1];
    vector<vector<int>> dp(r, vector<int>(c, 0));
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            int v = a[2 + i * c + j];
            if (i == 0 && j == 0) dp[i][j] = v;
            else if (i == 0) dp[i][j] = dp[i][j - 1] + v;
            else if (j == 0) dp[i][j] = dp[i - 1][j] + v;
            else dp[i][j] = min(dp[i - 1][j], dp[i][j - 1]) + v;
        }
    }
    return dp[r - 1][c - 1];
}`, ["min(dp[i - 1][j], dp[i][j - 1]) + v", "max(dp[i - 1][j], dp[i][j - 1]) + v"]),
    java: L(`static int solve(int[] a) {
    int r = a[0], c = a[1];
    int[][] dp = new int[r][c];
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            int v = a[2 + i * c + j];
            if (i == 0 && j == 0) dp[i][j] = v;
            else if (i == 0) dp[i][j] = dp[i][j - 1] + v;
            else if (j == 0) dp[i][j] = dp[i - 1][j] + v;
            else dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + v;
        }
    }
    return dp[r - 1][c - 1];
}`, ["Math.min(dp[i - 1][j], dp[i][j - 1]) + v", "Math.max(dp[i - 1][j], dp[i][j - 1]) + v"])
  },
  {
    id: "d083", title: "Longest Palindromic Subsequence", topic: "Dynamic Programming", level: "Hard", kind: "str",
    statement: "Print the length of the longest palindromic subsequence of the string (at most 100 characters).",
    cases: ["bbbab", "cbbd", "a"], hidden: ["abcde", "racecar"],
    bug: { type: "logic", note: "When the end characters match, only 1 is added instead of 2." },
    py: L(`def solve(s):
    n = len(s)
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    for i in range(n):
        dp[i][i] = 1
    for length in range(2, n + 1):
        for i in range(0, n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    return dp[0][n - 1]`, ["dp[i + 1][j - 1] + 2", "dp[i + 1][j - 1] + 1"]),
    js: L(`function solve(s) {
  const n = s.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[0][n - 1];
}`, ["dp[i + 1][j - 1] + 2;", "dp[i + 1][j - 1] + 1;"]),
    c: L(`int solve(char s[]) {
    int n = (int)strlen(s);
    int dp[105][105] = {0};
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s[i] == s[j]) {
                dp[i][j] = dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = dp[i + 1][j] > dp[i][j - 1] ? dp[i + 1][j] : dp[i][j - 1];
            }
        }
    }
    return dp[0][n - 1];
}`, ["dp[i + 1][j - 1] + 2;", "dp[i + 1][j - 1] + 1;"]),
    cpp: L(`int solve(string s) {
    int n = s.size();
    vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s[i] == s[j]) {
                dp[i][j] = dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[0][n - 1];
}`, ["dp[i + 1][j - 1] + 2;", "dp[i + 1][j - 1] + 1;"]),
    java: L(`static int solve(String s) {
    int n = s.length();
    int[][] dp = new int[n + 2][n + 2];
    for (int i = 0; i < n; i++) dp[i][i] = 1;
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s.charAt(i) == s.charAt(j)) {
                dp[i][j] = dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[0][n - 1];
}`, ["dp[i + 1][j - 1] + 2;", "dp[i + 1][j - 1] + 1;"])
  },
  {
    id: "d084", title: "Min Cost Climbing Stairs", topic: "Dynamic Programming", level: "Easy", kind: "ints",
    statement: "cost[i] is the price of stepping on stair i. You may start on stair 0 or stair 1 and climb 1 or 2 stairs at a time. Print the minimum total cost to reach the top (one step past the last stair). The array has at least two elements.",
    cases: ["3 10 15 20", "10 1 100 1 1 1 100 1 1 100 1", "2 5 5"], hidden: ["2 0 0", "4 1 2 3 4"],
    bug: { type: "logic", note: "The cost of the stair two steps back is read from the wrong index." },
    py: L(`def solve(a):
    n = len(a)
    dp = [0] * (n + 1)
    for i in range(2, n + 1):
        dp[i] = min(dp[i - 1] + a[i - 1], dp[i - 2] + a[i - 2])
    return dp[n]`, ["dp[i - 2] + a[i - 2]", "dp[i - 2] + a[i - 1]"]),
    js: L(`function solve(a) {
  const n = a.length;
  const dp = new Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) {
    dp[i] = Math.min(dp[i - 1] + a[i - 1], dp[i - 2] + a[i - 2]);
  }
  return dp[n];
}`, ["dp[i - 2] + a[i - 2]", "dp[i - 2] + a[i - 1]"]),
    c: L(`int solve(int a[], int n) {
    int dp[1005];
    dp[0] = 0;
    dp[1] = 0;
    for (int i = 2; i <= n; i++) {
        int x = dp[i - 1] + a[i - 1];
        int y = dp[i - 2] + a[i - 2];
        dp[i] = x < y ? x : y;
    }
    return dp[n];
}`, ["int y = dp[i - 2] + a[i - 2];", "int y = dp[i - 2] + a[i - 1];"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    vector<int> dp(n + 1, 0);
    for (int i = 2; i <= n; i++) {
        dp[i] = min(dp[i - 1] + a[i - 1], dp[i - 2] + a[i - 2]);
    }
    return dp[n];
}`, ["dp[i - 2] + a[i - 2]", "dp[i - 2] + a[i - 1]"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    int[] dp = new int[n + 1];
    for (int i = 2; i <= n; i++) {
        dp[i] = Math.min(dp[i - 1] + a[i - 1], dp[i - 2] + a[i - 2]);
    }
    return dp[n];
}`, ["dp[i - 2] + a[i - 2]", "dp[i - 2] + a[i - 1]"])
  },
  {
    id: "d085", title: "Decode Ways", topic: "Dynamic Programming", level: "Hard", kind: "str",
    statement: "A string of digits encodes letters: 1 = A, 2 = B, ..., 26 = Z. Print the number of ways to decode the whole string (0 if it cannot be decoded). The string is non-empty.",
    cases: ["12", "226", "06"], hidden: ["27", "10"],
    bug: { type: "logic", note: "Two-digit numbers above 26 are accepted as letters." },
    py: L(`def solve(s):
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1 if s[0] != "0" else 0
    for i in range(2, n + 1):
        one = int(s[i - 1])
        two = int(s[i - 2:i])
        if one >= 1:
            dp[i] += dp[i - 1]
        if 10 <= two <= 26:
            dp[i] += dp[i - 2]
    return dp[n]`, ["10 <= two <= 26", "10 <= two <= 27"]),
    js: L(`function solve(s) {
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = s[0] !== "0" ? 1 : 0;
  for (let i = 2; i <= n; i++) {
    const one = parseInt(s[i - 1]);
    const two = parseInt(s.slice(i - 2, i));
    if (one >= 1) dp[i] += dp[i - 1];
    if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
  }
  return dp[n];
}`, ["two <= 26", "two <= 27"]),
    c: L(`int solve(char s[]) {
    int n = (int)strlen(s);
    int dp[1005] = {0};
    dp[0] = 1;
    dp[1] = s[0] != '0' ? 1 : 0;
    for (int i = 2; i <= n; i++) {
        int one = s[i - 1] - '0';
        int two = (s[i - 2] - '0') * 10 + one;
        if (one >= 1) dp[i] += dp[i - 1];
        if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
    }
    return dp[n];
}`, ["two <= 26", "two <= 27"]),
    cpp: L(`int solve(string s) {
    int n = s.size();
    vector<int> dp(n + 1, 0);
    dp[0] = 1;
    dp[1] = s[0] != '0' ? 1 : 0;
    for (int i = 2; i <= n; i++) {
        int one = s[i - 1] - '0';
        int two = (s[i - 2] - '0') * 10 + one;
        if (one >= 1) dp[i] += dp[i - 1];
        if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
    }
    return dp[n];
}`, ["two <= 26", "two <= 27"]),
    java: L(`static int solve(String s) {
    int n = s.length();
    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = s.charAt(0) != '0' ? 1 : 0;
    for (int i = 2; i <= n; i++) {
        int one = s.charAt(i - 1) - '0';
        int two = (s.charAt(i - 2) - '0') * 10 + one;
        if (one >= 1) dp[i] += dp[i - 1];
        if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
    }
    return dp[n];
}`, ["two <= 26", "two <= 27"])
  },

  {
    id: "d086", title: "Activity Selection", topic: "Greedy", level: "Medium", kind: "ints",
    statement: "The array lists activities as pairs: start, end, start, end, ... already sorted by end time. An activity may start exactly when the previous chosen one ends. Print the maximum number of non-overlapping activities.",
    cases: ["8 1 3 2 5 3 6 6 8", "4 1 2 1 3", "6 1 2 2 3 3 4"], hidden: ["0", "2 5 9"],
    bug: { type: "logic", note: "An activity that starts exactly when the last one ends is rejected." },
    py: L(`def solve(a):
    count = 0
    last = -1
    for i in range(0, len(a), 2):
        if a[i] >= last:
            count += 1
            last = a[i + 1]
    return count`, ["if a[i] >= last:", "if a[i] > last:"]),
    js: L(`function solve(a) {
  let count = 0, last = -1;
  for (let i = 0; i + 1 < a.length; i += 2) {
    if (a[i] >= last) {
      count++;
      last = a[i + 1];
    }
  }
  return count;
}`, ["if (a[i] >= last)", "if (a[i] > last)"]),
    c: L(`int solve(int a[], int n) {
    int count = 0, last = -1;
    for (int i = 0; i + 1 < n; i += 2) {
        if (a[i] >= last) {
            count++;
            last = a[i + 1];
        }
    }
    return count;
}`, ["if (a[i] >= last)", "if (a[i] > last)"]),
    cpp: L(`int solve(vector<int>& a) {
    int count = 0, last = -1;
    for (int i = 0; i + 1 < (int)a.size(); i += 2) {
        if (a[i] >= last) {
            count++;
            last = a[i + 1];
        }
    }
    return count;
}`, ["if (a[i] >= last)", "if (a[i] > last)"]),
    java: L(`static int solve(int[] a) {
    int count = 0, last = -1;
    for (int i = 0; i + 1 < a.length; i += 2) {
        if (a[i] >= last) {
            count++;
            last = a[i + 1];
        }
    }
    return count;
}`, ["if (a[i] >= last)", "if (a[i] > last)"])
  },
  {
    id: "d087", title: "Jump Game", topic: "Greedy", level: "Medium", kind: "ints",
    statement: "Each value is the maximum jump length from that position. Starting at index 0, print 1 if you can reach the last index, otherwise 0.",
    cases: ["5 2 3 1 1 4", "5 3 2 1 0 4", "4 3 1 0 0"], hidden: ["2 0 1", "4 1 1 1 1", "1 0"],
    bug: { type: "logic", note: "The farthest reachable index is overwritten instead of kept as a maximum." },
    py: L(`def solve(a):
    reach = 0
    for i in range(len(a)):
        if i > reach:
            return 0
        reach = max(reach, i + a[i])
    return 1`, ["reach = max(reach, i + a[i])", "reach = i + a[i]"]),
    js: L(`function solve(a) {
  let reach = 0;
  for (let i = 0; i < a.length; i++) {
    if (i > reach) return 0;
    reach = Math.max(reach, i + a[i]);
  }
  return 1;
}`, ["reach = Math.max(reach, i + a[i]);", "reach = i + a[i];"]),
    c: L(`int solve(int a[], int n) {
    int reach = 0;
    for (int i = 0; i < n; i++) {
        if (i > reach) return 0;
        if (i + a[i] > reach) reach = i + a[i];
    }
    return 1;
}`, ["if (i + a[i] > reach) reach = i + a[i];", "reach = i + a[i];"]),
    cpp: L(`int solve(vector<int>& a) {
    int reach = 0;
    for (int i = 0; i < (int)a.size(); i++) {
        if (i > reach) return 0;
        reach = max(reach, i + a[i]);
    }
    return 1;
}`, ["reach = max(reach, i + a[i]);", "reach = i + a[i];"]),
    java: L(`static int solve(int[] a) {
    int reach = 0;
    for (int i = 0; i < a.length; i++) {
        if (i > reach) return 0;
        reach = Math.max(reach, i + a[i]);
    }
    return 1;
}`, ["reach = Math.max(reach, i + a[i]);", "reach = i + a[i];"])
  },
  {
    id: "d088", title: "Fewest Coins (Greedy)", topic: "Greedy", level: "Easy", kind: "int",
    statement: "Coins are worth 100, 50, 25, 10, 5 and 1. Print the fewest coins needed to make n cents using the greedy strategy.",
    cases: ["289", "30", "1"], hidden: ["0", "99"],
    bug: { type: "logic", note: "The remaining amount is divided instead of reduced with the remainder." },
    py: L(`def solve(n):
    coins = [100, 50, 25, 10, 5, 1]
    count = 0
    for c in coins:
        count += n // c
        n %= c
    return count`, ["n %= c", "n //= c"]),
    js: L(`function solve(n) {
  const coins = [100, 50, 25, 10, 5, 1];
  let count = 0;
  for (const c of coins) {
    count += Math.floor(n / c);
    n %= c;
  }
  return count;
}`, ["n %= c;", "n = Math.floor(n / c);"]),
    c: L(`int solve(int n) {
    int coins[6] = {100, 50, 25, 10, 5, 1};
    int count = 0;
    for (int i = 0; i < 6; i++) {
        count += n / coins[i];
        n %= coins[i];
    }
    return count;
}`, ["n %= coins[i];", "n /= coins[i];"]),
    cpp: L(`int solve(int n) {
    int coins[6] = {100, 50, 25, 10, 5, 1};
    int count = 0;
    for (int c : coins) {
        count += n / c;
        n %= c;
    }
    return count;
}`, ["n %= c;", "n /= c;"]),
    java: L(`static int solve(int n) {
    int[] coins = {100, 50, 25, 10, 5, 1};
    int count = 0;
    for (int c : coins) {
        count += n / c;
        n %= c;
    }
    return count;
}`, ["n %= c;", "n /= c;"])
  },
  {
    id: "d089", title: "Minimum Jumps to the End", topic: "Greedy", level: "Hard", kind: "ints",
    statement: "Each value is the maximum jump length from that index. The last index is always reachable. Print the minimum number of jumps from index 0 to the last index (0 if there is only one element).",
    cases: ["5 2 3 1 1 4", "3 2 3 1", "1 5"], hidden: ["2 1 1", "6 1 2 1 1 1 1"],
    bug: { type: "logic", note: "A jump is counted only when i passes the boundary instead of when it reaches it." },
    py: L(`def solve(a):
    n = len(a)
    if n <= 1:
        return 0
    jumps = 0
    cur_end = 0
    farthest = 0
    for i in range(n - 1):
        farthest = max(farthest, i + a[i])
        if i == cur_end:
            jumps += 1
            cur_end = farthest
    return jumps`, ["if i == cur_end:", "if i > cur_end:"]),
    js: L(`function solve(a) {
  const n = a.length;
  if (n <= 1) return 0;
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < n - 1; i++) {
    farthest = Math.max(farthest, i + a[i]);
    if (i === curEnd) {
      jumps++;
      curEnd = farthest;
    }
  }
  return jumps;
}`, ["if (i === curEnd)", "if (i > curEnd)"]),
    c: L(`int solve(int a[], int n) {
    if (n <= 1) return 0;
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < n - 1; i++) {
        if (i + a[i] > farthest) farthest = i + a[i];
        if (i == curEnd) {
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}`, ["if (i == curEnd)", "if (i > curEnd)"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    if (n <= 1) return 0;
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < n - 1; i++) {
        farthest = max(farthest, i + a[i]);
        if (i == curEnd) {
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}`, ["if (i == curEnd)", "if (i > curEnd)"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    if (n <= 1) return 0;
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < n - 1; i++) {
        farthest = Math.max(farthest, i + a[i]);
        if (i == curEnd) {
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}`, ["if (i == curEnd)", "if (i > curEnd)"])
  },
  {
    id: "d090", title: "Best Time to Trade Stocks", topic: "Greedy", level: "Easy", kind: "ints",
    statement: "The array holds daily prices. You may buy and sell many times but hold at most one share. Print the maximum total profit.",
    cases: ["6 7 1 5 3 6 4", "5 1 2 3 4 5", "4 7 6 4 3"], hidden: ["1 5", "4 3 3 5 0"],
    bug: { type: "logic", note: "Each profitable day overwrites the total instead of adding to it." },
    py: L(`def solve(a):
    profit = 0
    for i in range(1, len(a)):
        if a[i] > a[i - 1]:
            profit += a[i] - a[i - 1]
    return profit`, ["profit += a[i] - a[i - 1]", "profit = a[i] - a[i - 1]"]),
    js: L(`function solve(a) {
  let profit = 0;
  for (let i = 1; i < a.length; i++) {
    if (a[i] > a[i - 1]) profit += a[i] - a[i - 1];
  }
  return profit;
}`, ["profit += a[i] - a[i - 1];", "profit = a[i] - a[i - 1];"]),
    c: L(`int solve(int a[], int n) {
    int profit = 0;
    for (int i = 1; i < n; i++) {
        if (a[i] > a[i - 1]) profit += a[i] - a[i - 1];
    }
    return profit;
}`, ["profit += a[i] - a[i - 1];", "profit = a[i] - a[i - 1];"]),
    cpp: L(`int solve(vector<int>& a) {
    int profit = 0;
    for (int i = 1; i < (int)a.size(); i++) {
        if (a[i] > a[i - 1]) profit += a[i] - a[i - 1];
    }
    return profit;
}`, ["profit += a[i] - a[i - 1];", "profit = a[i] - a[i - 1];"]),
    java: L(`static int solve(int[] a) {
    int profit = 0;
    for (int i = 1; i < a.length; i++) {
        if (a[i] > a[i - 1]) profit += a[i] - a[i - 1];
    }
    return profit;
}`, ["profit += a[i] - a[i - 1];", "profit = a[i] - a[i - 1];"])
  }
];

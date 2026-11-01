// Batch 3: Two pointers / sliding window / hashing (d046-d055), Sorting and searching (d056-d065), Stack and queue (d066-d070)
const L = (code, ...pairs) => [code, pairs];

export const BATCH3 = [
  {
    id: "d046", title: "Pair Sum in a Sorted Array", topic: "Two Pointers", level: "Medium", kind: "kints",
    statement: "Given k and an array sorted in ascending order, print 1 if two elements at different indices add up to k, otherwise 0. Use two pointers.",
    cases: ["9 4 1 3 5 8", "10 4 1 3 5 8", "4 2 2 3"], hidden: ["5 2 2 3", "6 0"],
    bug: { type: "logic", note: "The loop condition lets both pointers land on the same element." },
    py: L(`def solve(k, a):
    l = 0
    r = len(a) - 1
    while l < r:
        s = a[l] + a[r]
        if s == k:
            return 1
        if s < k:
            l += 1
        else:
            r -= 1
    return 0`, ["while l < r:", "while l <= r:"]),
    js: L(`function solve(k, a) {
  let l = 0, r = a.length - 1;
  while (l < r) {
    const s = a[l] + a[r];
    if (s === k) return 1;
    if (s < k) l++;
    else r--;
  }
  return 0;
}`, ["while (l < r)", "while (l <= r)"]),
    c: L(`int solve(int k, int a[], int n) {
    int l = 0, r = n - 1;
    while (l < r) {
        int s = a[l] + a[r];
        if (s == k) return 1;
        if (s < k) l++;
        else r--;
    }
    return 0;
}`, ["while (l < r)", "while (l <= r)"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int l = 0, r = (int)a.size() - 1;
    while (l < r) {
        int s = a[l] + a[r];
        if (s == k) return 1;
        if (s < k) l++;
        else r--;
    }
    return 0;
}`, ["while (l < r)", "while (l <= r)"]),
    java: L(`static int solve(int k, int[] a) {
    int l = 0, r = a.length - 1;
    while (l < r) {
        int s = a[l] + a[r];
        if (s == k) return 1;
        if (s < k) l++;
        else r--;
    }
    return 0;
}`, ["while (l < r)", "while (l <= r)"])
  },
  {
    id: "d047", title: "Max Sum of Subarray of Size k", topic: "Sliding Window", level: "Medium", kind: "kints",
    statement: "Given k (1 <= k <= n) and an array, print the largest sum of any k consecutive elements. Use a sliding window.",
    cases: ["3 6 2 1 5 1 3 2", "2 3 1 2 3", "1 4 5 -1 -2 9"], hidden: ["3 3 1 1 1", "2 5 -3 -1 -4 -2 -9"],
    bug: { type: "missing", note: "The window drops nothing when it slides." },
    py: L(`def solve(k, a):
    n = len(a)
    window = 0
    for i in range(k):
        window += a[i]
    best = window
    for i in range(k, n):
        window += a[i] - a[i - k]
        best = max(best, window)
    return best`, ["window += a[i] - a[i - k]", "window += a[i]"]),
    js: L(`function solve(k, a) {
  const n = a.length;
  let window = 0;
  for (let i = 0; i < k; i++) window += a[i];
  let best = window;
  for (let i = k; i < n; i++) {
    window += a[i] - a[i - k];
    best = Math.max(best, window);
  }
  return best;
}`, ["window += a[i] - a[i - k];", "window += a[i];"]),
    c: L(`int solve(int k, int a[], int n) {
    int window = 0;
    for (int i = 0; i < k; i++) window += a[i];
    int best = window;
    for (int i = k; i < n; i++) {
        window += a[i] - a[i - k];
        if (window > best) best = window;
    }
    return best;
}`, ["window += a[i] - a[i - k];", "window += a[i];"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int n = a.size();
    int window = 0;
    for (int i = 0; i < k; i++) window += a[i];
    int best = window;
    for (int i = k; i < n; i++) {
        window += a[i] - a[i - k];
        best = max(best, window);
    }
    return best;
}`, ["window += a[i] - a[i - k];", "window += a[i];"]),
    java: L(`static int solve(int k, int[] a) {
    int n = a.length;
    int window = 0;
    for (int i = 0; i < k; i++) window += a[i];
    int best = window;
    for (int i = k; i < n; i++) {
        window += a[i] - a[i - k];
        best = Math.max(best, window);
    }
    return best;
}`, ["window += a[i] - a[i - k];", "window += a[i];"])
  },
  {
    id: "d048", title: "Longest Subarray with Sum at Most k", topic: "Sliding Window", level: "Medium", kind: "kints",
    statement: "All values are non-negative. Print the length of the longest contiguous subarray whose sum is at most k (0 if none).",
    cases: ["3 6 1 1 1 1 1 100", "5 4 2 2 2 2", "0 3 1 2 3"], hidden: ["10 1 4", "4 5 1 2 3 1 1"],
    bug: { type: "logic", note: "The window length is off by one." },
    py: L(`def solve(k, a):
    left = 0
    total = 0
    best = 0
    for right in range(len(a)):
        total += a[right]
        while total > k:
            total -= a[left]
            left += 1
        best = max(best, right - left + 1)
    return best`, ["right - left + 1", "right - left"]),
    js: L(`function solve(k, a) {
  let left = 0, total = 0, best = 0;
  for (let right = 0; right < a.length; right++) {
    total += a[right];
    while (total > k) {
      total -= a[left];
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`, ["right - left + 1", "right - left"]),
    c: L(`int solve(int k, int a[], int n) {
    int left = 0, total = 0, best = 0;
    for (int right = 0; right < n; right++) {
        total += a[right];
        while (total > k) {
            total -= a[left];
            left++;
        }
        int len = right - left + 1;
        if (len > best) best = len;
    }
    return best;
}`, ["right - left + 1", "right - left"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int left = 0, total = 0, best = 0;
    for (int right = 0; right < (int)a.size(); right++) {
        total += a[right];
        while (total > k) {
            total -= a[left];
            left++;
        }
        best = max(best, right - left + 1);
    }
    return best;
}`, ["right - left + 1", "right - left"]),
    java: L(`static int solve(int k, int[] a) {
    int left = 0, total = 0, best = 0;
    for (int right = 0; right < a.length; right++) {
        total += a[right];
        while (total > k) {
            total -= a[left];
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`, ["right - left + 1", "right - left"])
  },
  {
    id: "d049", title: "Count Subarrays with Sum k", topic: "Arrays", level: "Medium", kind: "kints",
    statement: "Print how many contiguous subarrays of the array have a sum exactly equal to k.",
    cases: ["3 5 1 2 3 1 2", "0 3 0 0 0", "7 3 1 2 3"], hidden: ["5 1 5", "2 4 1 1 1 1"],
    bug: { type: "logic", note: "The running sum for each start index is initialised with the first element twice." },
    py: L(`def solve(k, a):
    n = len(a)
    count = 0
    for i in range(n):
        total = 0
        for j in range(i, n):
            total += a[j]
            if total == k:
                count += 1
    return count`, ["total = 0", "total = a[i]"]),
    js: L(`function solve(k, a) {
  const n = a.length;
  let count = 0;
  for (let i = 0; i < n; i++) {
    let total = 0;
    for (let j = i; j < n; j++) {
      total += a[j];
      if (total === k) count++;
    }
  }
  return count;
}`, ["let total = 0;", "let total = a[i];"]),
    c: L(`int solve(int k, int a[], int n) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        int total = 0;
        for (int j = i; j < n; j++) {
            total += a[j];
            if (total == k) count++;
        }
    }
    return count;
}`, ["int total = 0;", "int total = a[i];"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int n = a.size();
    int count = 0;
    for (int i = 0; i < n; i++) {
        int total = 0;
        for (int j = i; j < n; j++) {
            total += a[j];
            if (total == k) count++;
        }
    }
    return count;
}`, ["int total = 0;", "int total = a[i];"]),
    java: L(`static int solve(int k, int[] a) {
    int n = a.length;
    int count = 0;
    for (int i = 0; i < n; i++) {
        int total = 0;
        for (int j = i; j < n; j++) {
            total += a[j];
            if (total == k) count++;
        }
    }
    return count;
}`, ["int total = 0;", "int total = a[i];"])
  },
  {
    id: "d050", title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", level: "Hard", kind: "str",
    statement: "Print the length of the longest substring of the lowercase string in which no character repeats.",
    cases: ["abcabcbb", "bbbbb", "pwwkew"], hidden: ["a", "abcdef"],
    bug: { type: "logic", note: "After a repeat the window start is moved to the old position instead of just past it." },
    py: L(`def solve(s):
    last = [-1] * 26
    start = 0
    best = 0
    for i in range(len(s)):
        c = ord(s[i]) - 97
        if last[c] >= start:
            start = last[c] + 1
        last[c] = i
        best = max(best, i - start + 1)
    return best`, ["start = last[c] + 1", "start = last[c]"]),
    js: L(`function solve(s) {
  const last = new Array(26).fill(-1);
  let start = 0, best = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i) - 97;
    if (last[c] >= start) start = last[c] + 1;
    last[c] = i;
    best = Math.max(best, i - start + 1);
  }
  return best;
}`, ["start = last[c] + 1;", "start = last[c];"]),
    c: L(`int solve(char s[]) {
    int last[26];
    for (int i = 0; i < 26; i++) last[i] = -1;
    int start = 0, best = 0, n = (int)strlen(s);
    for (int i = 0; i < n; i++) {
        int c = s[i] - 'a';
        if (last[c] >= start) start = last[c] + 1;
        last[c] = i;
        if (i - start + 1 > best) best = i - start + 1;
    }
    return best;
}`, ["start = last[c] + 1;", "start = last[c];"]),
    cpp: L(`int solve(string s) {
    vector<int> last(26, -1);
    int start = 0, best = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        int c = s[i] - 'a';
        if (last[c] >= start) start = last[c] + 1;
        last[c] = i;
        best = max(best, i - start + 1);
    }
    return best;
}`, ["start = last[c] + 1;", "start = last[c];"]),
    java: L(`static int solve(String s) {
    int[] last = new int[26];
    Arrays.fill(last, -1);
    int start = 0, best = 0;
    for (int i = 0; i < s.length(); i++) {
        int c = s.charAt(i) - 'a';
        if (last[c] >= start) start = last[c] + 1;
        last[c] = i;
        best = Math.max(best, i - start + 1);
    }
    return best;
}`, ["start = last[c] + 1;", "start = last[c];"])
  },
  {
    id: "d051", title: "First Repeated Element", topic: "Hashing", level: "Easy", kind: "ints",
    statement: "Values are between 0 and 100. Print the first value whose second occurrence comes earliest while scanning left to right, or -1 if all values are distinct.",
    cases: ["6 3 1 4 1 3 5", "3 1 2 3", "4 7 7 7 7"], hidden: ["1 0", "5 5 6 5 6 5"],
    bug: { type: "missing", note: "Values are never recorded as seen." },
    py: L(`def solve(a):
    seen = [False] * 105
    for x in a:
        if seen[x]:
            return x
        seen[x] = True
    return -1`, ["seen[x] = True", "pass"]),
    js: L(`function solve(a) {
  const seen = new Array(105).fill(false);
  for (const x of a) {
    if (seen[x]) return x;
    seen[x] = true;
  }
  return -1;
}`, ["seen[x] = true;", ""]),
    c: L(`int solve(int a[], int n) {
    int seen[105] = {0};
    for (int i = 0; i < n; i++) {
        if (seen[a[i]]) return a[i];
        seen[a[i]] = 1;
    }
    return -1;
}`, ["seen[a[i]] = 1;", ""]),
    cpp: L(`int solve(vector<int>& a) {
    vector<bool> seen(105, false);
    for (int x : a) {
        if (seen[x]) return x;
        seen[x] = true;
    }
    return -1;
}`, ["seen[x] = true;", ""]),
    java: L(`static int solve(int[] a) {
    boolean[] seen = new boolean[105];
    for (int x : a) {
        if (seen[x]) return x;
        seen[x] = true;
    }
    return -1;
}`, ["seen[x] = true;", ""])
  },
  {
    id: "d052", title: "Count Distinct Elements", topic: "Hashing", level: "Easy", kind: "ints",
    statement: "Values are between 0 and 100. Print how many different values the array contains.",
    cases: ["5 1 2 2 3 3", "3 7 7 7", "0"], hidden: ["4 0 100 0 100", "1 5"],
    bug: { type: "logic", note: "The condition counts repeats instead of new values." },
    py: L(`def solve(a):
    seen = [False] * 105
    count = 0
    for x in a:
        if not seen[x]:
            seen[x] = True
            count += 1
    return count`, ["if not seen[x]:", "if seen[x]:"]),
    js: L(`function solve(a) {
  const seen = new Array(105).fill(false);
  let count = 0;
  for (const x of a) {
    if (!seen[x]) {
      seen[x] = true;
      count++;
    }
  }
  return count;
}`, ["if (!seen[x])", "if (seen[x])"]),
    c: L(`int solve(int a[], int n) {
    int seen[105] = {0};
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (!seen[a[i]]) {
            seen[a[i]] = 1;
            count++;
        }
    }
    return count;
}`, ["if (!seen[a[i]])", "if (seen[a[i]])"]),
    cpp: L(`int solve(vector<int>& a) {
    vector<bool> seen(105, false);
    int count = 0;
    for (int x : a) {
        if (!seen[x]) {
            seen[x] = true;
            count++;
        }
    }
    return count;
}`, ["if (!seen[x])", "if (seen[x])"]),
    java: L(`static int solve(int[] a) {
    boolean[] seen = new boolean[105];
    int count = 0;
    for (int x : a) {
        if (!seen[x]) {
            seen[x] = true;
            count++;
        }
    }
    return count;
}`, ["if (!seen[x])", "if (seen[x])"])
  },
  {
    id: "d053", title: "Most Frequent Element", topic: "Hashing", level: "Easy", kind: "ints",
    statement: "Values are between 0 and 100 and the array is non-empty. Print the value that occurs most often. If several tie, print the SMALLEST of them.",
    cases: ["6 1 2 2 3 3 3", "4 5 5 7 7", "1 9"], hidden: ["5 4 4 1 1 9", "3 0 0 0"],
    bug: { type: "logic", note: "On ties the later (larger) value wins." },
    py: L(`def solve(a):
    cnt = [0] * 105
    for x in a:
        cnt[x] += 1
    best = 0
    for v in range(105):
        if cnt[v] > cnt[best]:
            best = v
    return best`, ["cnt[v] > cnt[best]", "cnt[v] >= cnt[best]"]),
    js: L(`function solve(a) {
  const cnt = new Array(105).fill(0);
  for (const x of a) cnt[x]++;
  let best = 0;
  for (let v = 0; v < 105; v++) {
    if (cnt[v] > cnt[best]) best = v;
  }
  return best;
}`, ["cnt[v] > cnt[best]", "cnt[v] >= cnt[best]"]),
    c: L(`int solve(int a[], int n) {
    int cnt[105] = {0};
    for (int i = 0; i < n; i++) cnt[a[i]]++;
    int best = 0;
    for (int v = 0; v < 105; v++) {
        if (cnt[v] > cnt[best]) best = v;
    }
    return best;
}`, ["cnt[v] > cnt[best]", "cnt[v] >= cnt[best]"]),
    cpp: L(`int solve(vector<int>& a) {
    vector<int> cnt(105, 0);
    for (int x : a) cnt[x]++;
    int best = 0;
    for (int v = 0; v < 105; v++) {
        if (cnt[v] > cnt[best]) best = v;
    }
    return best;
}`, ["cnt[v] > cnt[best]", "cnt[v] >= cnt[best]"]),
    java: L(`static int solve(int[] a) {
    int[] cnt = new int[105];
    for (int x : a) cnt[x]++;
    int best = 0;
    for (int v = 0; v < 105; v++) {
        if (cnt[v] > cnt[best]) best = v;
    }
    return best;
}`, ["cnt[v] > cnt[best]", "cnt[v] >= cnt[best]"])
  },
  {
    id: "d054", title: "Subarray with Given Sum Exists", topic: "Sliding Window", level: "Medium", kind: "kints",
    statement: "All values are non-negative. Print 1 if some non-empty contiguous subarray has sum exactly k, otherwise 0.",
    cases: ["7 5 1 2 3 4 5", "20 3 1 2 3", "0 3 1 0 2"], hidden: ["3 4 3 1 1 1", "9 3 4 5 6"],
    bug: { type: "logic", note: "The window shrinks when the sum equals k instead of only when it exceeds k." },
    py: L(`def solve(k, a):
    left = 0
    total = 0
    for right in range(len(a)):
        total += a[right]
        while total > k and left <= right:
            total -= a[left]
            left += 1
        if total == k and left <= right:
            return 1
    return 0`, ["while total > k and left <= right:", "while total >= k and left <= right:"]),
    js: L(`function solve(k, a) {
  let left = 0, total = 0;
  for (let right = 0; right < a.length; right++) {
    total += a[right];
    while (total > k && left <= right) {
      total -= a[left];
      left++;
    }
    if (total === k && left <= right) return 1;
  }
  return 0;
}`, ["while (total > k && left <= right)", "while (total >= k && left <= right)"]),
    c: L(`int solve(int k, int a[], int n) {
    int left = 0, total = 0;
    for (int right = 0; right < n; right++) {
        total += a[right];
        while (total > k && left <= right) {
            total -= a[left];
            left++;
        }
        if (total == k && left <= right) return 1;
    }
    return 0;
}`, ["while (total > k && left <= right)", "while (total >= k && left <= right)"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int left = 0, total = 0;
    for (int right = 0; right < (int)a.size(); right++) {
        total += a[right];
        while (total > k && left <= right) {
            total -= a[left];
            left++;
        }
        if (total == k && left <= right) return 1;
    }
    return 0;
}`, ["while (total > k && left <= right)", "while (total >= k && left <= right)"]),
    java: L(`static int solve(int k, int[] a) {
    int left = 0, total = 0;
    for (int right = 0; right < a.length; right++) {
        total += a[right];
        while (total > k && left <= right) {
            total -= a[left];
            left++;
        }
        if (total == k && left <= right) return 1;
    }
    return 0;
}`, ["while (total > k && left <= right)", "while (total >= k && left <= right)"])
  },
  {
    id: "d055", title: "Container With Most Water", topic: "Two Pointers", level: "Medium", kind: "ints",
    statement: "Each array value is the height of a vertical line at that index. Print the largest area of water two lines can hold: min(height) times the distance between them.",
    cases: ["9 1 8 6 2 5 4 8 3 7", "2 1 1", "4 4 3 2 1"], hidden: ["1 5", "5 2 3 4 5 6"],
    bug: { type: "logic", note: "The pointer on the taller line is moved instead of the shorter one." },
    py: L(`def solve(a):
    l = 0
    r = len(a) - 1
    best = 0
    while l < r:
        h = min(a[l], a[r])
        best = max(best, h * (r - l))
        if a[l] < a[r]:
            l += 1
        else:
            r -= 1
    return best`, ["if a[l] < a[r]:", "if a[l] > a[r]:"]),
    js: L(`function solve(a) {
  let l = 0, r = a.length - 1, best = 0;
  while (l < r) {
    const h = Math.min(a[l], a[r]);
    best = Math.max(best, h * (r - l));
    if (a[l] < a[r]) l++;
    else r--;
  }
  return best;
}`, ["if (a[l] < a[r]) l++;", "if (a[l] > a[r]) l++;"]),
    c: L(`int solve(int a[], int n) {
    int l = 0, r = n - 1, best = 0;
    while (l < r) {
        int h = a[l] < a[r] ? a[l] : a[r];
        if (h * (r - l) > best) best = h * (r - l);
        if (a[l] < a[r]) l++;
        else r--;
    }
    return best;
}`, ["if (a[l] < a[r]) l++;", "if (a[l] > a[r]) l++;"]),
    cpp: L(`int solve(vector<int>& a) {
    int l = 0, r = (int)a.size() - 1, best = 0;
    while (l < r) {
        int h = min(a[l], a[r]);
        best = max(best, h * (r - l));
        if (a[l] < a[r]) l++;
        else r--;
    }
    return best;
}`, ["if (a[l] < a[r]) l++;", "if (a[l] > a[r]) l++;"]),
    java: L(`static int solve(int[] a) {
    int l = 0, r = a.length - 1, best = 0;
    while (l < r) {
        int h = Math.min(a[l], a[r]);
        best = Math.max(best, h * (r - l));
        if (a[l] < a[r]) l++;
        else r--;
    }
    return best;
}`, ["if (a[l] < a[r]) l++;", "if (a[l] > a[r]) l++;"])
  },

  {
    id: "d056", title: "Binary Search", topic: "Searching", level: "Easy", kind: "kints",
    statement: "The array is sorted ascending. Print the index of k, or -1 if k is absent.",
    cases: ["7 5 1 3 5 7 9", "4 4 1 3 5 7", "1 1 1"], hidden: ["9 5 1 3 5 7 9", "5 0"],
    bug: { type: "logic", note: "The last remaining candidate is never examined." },
    py: L(`def solve(k, a):
    lo = 0
    hi = len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == k:
            return mid
        if a[mid] < k:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`, ["while lo <= hi:", "while lo < hi:"]),
    js: L(`function solve(k, a) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] === k) return mid;
    if (a[mid] < k) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`, ["while (lo <= hi)", "while (lo < hi)"]),
    c: L(`int solve(int k, int a[], int n) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] == k) return mid;
        if (a[mid] < k) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`, ["while (lo <= hi)", "while (lo < hi)"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] == k) return mid;
        if (a[mid] < k) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`, ["while (lo <= hi)", "while (lo < hi)"]),
    java: L(`static int solve(int k, int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] == k) return mid;
        if (a[mid] < k) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`, ["while (lo <= hi)", "while (lo < hi)"])
  },
  {
    id: "d057", title: "Lower Bound", topic: "Searching", level: "Medium", kind: "kints",
    statement: "The array is sorted ascending. Print the index of the first element that is >= k, or n if every element is smaller than k.",
    cases: ["4 5 1 2 4 4 7", "5 3 1 2 3", "0 3 1 2 3"], hidden: ["9 3 1 2 3", "2 1 2"],
    bug: { type: "logic", note: "Equal elements are skipped, so the search returns an upper bound." },
    py: L(`def solve(k, a):
    lo = 0
    hi = len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < k:
            lo = mid + 1
        else:
            hi = mid
    return lo`, ["if a[mid] < k:", "if a[mid] <= k:"]),
    js: L(`function solve(k, a) {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] < k) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`, ["if (a[mid] < k)", "if (a[mid] <= k)"]),
    c: L(`int solve(int k, int a[], int n) {
    int lo = 0, hi = n;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] < k) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`, ["if (a[mid] < k)", "if (a[mid] <= k)"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    int lo = 0, hi = (int)a.size();
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] < k) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`, ["if (a[mid] < k)", "if (a[mid] <= k)"]),
    java: L(`static int solve(int k, int[] a) {
    int lo = 0, hi = a.length;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] < k) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`, ["if (a[mid] < k)", "if (a[mid] <= k)"])
  },
  {
    id: "d058", title: "Minimum in a Rotated Sorted Array", topic: "Searching", level: "Hard", kind: "ints",
    statement: "A sorted array of distinct values was rotated at an unknown pivot (it may also be unrotated). Print its minimum in O(log n).",
    cases: ["5 4 5 1 2 3", "4 1 2 3 4", "3 2 3 1"], hidden: ["1 5", "6 6 7 1 2 3 4"],
    bug: { type: "logic", note: "The midpoint is compared with the wrong end of the range." },
    py: L(`def solve(a):
    lo = 0
    hi = len(a) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] > a[hi]:
            lo = mid + 1
        else:
            hi = mid
    return a[lo]`, ["if a[mid] > a[hi]:", "if a[mid] > a[lo]:"]),
    js: L(`function solve(a) {
  let lo = 0, hi = a.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] > a[hi]) lo = mid + 1;
    else hi = mid;
  }
  return a[lo];
}`, ["if (a[mid] > a[hi])", "if (a[mid] > a[lo])"]),
    c: L(`int solve(int a[], int n) {
    int lo = 0, hi = n - 1;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] > a[hi]) lo = mid + 1;
        else hi = mid;
    }
    return a[lo];
}`, ["if (a[mid] > a[hi])", "if (a[mid] > a[lo])"]),
    cpp: L(`int solve(vector<int>& a) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] > a[hi]) lo = mid + 1;
        else hi = mid;
    }
    return a[lo];
}`, ["if (a[mid] > a[hi])", "if (a[mid] > a[lo])"]),
    java: L(`static int solve(int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] > a[hi]) lo = mid + 1;
        else hi = mid;
    }
    return a[lo];
}`, ["if (a[mid] > a[hi])", "if (a[mid] > a[lo])"])
  },
  {
    id: "d059", title: "Bubble Sort Swap Count", topic: "Sorting", level: "Easy", kind: "ints",
    statement: "Run bubble sort on the array (swap adjacent elements only when the left one is STRICTLY greater). Print how many swaps are performed.",
    cases: ["5 5 1 4 2 8", "3 1 2 3", "4 2 2 1 1"], hidden: ["1 3", "4 3 3 3 3"],
    bug: { type: "logic", note: "Equal neighbours are swapped and counted." },
    py: L(`def solve(a):
    n = len(a)
    swaps = 0
    for i in range(n):
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swaps += 1
    return swaps`, ["if a[j] > a[j + 1]:", "if a[j] >= a[j + 1]:"]),
    js: L(`function solve(a) {
  const n = a.length;
  let swaps = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        const t = a[j];
        a[j] = a[j + 1];
        a[j + 1] = t;
        swaps++;
      }
    }
  }
  return swaps;
}`, ["if (a[j] > a[j + 1])", "if (a[j] >= a[j + 1])"]),
    c: L(`int solve(int a[], int n) {
    int swaps = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j];
                a[j] = a[j + 1];
                a[j + 1] = t;
                swaps++;
            }
        }
    }
    return swaps;
}`, ["if (a[j] > a[j + 1])", "if (a[j] >= a[j + 1])"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    int swaps = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                swaps++;
            }
        }
    }
    return swaps;
}`, ["if (a[j] > a[j + 1])", "if (a[j] >= a[j + 1])"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    int swaps = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j];
                a[j] = a[j + 1];
                a[j + 1] = t;
                swaps++;
            }
        }
    }
    return swaps;
}`, ["if (a[j] > a[j + 1])", "if (a[j] >= a[j + 1])"])
  },
  {
    id: "d060", title: "k-th Smallest via Insertion Sort", topic: "Sorting", level: "Medium", kind: "kints",
    statement: "Sort a copy of the array with insertion sort and print its k-th smallest element (k = 1 is the minimum, 1 <= k <= n).",
    cases: ["2 5 4 1 3 5 2", "1 3 9 8 7", "3 4 4 3 2 1"], hidden: ["1 1 5", "2 3 2 2 1"],
    bug: { type: "logic", note: "The inner loop never compares against index 0, so the smallest value can stay out of place." },
    py: L(`def solve(k, a):
    b = list(a)
    for i in range(1, len(b)):
        key = b[i]
        j = i - 1
        while j >= 0 and b[j] > key:
            b[j + 1] = b[j]
            j -= 1
        b[j + 1] = key
    return b[k - 1]`, ["while j >= 0 and b[j] > key:", "while j > 0 and b[j] > key:"]),
    js: L(`function solve(k, a) {
  const b = a.slice();
  for (let i = 1; i < b.length; i++) {
    const key = b[i];
    let j = i - 1;
    while (j >= 0 && b[j] > key) {
      b[j + 1] = b[j];
      j--;
    }
    b[j + 1] = key;
  }
  return b[k - 1];
}`, ["while (j >= 0 && b[j] > key)", "while (j > 0 && b[j] > key)"]),
    c: L(`int solve(int k, int a[], int n) {
    int b[1005];
    for (int i = 0; i < n; i++) b[i] = a[i];
    for (int i = 1; i < n; i++) {
        int key = b[i];
        int j = i - 1;
        while (j >= 0 && b[j] > key) {
            b[j + 1] = b[j];
            j--;
        }
        b[j + 1] = key;
    }
    return b[k - 1];
}`, ["while (j >= 0 && b[j] > key)", "while (j > 0 && b[j] > key)"]),
    cpp: L(`int solve(int k, vector<int>& a) {
    vector<int> b = a;
    for (int i = 1; i < (int)b.size(); i++) {
        int key = b[i];
        int j = i - 1;
        while (j >= 0 && b[j] > key) {
            b[j + 1] = b[j];
            j--;
        }
        b[j + 1] = key;
    }
    return b[k - 1];
}`, ["while (j >= 0 && b[j] > key)", "while (j > 0 && b[j] > key)"]),
    java: L(`static int solve(int k, int[] a) {
    int[] b = a.clone();
    for (int i = 1; i < b.length; i++) {
        int key = b[i];
        int j = i - 1;
        while (j >= 0 && b[j] > key) {
            b[j + 1] = b[j];
            j--;
        }
        b[j + 1] = key;
    }
    return b[k - 1];
}`, ["while (j >= 0 && b[j] > key)", "while (j > 0 && b[j] > key)"])
  },
  {
    id: "d061", title: "Integer Square Root", topic: "Searching", level: "Medium", kind: "int",
    statement: "Print the floor of the square root of n (0 <= n <= 10000) using binary search on the answer.",
    cases: ["16", "15", "0"], hidden: ["1", "10000"],
    bug: { type: "logic", note: "Perfect squares are rejected by a strict comparison." },
    py: L(`def solve(n):
    lo = 0
    hi = n
    ans = 0
    while lo <= hi:
        mid = (lo + hi) // 2
        if mid * mid <= n:
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return ans`, ["if mid * mid <= n:", "if mid * mid < n:"]),
    js: L(`function solve(n) {
  let lo = 0, hi = n, ans = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (mid * mid <= n) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}`, ["if (mid * mid <= n)", "if (mid * mid < n)"]),
    c: L(`int solve(int n) {
    int lo = 0, hi = n, ans = 0;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (mid * mid <= n) {
            ans = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return ans;
}`, ["if (mid * mid <= n)", "if (mid * mid < n)"]),
    cpp: L(`int solve(int n) {
    int lo = 0, hi = n, ans = 0;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (mid * mid <= n) {
            ans = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return ans;
}`, ["if (mid * mid <= n)", "if (mid * mid < n)"]),
    java: L(`static int solve(int n) {
    int lo = 0, hi = n, ans = 0;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (mid * mid <= n) {
            ans = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return ans;
}`, ["if (mid * mid <= n)", "if (mid * mid < n)"])
  },
  {
    id: "d062", title: "First Peak Index", topic: "Searching", level: "Medium", kind: "ints",
    statement: "A peak is an element strictly greater than both neighbours (the array ends count as minus infinity). Print the index of the first peak, or -1 if there is none.",
    cases: ["5 1 3 2 5 4", "4 1 2 3 4", "4 1 2 2 1"], hidden: ["1 7", "3 5 4 3"],
    bug: { type: "logic", note: "Equal neighbours are accepted as if they were smaller." },
    py: L(`def solve(a):
    n = len(a)
    for i in range(n):
        left_ok = i == 0 or a[i] > a[i - 1]
        right_ok = i == n - 1 or a[i] > a[i + 1]
        if left_ok and right_ok:
            return i
    return -1`, ["right_ok = i == n - 1 or a[i] > a[i + 1]", "right_ok = i == n - 1 or a[i] >= a[i + 1]"]),
    js: L(`function solve(a) {
  const n = a.length;
  for (let i = 0; i < n; i++) {
    const leftOk = i === 0 || a[i] > a[i - 1];
    const rightOk = i === n - 1 || a[i] > a[i + 1];
    if (leftOk && rightOk) return i;
  }
  return -1;
}`, ["a[i] > a[i + 1];", "a[i] >= a[i + 1];"]),
    c: L(`int solve(int a[], int n) {
    for (int i = 0; i < n; i++) {
        int leftOk = (i == 0 || a[i] > a[i - 1]);
        int rightOk = (i == n - 1 || a[i] > a[i + 1]);
        if (leftOk && rightOk) return i;
    }
    return -1;
}`, ["a[i] > a[i + 1]);", "a[i] >= a[i + 1]);"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n; i++) {
        bool leftOk = (i == 0 || a[i] > a[i - 1]);
        bool rightOk = (i == n - 1 || a[i] > a[i + 1]);
        if (leftOk && rightOk) return i;
    }
    return -1;
}`, ["a[i] > a[i + 1]);", "a[i] >= a[i + 1]);"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    for (int i = 0; i < n; i++) {
        boolean leftOk = (i == 0 || a[i] > a[i - 1]);
        boolean rightOk = (i == n - 1 || a[i] > a[i + 1]);
        if (leftOk && rightOk) return i;
    }
    return -1;
}`, ["a[i] > a[i + 1]);", "a[i] >= a[i + 1]);"])
  },
  {
    id: "d063", title: "Median of an Odd-Length Array", topic: "Sorting", level: "Medium", kind: "ints",
    statement: "The array has an odd number of elements. Sort it (insertion sort) and print the middle element.",
    cases: ["5 3 1 4 1 5", "3 9 7 8", "1 4"], hidden: ["7 7 6 5 4 3 2 1", "3 -1 -5 -3"],
    bug: { type: "logic", note: "The middle index is off by one." },
    py: L(`def solve(a):
    b = list(a)
    for i in range(1, len(b)):
        key = b[i]
        j = i - 1
        while j >= 0 and b[j] > key:
            b[j + 1] = b[j]
            j -= 1
        b[j + 1] = key
    return b[len(b) // 2]`, ["b[len(b) // 2]", "b[len(b) // 2 + 1]"]),
    js: L(`function solve(a) {
  const b = a.slice();
  for (let i = 1; i < b.length; i++) {
    const key = b[i];
    let j = i - 1;
    while (j >= 0 && b[j] > key) {
      b[j + 1] = b[j];
      j--;
    }
    b[j + 1] = key;
  }
  return b[Math.floor(b.length / 2)];
}`, ["b[Math.floor(b.length / 2)]", "b[Math.floor(b.length / 2) + 1]"]),
    c: L(`int solve(int a[], int n) {
    int b[1005];
    for (int i = 0; i < n; i++) b[i] = a[i];
    for (int i = 1; i < n; i++) {
        int key = b[i];
        int j = i - 1;
        while (j >= 0 && b[j] > key) {
            b[j + 1] = b[j];
            j--;
        }
        b[j + 1] = key;
    }
    return b[n / 2];
}`, ["b[n / 2]", "b[n / 2 + 1]"]),
    cpp: L(`int solve(vector<int>& a) {
    vector<int> b = a;
    for (int i = 1; i < (int)b.size(); i++) {
        int key = b[i];
        int j = i - 1;
        while (j >= 0 && b[j] > key) {
            b[j + 1] = b[j];
            j--;
        }
        b[j + 1] = key;
    }
    return b[b.size() / 2];
}`, ["b[b.size() / 2]", "b[b.size() / 2 + 1]"]),
    java: L(`static int solve(int[] a) {
    int[] b = a.clone();
    for (int i = 1; i < b.length; i++) {
        int key = b[i];
        int j = i - 1;
        while (j >= 0 && b[j] > key) {
            b[j + 1] = b[j];
            j--;
        }
        b[j + 1] = key;
    }
    return b[b.length / 2];
}`, ["b[b.length / 2]", "b[b.length / 2 + 1]"])
  },
  {
    id: "d064", title: "Minimum Gap After Sorting", topic: "Sorting", level: "Medium", kind: "ints",
    statement: "The array has at least two elements. Sort it and print the smallest difference between two adjacent elements.",
    cases: ["5 4 2 1 3 10", "3 1 100 50", "2 5 5"], hidden: ["4 8 1 4 6", "2 -3 3"],
    bug: { type: "logic", note: "The running minimum starts at 0 so it can never improve." },
    py: L(`def solve(a):
    b = list(a)
    for i in range(1, len(b)):
        key = b[i]
        j = i - 1
        while j >= 0 and b[j] > key:
            b[j + 1] = b[j]
            j -= 1
        b[j + 1] = key
    best = b[1] - b[0]
    for i in range(2, len(b)):
        best = min(best, b[i] - b[i - 1])
    return best`, ["best = b[1] - b[0]", "best = 0"]),
    js: L(`function solve(a) {
  const b = a.slice();
  for (let i = 1; i < b.length; i++) {
    const key = b[i];
    let j = i - 1;
    while (j >= 0 && b[j] > key) {
      b[j + 1] = b[j];
      j--;
    }
    b[j + 1] = key;
  }
  let best = b[1] - b[0];
  for (let i = 2; i < b.length; i++) {
    best = Math.min(best, b[i] - b[i - 1]);
  }
  return best;
}`, ["let best = b[1] - b[0];", "let best = 0;"]),
    c: L(`int solve(int a[], int n) {
    int b[1005];
    for (int i = 0; i < n; i++) b[i] = a[i];
    for (int i = 1; i < n; i++) {
        int key = b[i];
        int j = i - 1;
        while (j >= 0 && b[j] > key) {
            b[j + 1] = b[j];
            j--;
        }
        b[j + 1] = key;
    }
    int best = b[1] - b[0];
    for (int i = 2; i < n; i++) {
        if (b[i] - b[i - 1] < best) best = b[i] - b[i - 1];
    }
    return best;
}`, ["int best = b[1] - b[0];", "int best = 0;"]),
    cpp: L(`int solve(vector<int>& a) {
    vector<int> b = a;
    for (int i = 1; i < (int)b.size(); i++) {
        int key = b[i];
        int j = i - 1;
        while (j >= 0 && b[j] > key) {
            b[j + 1] = b[j];
            j--;
        }
        b[j + 1] = key;
    }
    int best = b[1] - b[0];
    for (int i = 2; i < (int)b.size(); i++) {
        best = min(best, b[i] - b[i - 1]);
    }
    return best;
}`, ["int best = b[1] - b[0];", "int best = 0;"]),
    java: L(`static int solve(int[] a) {
    int[] b = a.clone();
    for (int i = 1; i < b.length; i++) {
        int key = b[i];
        int j = i - 1;
        while (j >= 0 && b[j] > key) {
            b[j + 1] = b[j];
            j--;
        }
        b[j + 1] = key;
    }
    int best = b[1] - b[0];
    for (int i = 2; i < b.length; i++) {
        best = Math.min(best, b[i] - b[i - 1]);
    }
    return best;
}`, ["int best = b[1] - b[0];", "int best = 0;"])
  },
  {
    id: "d065", title: "Elements Above the Average", topic: "Arrays", level: "Easy", kind: "ints",
    statement: "Print how many elements are strictly greater than the average of the array (compare exactly, without rounding the average). An empty array prints 0.",
    cases: ["4 1 2 3 4", "3 5 5 5", "2 1 100"], hidden: ["1 7", "5 -3 -1 0 1 3"],
    bug: { type: "logic", note: "Elements equal to the average are counted too." },
    py: L(`def solve(a):
    n = len(a)
    total = 0
    for x in a:
        total += x
    count = 0
    for x in a:
        if x * n > total:
            count += 1
    return count`, ["if x * n > total:", "if x * n >= total:"]),
    js: L(`function solve(a) {
  const n = a.length;
  let total = 0;
  for (const x of a) total += x;
  let count = 0;
  for (const x of a) {
    if (x * n > total) count++;
  }
  return count;
}`, ["if (x * n > total)", "if (x * n >= total)"]),
    c: L(`int solve(int a[], int n) {
    int total = 0;
    for (int i = 0; i < n; i++) total += a[i];
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] * n > total) count++;
    }
    return count;
}`, ["if (a[i] * n > total)", "if (a[i] * n >= total)"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    int total = 0;
    for (int x : a) total += x;
    int count = 0;
    for (int x : a) {
        if (x * n > total) count++;
    }
    return count;
}`, ["if (x * n > total)", "if (x * n >= total)"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    int total = 0;
    for (int x : a) total += x;
    int count = 0;
    for (int x : a) {
        if (x * n > total) count++;
    }
    return count;
}`, ["if (x * n > total)", "if (x * n >= total)"])
  },

  {
    id: "d066", title: "Balanced Brackets", topic: "Stack", level: "Medium", kind: "str",
    statement: "The string contains only ( ) [ ] { }. Print 1 if every bracket is closed in the correct order, otherwise 0.",
    cases: ["()[]{}", "(]", "((("], hidden: ["{[()]}", "]"],
    bug: { type: "missing", note: "Brackets left open at the end are not detected." },
    py: L(`def solve(s):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        else:
            if not stack or stack.pop() != pairs[ch]:
                return 0
    return 1 if not stack else 0`, ["return 1 if not stack else 0", "return 1"]),
    js: L(`function solve(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[ch]) return 0;
    }
  }
  return stack.length === 0 ? 1 : 0;
}`, ["return stack.length === 0 ? 1 : 0;", "return 1;"]),
    c: L(`int solve(char s[]) {
    char st[1005];
    int top = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        char ch = s[i];
        if (ch == '(' || ch == '[' || ch == '{') {
            st[top++] = ch;
        } else {
            if (top == 0) return 0;
            char open = st[--top];
            if (ch == ')' && open != '(') return 0;
            if (ch == ']' && open != '[') return 0;
            if (ch == '}' && open != '{') return 0;
        }
    }
    return top == 0 ? 1 : 0;
}`, ["return top == 0 ? 1 : 0;", "return 1;"]),
    cpp: L(`int solve(string s) {
    char st[1005];
    int top = 0;
    for (char ch : s) {
        if (ch == '(' || ch == '[' || ch == '{') {
            st[top++] = ch;
        } else {
            if (top == 0) return 0;
            char open = st[--top];
            if (ch == ')' && open != '(') return 0;
            if (ch == ']' && open != '[') return 0;
            if (ch == '}' && open != '{') return 0;
        }
    }
    return top == 0 ? 1 : 0;
}`, ["return top == 0 ? 1 : 0;", "return 1;"]),
    java: L(`static int solve(String s) {
    char[] st = new char[1005];
    int top = 0;
    for (char ch : s.toCharArray()) {
        if (ch == '(' || ch == '[' || ch == '{') {
            st[top++] = ch;
        } else {
            if (top == 0) return 0;
            char open = st[--top];
            if (ch == ')' && open != '(') return 0;
            if (ch == ']' && open != '[') return 0;
            if (ch == '}' && open != '{') return 0;
        }
    }
    return top == 0 ? 1 : 0;
}`, ["return top == 0 ? 1 : 0;", "return 1;"])
  },
  {
    id: "d067", title: "Sum of Next Greater Elements", topic: "Stack", level: "Hard", kind: "ints",
    statement: "For each element find the first strictly greater element to its right (0 if none). Print the sum of these values. Use a monotonic stack.",
    cases: ["5 4 5 2 10 8", "3 3 2 1", "4 2 2 3 3"], hidden: ["1 5", "4 1 1 1 1"],
    bug: { type: "logic", note: "Equal values are treated as greater." },
    py: L(`def solve(a):
    n = len(a)
    res = [0] * n
    stack = []
    for i in range(n):
        while stack and a[stack[-1]] < a[i]:
            res[stack.pop()] = a[i]
        stack.append(i)
    total = 0
    for x in res:
        total += x
    return total`, ["a[stack[-1]] < a[i]", "a[stack[-1]] <= a[i]"]),
    js: L(`function solve(a) {
  const n = a.length;
  const res = new Array(n).fill(0);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && a[stack[stack.length - 1]] < a[i]) {
      res[stack.pop()] = a[i];
    }
    stack.push(i);
  }
  let total = 0;
  for (const x of res) total += x;
  return total;
}`, ["a[stack[stack.length - 1]] < a[i]", "a[stack[stack.length - 1]] <= a[i]"]),
    c: L(`int solve(int a[], int n) {
    int res[1005] = {0};
    int st[1005];
    int top = 0;
    for (int i = 0; i < n; i++) {
        while (top > 0 && a[st[top - 1]] < a[i]) {
            res[st[--top]] = a[i];
        }
        st[top++] = i;
    }
    int total = 0;
    for (int i = 0; i < n; i++) total += res[i];
    return total;
}`, ["a[st[top - 1]] < a[i]", "a[st[top - 1]] <= a[i]"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    vector<int> res(n, 0), st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && a[st.back()] < a[i]) {
            res[st.back()] = a[i];
            st.pop_back();
        }
        st.push_back(i);
    }
    int total = 0;
    for (int x : res) total += x;
    return total;
}`, ["a[st.back()] < a[i]", "a[st.back()] <= a[i]"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    int[] res = new int[n];
    int[] st = new int[n + 1];
    int top = 0;
    for (int i = 0; i < n; i++) {
        while (top > 0 && a[st[top - 1]] < a[i]) {
            res[st[--top]] = a[i];
        }
        st[top++] = i;
    }
    int total = 0;
    for (int x : res) total += x;
    return total;
}`, ["a[st[top - 1]] < a[i]", "a[st[top - 1]] <= a[i]"])
  },
  {
    id: "d068", title: "Days Until a Warmer Temperature", topic: "Stack", level: "Hard", kind: "ints",
    statement: "For each day print (conceptually) how many days you wait for a warmer temperature (0 if never). Print the SUM of these waits over all days.",
    cases: ["6 73 74 75 71 69 72", "3 30 40 50", "4 50 40 30 20"], hidden: ["1 9", "5 1 2 1 2 3"],
    bug: { type: "logic", note: "The wait is recorded as the absolute day index instead of the distance." },
    py: L(`def solve(a):
    n = len(a)
    res = [0] * n
    stack = []
    for i in range(n):
        while stack and a[stack[-1]] < a[i]:
            j = stack.pop()
            res[j] = i - j
        stack.append(i)
    total = 0
    for x in res:
        total += x
    return total`, ["res[j] = i - j", "res[j] = i"]),
    js: L(`function solve(a) {
  const n = a.length;
  const res = new Array(n).fill(0);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && a[stack[stack.length - 1]] < a[i]) {
      const j = stack.pop();
      res[j] = i - j;
    }
    stack.push(i);
  }
  let total = 0;
  for (const x of res) total += x;
  return total;
}`, ["res[j] = i - j;", "res[j] = i;"]),
    c: L(`int solve(int a[], int n) {
    int res[1005] = {0};
    int st[1005];
    int top = 0;
    for (int i = 0; i < n; i++) {
        while (top > 0 && a[st[top - 1]] < a[i]) {
            int j = st[--top];
            res[j] = i - j;
        }
        st[top++] = i;
    }
    int total = 0;
    for (int i = 0; i < n; i++) total += res[i];
    return total;
}`, ["res[j] = i - j;", "res[j] = i;"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a.size();
    vector<int> res(n, 0), st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && a[st.back()] < a[i]) {
            int j = st.back();
            st.pop_back();
            res[j] = i - j;
        }
        st.push_back(i);
    }
    int total = 0;
    for (int x : res) total += x;
    return total;
}`, ["res[j] = i - j;", "res[j] = i;"]),
    java: L(`static int solve(int[] a) {
    int n = a.length;
    int[] res = new int[n];
    int[] st = new int[n + 1];
    int top = 0;
    for (int i = 0; i < n; i++) {
        while (top > 0 && a[st[top - 1]] < a[i]) {
            int j = st[--top];
            res[j] = i - j;
        }
        st[top++] = i;
    }
    int total = 0;
    for (int x : res) total += x;
    return total;
}`, ["res[j] = i - j;", "res[j] = i;"])
  },
  {
    id: "d069", title: "Josephus Survivor", topic: "Queue", level: "Medium", kind: "ints",
    statement: "n people stand in a circle numbered 1..n. Starting at person 1, every k-th person is removed until one remains. The array holds n then k. Print the survivor's number.",
    cases: ["2 5 2", "2 7 3", "2 1 1"], hidden: ["2 6 1", "2 10 4"],
    bug: { type: "logic", note: "The counting step is off by one, so the wrong person is removed." },
    py: L(`def solve(a):
    n = a[0]
    k = a[1]
    people = list(range(1, n + 1))
    idx = 0
    while len(people) > 1:
        idx = (idx + k - 1) % len(people)
        people.pop(idx)
    return people[0]`, ["(idx + k - 1)", "(idx + k)"]),
    js: L(`function solve(a) {
  const n = a[0], k = a[1];
  const people = [];
  for (let i = 1; i <= n; i++) people.push(i);
  let idx = 0;
  while (people.length > 1) {
    idx = (idx + k - 1) % people.length;
    people.splice(idx, 1);
  }
  return people[0];
}`, ["(idx + k - 1)", "(idx + k)"]),
    c: L(`int solve(int a[], int n0) {
    int n = a[0], k = a[1];
    int people[1005];
    for (int i = 0; i < n; i++) people[i] = i + 1;
    int size = n, idx = 0;
    while (size > 1) {
        idx = (idx + k - 1) % size;
        for (int j = idx; j < size - 1; j++) people[j] = people[j + 1];
        size--;
    }
    return people[0];
}`, ["(idx + k - 1)", "(idx + k)"]),
    cpp: L(`int solve(vector<int>& a) {
    int n = a[0], k = a[1];
    vector<int> people;
    for (int i = 1; i <= n; i++) people.push_back(i);
    int idx = 0;
    while (people.size() > 1) {
        idx = (idx + k - 1) % people.size();
        people.erase(people.begin() + idx);
    }
    return people[0];
}`, ["(idx + k - 1)", "(idx + k)"]),
    java: L(`static int solve(int[] a) {
    int n = a[0], k = a[1];
    List<Integer> people = new ArrayList<>();
    for (int i = 1; i <= n; i++) people.add(i);
    int idx = 0;
    while (people.size() > 1) {
        idx = (idx + k - 1) % people.size();
        people.remove(idx);
    }
    return people.get(0);
}`, ["(idx + k - 1)", "(idx + k)"])
  },
  {
    id: "d070", title: "Evaluate a Postfix Expression", topic: "Stack", level: "Medium", kind: "str",
    statement: "The string is a postfix expression of single digits and the operators + - *. Print its value. For a - b the operands appear as a b -.",
    cases: ["23+", "93-", "234*+"], hidden: ["95-2*", "7"],
    bug: { type: "logic", note: "The operands of subtraction are taken in the wrong order." },
    py: L(`def solve(s):
    stack = []
    for ch in s:
        if "0" <= ch <= "9":
            stack.append(int(ch))
        else:
            b = stack.pop()
            a = stack.pop()
            if ch == "+":
                stack.append(a + b)
            elif ch == "-":
                stack.append(a - b)
            else:
                stack.append(a * b)
    return stack[0]`, ["stack.append(a - b)", "stack.append(b - a)"]),
    js: L(`function solve(s) {
  const stack = [];
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      stack.push(ch.charCodeAt(0) - 48);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (ch === "+") stack.push(a + b);
      else if (ch === "-") stack.push(a - b);
      else stack.push(a * b);
    }
  }
  return stack[0];
}`, ["stack.push(a - b);", "stack.push(b - a);"]),
    c: L(`int solve(char s[]) {
    int st[1005];
    int top = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        char ch = s[i];
        if (ch >= '0' && ch <= '9') {
            st[top++] = ch - '0';
        } else {
            int b = st[--top];
            int a = st[--top];
            if (ch == '+') st[top++] = a + b;
            else if (ch == '-') st[top++] = a - b;
            else st[top++] = a * b;
        }
    }
    return st[0];
}`, ["st[top++] = a - b;", "st[top++] = b - a;"]),
    cpp: L(`int solve(string s) {
    vector<int> st;
    for (char ch : s) {
        if (ch >= '0' && ch <= '9') {
            st.push_back(ch - '0');
        } else {
            int b = st.back(); st.pop_back();
            int a = st.back(); st.pop_back();
            if (ch == '+') st.push_back(a + b);
            else if (ch == '-') st.push_back(a - b);
            else st.push_back(a * b);
        }
    }
    return st[0];
}`, ["st.push_back(a - b);", "st.push_back(b - a);"]),
    java: L(`static int solve(String s) {
    int[] st = new int[1005];
    int top = 0;
    for (char ch : s.toCharArray()) {
        if (ch >= '0' && ch <= '9') {
            st[top++] = ch - '0';
        } else {
            int b = st[--top];
            int a = st[--top];
            if (ch == '+') st[top++] = a + b;
            else if (ch == '-') st[top++] = a - b;
            else st[top++] = a * b;
        }
    }
    return st[0];
}`, ["st[top++] = a - b;", "st[top++] = b - a;"])
  }
];

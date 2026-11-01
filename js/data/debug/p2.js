// Batch 2: Strings (d021-d035) and Math (d036-d045)
const L = (code, ...pairs) => [code, pairs];

export const BATCH2 = [
  {
    id: "d021", title: "Count Vowels", topic: "Strings", level: "Easy", kind: "str",
    statement: "Given a lowercase string, print how many of its characters are vowels (a, e, i, o, u).",
    cases: ["education", "rhythm", "aeiou"], hidden: ["queue", "xyz"],
    bug: { type: "logic", note: "One vowel is missing from the check." },
    py: L(`def solve(s):
    count = 0
    for ch in s:
        if ch in "aeiou":
            count += 1
    return count`, ["aeiou", "aeio"]),
    js: L(`function solve(s) {
  let count = 0;
  for (const ch of s) {
    if ("aeiou".includes(ch)) count++;
  }
  return count;
}`, ["aeiou", "aeio"]),
    c: L(`int solve(char s[]) {
    int count = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        if (strchr("aeiou", s[i])) count++;
    }
    return count;
}`, ["aeiou", "aeio"]),
    cpp: L(`int solve(string s) {
    int count = 0;
    for (char ch : s) {
        if (string("aeiou").find(ch) != string::npos) count++;
    }
    return count;
}`, ["aeiou", "aeio"]),
    java: L(`static int solve(String s) {
    int count = 0;
    for (char ch : s.toCharArray()) {
        if ("aeiou".indexOf(ch) >= 0) count++;
    }
    return count;
}`, ["aeiou", "aeio"])
  },
  {
    id: "d022", title: "Palindrome Check", topic: "Strings", level: "Easy", kind: "str",
    statement: "Print 1 if the string reads the same forwards and backwards, otherwise print 0.",
    cases: ["racecar", "hello", "a"], hidden: ["abba", "abca"],
    bug: { type: "logic", note: "The right pointer starts one position past the last character." },
    py: L(`def solve(s):
    i = 0
    j = len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return 0
        i += 1
        j -= 1
    return 1`, ["j = len(s) - 1", "j = len(s)"]),
    js: L(`function solve(s) {
  let i = 0;
  let j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return 0;
    i++;
    j--;
  }
  return 1;
}`, ["s.length - 1", "s.length"]),
    c: L(`int solve(char s[]) {
    int i = 0, j = (int)strlen(s) - 1;
    while (i < j) {
        if (s[i] != s[j]) return 0;
        i++;
        j--;
    }
    return 1;
}`, ["(int)strlen(s) - 1", "(int)strlen(s)"]),
    cpp: L(`int solve(string s) {
    int i = 0, j = (int)s.size() - 1;
    while (i < j) {
        if (s[i] != s[j]) return 0;
        i++;
        j--;
    }
    return 1;
}`, ["(int)s.size() - 1", "(int)s.size()"]),
    java: L(`static int solve(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        if (s.charAt(i) != s.charAt(j)) return 0;
        i++;
        j--;
    }
    return 1;
}`, ["s.length() - 1", "s.length()"])
  },
  {
    id: "d023", title: "Is It the Reverse?", topic: "Strings", level: "Easy", kind: "str2",
    statement: "Given strings s and t, print 1 if t is exactly s reversed, otherwise print 0.",
    cases: ["abc cba", "abc abc", "ab abc"], hidden: ["a a", "abcd dcba"],
    bug: { type: "logic", note: "t is indexed from the front instead of from the back." },
    py: L(`def solve(s, t):
    if len(s) != len(t):
        return 0
    n = len(s)
    for i in range(n):
        if s[i] != t[n - 1 - i]:
            return 0
    return 1`, ["t[n - 1 - i]", "t[i]"]),
    js: L(`function solve(s, t) {
  if (s.length !== t.length) return 0;
  const n = s.length;
  for (let i = 0; i < n; i++) {
    if (s[i] !== t[n - 1 - i]) return 0;
  }
  return 1;
}`, ["t[n - 1 - i]", "t[i]"]),
    c: L(`int solve(char s[], char t[]) {
    int n = (int)strlen(s);
    if (n != (int)strlen(t)) return 0;
    for (int i = 0; i < n; i++) {
        if (s[i] != t[n - 1 - i]) return 0;
    }
    return 1;
}`, ["t[n - 1 - i]", "t[i]"]),
    cpp: L(`int solve(string s, string t) {
    if (s.size() != t.size()) return 0;
    int n = s.size();
    for (int i = 0; i < n; i++) {
        if (s[i] != t[n - 1 - i]) return 0;
    }
    return 1;
}`, ["t[n - 1 - i]", "t[i]"]),
    java: L(`static int solve(String s, String t) {
    if (s.length() != t.length()) return 0;
    int n = s.length();
    for (int i = 0; i < n; i++) {
        if (s.charAt(i) != t.charAt(n - 1 - i)) return 0;
    }
    return 1;
}`, ["t.charAt(n - 1 - i)", "t.charAt(i)"])
  },
  {
    id: "d024", title: "Anagram Check", topic: "Strings", level: "Medium", kind: "str2",
    statement: "Two lowercase strings are anagrams if they contain the same letters with the same counts. Print 1 if s and t are anagrams, otherwise 0.",
    cases: ["listen silent", "abc abd", "aab aba"], hidden: ["a b", "abcd dcba"],
    bug: { type: "logic", note: "The second string is added to the counts instead of subtracted." },
    py: L(`def solve(s, t):
    if len(s) != len(t):
        return 0
    cnt = [0] * 26
    for ch in s:
        cnt[ord(ch) - 97] += 1
    for ch in t:
        cnt[ord(ch) - 97] -= 1
    for c in cnt:
        if c != 0:
            return 0
    return 1`, ["cnt[ord(ch) - 97] -= 1", "cnt[ord(ch) - 97] += 1"]),
    js: L(`function solve(s, t) {
  if (s.length !== t.length) return 0;
  const cnt = new Array(26).fill(0);
  for (const ch of s) cnt[ch.charCodeAt(0) - 97]++;
  for (const ch of t) cnt[ch.charCodeAt(0) - 97]--;
  for (const c of cnt) {
    if (c !== 0) return 0;
  }
  return 1;
}`, ["cnt[ch.charCodeAt(0) - 97]--;", "cnt[ch.charCodeAt(0) - 97]++;"]),
    c: L(`int solve(char s[], char t[]) {
    int n = (int)strlen(s);
    if (n != (int)strlen(t)) return 0;
    int cnt[26] = {0};
    for (int i = 0; i < n; i++) cnt[s[i] - 'a']++;
    for (int i = 0; i < n; i++) cnt[t[i] - 'a']--;
    for (int i = 0; i < 26; i++) {
        if (cnt[i] != 0) return 0;
    }
    return 1;
}`, ["cnt[t[i] - 'a']--;", "cnt[t[i] - 'a']++;"]),
    cpp: L(`int solve(string s, string t) {
    if (s.size() != t.size()) return 0;
    vector<int> cnt(26, 0);
    for (char ch : s) cnt[ch - 'a']++;
    for (char ch : t) cnt[ch - 'a']--;
    for (int c : cnt) {
        if (c != 0) return 0;
    }
    return 1;
}`, ["for (char ch : t) cnt[ch - 'a']--;", "for (char ch : t) cnt[ch - 'a']++;"]),
    java: L(`static int solve(String s, String t) {
    if (s.length() != t.length()) return 0;
    int[] cnt = new int[26];
    for (char ch : s.toCharArray()) cnt[ch - 'a']++;
    for (char ch : t.toCharArray()) cnt[ch - 'a']--;
    for (int c : cnt) {
        if (c != 0) return 0;
    }
    return 1;
}`, ["for (char ch : t.toCharArray()) cnt[ch - 'a']--;", "for (char ch : t.toCharArray()) cnt[ch - 'a']++;"])
  },
  {
    id: "d025", title: "First Unique Character", topic: "Strings", level: "Easy", kind: "str",
    statement: "Print the index of the first character that appears exactly once in the lowercase string, or -1 if every character repeats.",
    cases: ["leetcode", "aabb", "loveleetcode"], hidden: ["z", "abcabc"],
    bug: { type: "logic", note: "The code returns the first REPEATED character instead of the first unique one." },
    py: L(`def solve(s):
    cnt = [0] * 26
    for ch in s:
        cnt[ord(ch) - 97] += 1
    for i in range(len(s)):
        if cnt[ord(s[i]) - 97] == 1:
            return i
    return -1`, ["== 1:", "> 1:"]),
    js: L(`function solve(s) {
  const cnt = new Array(26).fill(0);
  for (const ch of s) cnt[ch.charCodeAt(0) - 97]++;
  for (let i = 0; i < s.length; i++) {
    if (cnt[s.charCodeAt(i) - 97] === 1) return i;
  }
  return -1;
}`, ["=== 1)", "> 1)"]),
    c: L(`int solve(char s[]) {
    int cnt[26] = {0};
    int n = (int)strlen(s);
    for (int i = 0; i < n; i++) cnt[s[i] - 'a']++;
    for (int i = 0; i < n; i++) {
        if (cnt[s[i] - 'a'] == 1) return i;
    }
    return -1;
}`, ["== 1)", "> 1)"]),
    cpp: L(`int solve(string s) {
    vector<int> cnt(26, 0);
    for (char ch : s) cnt[ch - 'a']++;
    for (int i = 0; i < (int)s.size(); i++) {
        if (cnt[s[i] - 'a'] == 1) return i;
    }
    return -1;
}`, ["== 1)", "> 1)"]),
    java: L(`static int solve(String s) {
    int[] cnt = new int[26];
    for (char ch : s.toCharArray()) cnt[ch - 'a']++;
    for (int i = 0; i < s.length(); i++) {
        if (cnt[s.charAt(i) - 'a'] == 1) return i;
    }
    return -1;
}`, ["== 1)", "> 1)"])
  },
  {
    id: "d026", title: "Longest Common Prefix Length", topic: "Strings", level: "Easy", kind: "str2",
    statement: "Print the length of the longest common prefix of strings s and t.",
    cases: ["flower flow", "dog racecar", "abc abc"], hidden: ["a b", "interview internet"],
    bug: { type: "logic", note: "The index jumps by 2 so characters are skipped." },
    py: L(`def solve(s, t):
    n = min(len(s), len(t))
    i = 0
    while i < n and s[i] == t[i]:
        i += 1
    return i`, ["i += 1", "i += 2"]),
    js: L(`function solve(s, t) {
  const n = Math.min(s.length, t.length);
  let i = 0;
  while (i < n && s[i] === t[i]) i++;
  return i;
}`, ["i++;", "i += 2;"]),
    c: L(`int solve(char s[], char t[]) {
    int a = (int)strlen(s), b = (int)strlen(t);
    int n = a < b ? a : b;
    int i = 0;
    while (i < n && s[i] == t[i]) i++;
    return i;
}`, ["i++;", "i += 2;"]),
    cpp: L(`int solve(string s, string t) {
    int n = min(s.size(), t.size());
    int i = 0;
    while (i < n && s[i] == t[i]) i++;
    return i;
}`, ["i++;", "i += 2;"]),
    java: L(`static int solve(String s, String t) {
    int n = Math.min(s.length(), t.length());
    int i = 0;
    while (i < n && s.charAt(i) == t.charAt(i)) i++;
    return i;
}`, ["i++;", "i += 2;"])
  },
  {
    id: "d027", title: "Count Distinct Characters", topic: "Strings", level: "Easy", kind: "str",
    statement: "Given a lowercase string, print how many different letters it contains.",
    cases: ["hello", "aaaa", "abcabc"], hidden: ["z", "leetcode"],
    bug: { type: "missing", note: "A letter is never marked as seen, so repeats are counted again." },
    py: L(`def solve(s):
    seen = [False] * 26
    count = 0
    for ch in s:
        idx = ord(ch) - 97
        if not seen[idx]:
            seen[idx] = True
            count += 1
    return count`, ["seen[idx] = True", "pass"]),
    js: L(`function solve(s) {
  const seen = new Array(26).fill(false);
  let count = 0;
  for (const ch of s) {
    const idx = ch.charCodeAt(0) - 97;
    if (!seen[idx]) {
      seen[idx] = true;
      count++;
    }
  }
  return count;
}`, ["seen[idx] = true;", ""]),
    c: L(`int solve(char s[]) {
    int seen[26] = {0};
    int count = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        int idx = s[i] - 'a';
        if (!seen[idx]) {
            seen[idx] = 1;
            count++;
        }
    }
    return count;
}`, ["seen[idx] = 1;", ""]),
    cpp: L(`int solve(string s) {
    vector<bool> seen(26, false);
    int count = 0;
    for (char ch : s) {
        int idx = ch - 'a';
        if (!seen[idx]) {
            seen[idx] = true;
            count++;
        }
    }
    return count;
}`, ["seen[idx] = true;", ""]),
    java: L(`static int solve(String s) {
    boolean[] seen = new boolean[26];
    int count = 0;
    for (char ch : s.toCharArray()) {
        int idx = ch - 'a';
        if (!seen[idx]) {
            seen[idx] = true;
            count++;
        }
    }
    return count;
}`, ["seen[idx] = true;", ""])
  },
  {
    id: "d028", title: "Is Subsequence", topic: "Strings", level: "Medium", kind: "str2",
    statement: "Print 1 if s is a subsequence of t (s can be obtained by deleting characters from t without reordering), otherwise print 0. s is non-empty.",
    cases: ["abc ahbgdc", "axc ahbgdc", "a a"], hidden: ["abc ab", "ace abcde"],
    bug: { type: "logic", note: "The pointer in s advances without checking that the characters match." },
    py: L(`def solve(s, t):
    i = 0
    for ch in t:
        if i < len(s) and s[i] == ch:
            i += 1
    return 1 if i == len(s) else 0`, ["if i < len(s) and s[i] == ch:", "if i < len(s):"]),
    js: L(`function solve(s, t) {
  let i = 0;
  for (const ch of t) {
    if (i < s.length && s[i] === ch) i++;
  }
  return i === s.length ? 1 : 0;
}`, ["if (i < s.length && s[i] === ch) i++;", "if (i < s.length) i++;"]),
    c: L(`int solve(char s[], char t[]) {
    int i = 0, m = (int)strlen(s);
    for (int j = 0; t[j] != '\\0'; j++) {
        if (i < m && s[i] == t[j]) i++;
    }
    return i == m ? 1 : 0;
}`, ["if (i < m && s[i] == t[j]) i++;", "if (i < m) i++;"]),
    cpp: L(`int solve(string s, string t) {
    int i = 0, m = s.size();
    for (char ch : t) {
        if (i < m && s[i] == ch) i++;
    }
    return i == m ? 1 : 0;
}`, ["if (i < m && s[i] == ch) i++;", "if (i < m) i++;"]),
    java: L(`static int solve(String s, String t) {
    int i = 0, m = s.length();
    for (char ch : t.toCharArray()) {
        if (i < m && s.charAt(i) == ch) i++;
    }
    return i == m ? 1 : 0;
}`, ["if (i < m && s.charAt(i) == ch) i++;", "if (i < m) i++;"])
  },
  {
    id: "d029", title: "Count Substring Occurrences", topic: "Strings", level: "Medium", kind: "str2",
    statement: "Print how many times t occurs inside s. Overlapping occurrences all count (aaaa contains aa three times).",
    cases: ["abababa aba", "aaaa aa", "abc d"], hidden: ["abc abc", "abc abcd"],
    bug: { type: "logic", note: "The last possible starting position is never checked." },
    py: L(`def solve(s, t):
    count = 0
    m = len(t)
    for i in range(len(s) - m + 1):
        if s[i:i + m] == t:
            count += 1
    return count`, ["len(s) - m + 1", "len(s) - m"]),
    js: L(`function solve(s, t) {
  let count = 0;
  const m = t.length;
  for (let i = 0; i + m <= s.length; i++) {
    if (s.slice(i, i + m) === t) count++;
  }
  return count;
}`, ["i + m <= s.length", "i + m < s.length"]),
    c: L(`int solve(char s[], char t[]) {
    int n = (int)strlen(s), m = (int)strlen(t), count = 0;
    for (int i = 0; i + m <= n; i++) {
        if (strncmp(s + i, t, m) == 0) count++;
    }
    return count;
}`, ["i + m <= n", "i + m < n"]),
    cpp: L(`int solve(string s, string t) {
    int n = s.size(), m = t.size(), count = 0;
    for (int i = 0; i + m <= n; i++) {
        if (s.compare(i, m, t) == 0) count++;
    }
    return count;
}`, ["i + m <= n", "i + m < n"]),
    java: L(`static int solve(String s, String t) {
    int n = s.length(), m = t.length(), count = 0;
    for (int i = 0; i + m <= n; i++) {
        if (s.startsWith(t, i)) count++;
    }
    return count;
}`, ["i + m <= n", "i + m < n"])
  },
  {
    id: "d030", title: "Count Uppercase Letters", topic: "Strings", level: "Easy", kind: "str",
    statement: "Given a string of letters, print how many are uppercase (A to Z).",
    cases: ["HeLLo", "abc", "ZZZ"], hidden: ["aBcDeF", "Z"],
    bug: { type: "logic", note: "The upper bound of the range excludes the letter Z." },
    py: L(`def solve(s):
    count = 0
    for ch in s:
        if "A" <= ch <= "Z":
            count += 1
    return count`, ['"A" <= ch <= "Z"', '"A" <= ch < "Z"']),
    js: L(`function solve(s) {
  let count = 0;
  for (const ch of s) {
    if (ch >= "A" && ch <= "Z") count++;
  }
  return count;
}`, ['ch <= "Z"', 'ch < "Z"']),
    c: L(`int solve(char s[]) {
    int count = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        if (s[i] >= 'A' && s[i] <= 'Z') count++;
    }
    return count;
}`, ["s[i] <= 'Z'", "s[i] < 'Z'"]),
    cpp: L(`int solve(string s) {
    int count = 0;
    for (char ch : s) {
        if (ch >= 'A' && ch <= 'Z') count++;
    }
    return count;
}`, ["ch <= 'Z'", "ch < 'Z'"]),
    java: L(`static int solve(String s) {
    int count = 0;
    for (char ch : s.toCharArray()) {
        if (ch >= 'A' && ch <= 'Z') count++;
    }
    return count;
}`, ["ch <= 'Z'", "ch < 'Z'"])
  },
  {
    id: "d031", title: "Sum of Digits in a String", topic: "Strings", level: "Easy", kind: "str",
    statement: "Given a string containing letters and digits, print the sum of the digit characters (letters are ignored).",
    cases: ["a1b2c3", "abc", "999"], hidden: ["0", "x9y"],
    bug: { type: "logic", note: "The character code is added instead of the digit value." },
    py: L(`def solve(s):
    total = 0
    for ch in s:
        if "0" <= ch <= "9":
            total += ord(ch) - ord("0")
    return total`, ['total += ord(ch) - ord("0")', "total += ord(ch)"]),
    js: L(`function solve(s) {
  let total = 0;
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") total += ch.charCodeAt(0) - 48;
  }
  return total;
}`, ["total += ch.charCodeAt(0) - 48;", "total += ch.charCodeAt(0);"]),
    c: L(`int solve(char s[]) {
    int total = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        if (s[i] >= '0' && s[i] <= '9') total += s[i] - '0';
    }
    return total;
}`, ["total += s[i] - '0';", "total += s[i];"]),
    cpp: L(`int solve(string s) {
    int total = 0;
    for (char ch : s) {
        if (ch >= '0' && ch <= '9') total += ch - '0';
    }
    return total;
}`, ["total += ch - '0';", "total += ch;"]),
    java: L(`static int solve(String s) {
    int total = 0;
    for (char ch : s.toCharArray()) {
        if (ch >= '0' && ch <= '9') total += ch - '0';
    }
    return total;
}`, ["total += ch - '0';", "total += ch;"])
  },
  {
    id: "d032", title: "Is Rotation", topic: "Strings", level: "Medium", kind: "str2",
    statement: "Print 1 if t can be obtained by rotating s (moving some leading characters to the end), otherwise 0. A rotation by 0 positions counts.",
    cases: ["abcde cdeab", "abc acb", "abc abc"], hidden: ["a a", "abcd dabc"],
    bug: { type: "logic", note: "The zero-shift rotation is never tried." },
    py: L(`def solve(s, t):
    n = len(s)
    if n != len(t):
        return 0
    for shift in range(n):
        ok = True
        for i in range(n):
            if s[(i + shift) % n] != t[i]:
                ok = False
                break
        if ok:
            return 1
    return 0`, ["for shift in range(n):", "for shift in range(1, n):"]),
    js: L(`function solve(s, t) {
  const n = s.length;
  if (n !== t.length) return 0;
  for (let shift = 0; shift < n; shift++) {
    let ok = true;
    for (let i = 0; i < n; i++) {
      if (s[(i + shift) % n] !== t[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return 1;
  }
  return 0;
}`, ["let shift = 0;", "let shift = 1;"]),
    c: L(`int solve(char s[], char t[]) {
    int n = (int)strlen(s);
    if (n != (int)strlen(t)) return 0;
    for (int shift = 0; shift < n; shift++) {
        int ok = 1;
        for (int i = 0; i < n; i++) {
            if (s[(i + shift) % n] != t[i]) {
                ok = 0;
                break;
            }
        }
        if (ok) return 1;
    }
    return 0;
}`, ["int shift = 0;", "int shift = 1;"]),
    cpp: L(`int solve(string s, string t) {
    int n = s.size();
    if (n != (int)t.size()) return 0;
    for (int shift = 0; shift < n; shift++) {
        bool ok = true;
        for (int i = 0; i < n; i++) {
            if (s[(i + shift) % n] != t[i]) {
                ok = false;
                break;
            }
        }
        if (ok) return 1;
    }
    return 0;
}`, ["int shift = 0;", "int shift = 1;"]),
    java: L(`static int solve(String s, String t) {
    int n = s.length();
    if (n != t.length()) return 0;
    for (int shift = 0; shift < n; shift++) {
        boolean ok = true;
        for (int i = 0; i < n; i++) {
            if (s.charAt((i + shift) % n) != t.charAt(i)) {
                ok = false;
                break;
            }
        }
        if (ok) return 1;
    }
    return 0;
}`, ["int shift = 0;", "int shift = 1;"])
  },
  {
    id: "d033", title: "Hamming Distance", topic: "Strings", level: "Easy", kind: "str2",
    statement: "Given two strings of equal length, print the number of positions where the characters differ.",
    cases: ["karolin kathrin", "abc abc", "aaaa bbbb"], hidden: ["a b", "abcd abzd"],
    bug: { type: "logic", note: "The comparison is inverted and counts the matches." },
    py: L(`def solve(s, t):
    count = 0
    for i in range(len(s)):
        if s[i] != t[i]:
            count += 1
    return count`, ["s[i] != t[i]", "s[i] == t[i]"]),
    js: L(`function solve(s, t) {
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== t[i]) count++;
  }
  return count;
}`, ["s[i] !== t[i]", "s[i] === t[i]"]),
    c: L(`int solve(char s[], char t[]) {
    int count = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        if (s[i] != t[i]) count++;
    }
    return count;
}`, ["s[i] != t[i]", "s[i] == t[i]"]),
    cpp: L(`int solve(string s, string t) {
    int count = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        if (s[i] != t[i]) count++;
    }
    return count;
}`, ["s[i] != t[i]", "s[i] == t[i]"]),
    java: L(`static int solve(String s, String t) {
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) != t.charAt(i)) count++;
    }
    return count;
}`, ["s.charAt(i) != t.charAt(i)", "s.charAt(i) == t.charAt(i)"])
  },
  {
    id: "d034", title: "Binary String to Integer", topic: "Strings", level: "Easy", kind: "str",
    statement: "Given a string of 0s and 1s, print its value as a binary number (at most 30 digits).",
    cases: ["101", "0", "1111"], hidden: ["10000000", "1"],
    bug: { type: "logic", note: "The base is wrong: shifting by 10 instead of 2." },
    py: L(`def solve(s):
    result = 0
    for ch in s:
        result = result * 2 + (ord(ch) - ord("0"))
    return result`, ["result * 2", "result * 10"]),
    js: L(`function solve(s) {
  let result = 0;
  for (const ch of s) {
    result = result * 2 + (ch.charCodeAt(0) - 48);
  }
  return result;
}`, ["result * 2", "result * 10"]),
    c: L(`int solve(char s[]) {
    int result = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        result = result * 2 + (s[i] - '0');
    }
    return result;
}`, ["result * 2", "result * 10"]),
    cpp: L(`int solve(string s) {
    int result = 0;
    for (char ch : s) {
        result = result * 2 + (ch - '0');
    }
    return result;
}`, ["result * 2", "result * 10"]),
    java: L(`static int solve(String s) {
    int result = 0;
    for (char ch : s.toCharArray()) {
        result = result * 2 + (ch - '0');
    }
    return result;
}`, ["result * 2", "result * 10"])
  },
  {
    id: "d035", title: "Adjacent Equal Pairs", topic: "Strings", level: "Easy", kind: "str",
    statement: "Print how many positions i have s[i] equal to s[i+1].",
    cases: ["aabbb", "abc", "aaaa"], hidden: ["a", "aab"],
    bug: { type: "logic", note: "The loop starts at index 1 and skips the first pair." },
    py: L(`def solve(s):
    count = 0
    for i in range(len(s) - 1):
        if s[i] == s[i + 1]:
            count += 1
    return count`, ["range(len(s) - 1)", "range(1, len(s) - 1)"]),
    js: L(`function solve(s) {
  let count = 0;
  for (let i = 0; i + 1 < s.length; i++) {
    if (s[i] === s[i + 1]) count++;
  }
  return count;
}`, ["let i = 0;", "let i = 1;"]),
    c: L(`int solve(char s[]) {
    int count = 0, n = (int)strlen(s);
    for (int i = 0; i + 1 < n; i++) {
        if (s[i] == s[i + 1]) count++;
    }
    return count;
}`, ["int i = 0;", "int i = 1;"]),
    cpp: L(`int solve(string s) {
    int count = 0;
    for (int i = 0; i + 1 < (int)s.size(); i++) {
        if (s[i] == s[i + 1]) count++;
    }
    return count;
}`, ["int i = 0;", "int i = 1;"]),
    java: L(`static int solve(String s) {
    int count = 0;
    for (int i = 0; i + 1 < s.length(); i++) {
        if (s.charAt(i) == s.charAt(i + 1)) count++;
    }
    return count;
}`, ["int i = 0;", "int i = 1;"])
  },

  {
    id: "d036", title: "GCD of Two Numbers", topic: "Math", level: "Easy", kind: "ints",
    statement: "The array holds exactly two non-negative integers. Print their greatest common divisor (gcd(x, 0) = x).",
    cases: ["2 12 18", "2 7 3", "2 100 75"], hidden: ["2 5 0", "2 17 17"],
    bug: { type: "logic", note: "The Euclid loop stops too early." },
    py: L(`def solve(a):
    x = a[0]
    y = a[1]
    while y != 0:
        x, y = y, x % y
    return x`, ["while y != 0:", "while y > 1:"]),
    js: L(`function solve(a) {
  let x = a[0], y = a[1];
  while (y !== 0) {
    const tmp = y;
    y = x % y;
    x = tmp;
  }
  return x;
}`, ["while (y !== 0)", "while (y > 1)"]),
    c: L(`int solve(int a[], int n) {
    int x = a[0], y = a[1];
    while (y != 0) {
        int tmp = y;
        y = x % y;
        x = tmp;
    }
    return x;
}`, ["while (y != 0)", "while (y > 1)"]),
    cpp: L(`int solve(vector<int>& a) {
    int x = a[0], y = a[1];
    while (y != 0) {
        int tmp = y;
        y = x % y;
        x = tmp;
    }
    return x;
}`, ["while (y != 0)", "while (y > 1)"]),
    java: L(`static int solve(int[] a) {
    int x = a[0], y = a[1];
    while (y != 0) {
        int tmp = y;
        y = x % y;
        x = tmp;
    }
    return x;
}`, ["while (y != 0)", "while (y > 1)"])
  },
  {
    id: "d037", title: "Is Prime", topic: "Math", level: "Easy", kind: "int",
    statement: "Print 1 if n is a prime number, otherwise 0. Numbers below 2 are not prime.",
    cases: ["7", "9", "1"], hidden: ["2", "49"],
    bug: { type: "logic", note: "Perfect squares of primes slip through the divisor loop." },
    py: L(`def solve(n):
    if n < 2:
        return 0
    i = 2
    while i * i <= n:
        if n % i == 0:
            return 0
        i += 1
    return 1`, ["i * i <= n", "i * i < n"]),
    js: L(`function solve(n) {
  if (n < 2) return 0;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return 0;
  }
  return 1;
}`, ["i * i <= n", "i * i < n"]),
    c: L(`int solve(int n) {
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}`, ["i * i <= n", "i * i < n"]),
    cpp: L(`int solve(int n) {
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}`, ["i * i <= n", "i * i < n"]),
    java: L(`static int solve(int n) {
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}`, ["i * i <= n", "i * i < n"])
  },
  {
    id: "d038", title: "Factorial", topic: "Math", level: "Easy", kind: "int",
    statement: "Print n! for 0 <= n <= 12 (0! = 1).",
    cases: ["5", "0", "10"], hidden: ["1", "12"],
    bug: { type: "logic", note: "The loop never multiplies by n itself." },
    py: L(`def solve(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result`, ["range(1, n + 1)", "range(1, n)"]),
    js: L(`function solve(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}`, ["i <= n;", "i < n;"]),
    c: L(`int solve(int n) {
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}`, ["i <= n;", "i < n;"]),
    cpp: L(`int solve(int n) {
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}`, ["i <= n;", "i < n;"]),
    java: L(`static int solve(int n) {
    int result = 1;
    for (int i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}`, ["i <= n;", "i < n;"])
  },
  {
    id: "d039", title: "n-th Fibonacci Number", topic: "Math", level: "Easy", kind: "int",
    statement: "Print the n-th Fibonacci number with F(0) = 0 and F(1) = 1, for 0 <= n <= 40.",
    cases: ["10", "0", "1"], hidden: ["2", "40"],
    bug: { type: "logic", note: "The starting pair is wrong." },
    py: L(`def solve(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`, ["a, b = 0, 1", "a, b = 1, 1"]),
    js: L(`function solve(n) {
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    const t = a + b;
    a = b;
    b = t;
  }
  return a;
}`, ["let a = 0, b = 1;", "let a = 1, b = 1;"]),
    c: L(`int solve(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int t = a + b;
        a = b;
        b = t;
    }
    return a;
}`, ["int a = 0, b = 1;", "int a = 1, b = 1;"]),
    cpp: L(`int solve(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int t = a + b;
        a = b;
        b = t;
    }
    return a;
}`, ["int a = 0, b = 1;", "int a = 1, b = 1;"]),
    java: L(`static int solve(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int t = a + b;
        a = b;
        b = t;
    }
    return a;
}`, ["int a = 0, b = 1;", "int a = 1, b = 1;"])
  },
  {
    id: "d040", title: "Sum of Digits", topic: "Math", level: "Easy", kind: "int",
    statement: "Print the sum of the decimal digits of n (n >= 0).",
    cases: ["123", "0", "9999"], hidden: ["5", "100"],
    bug: { type: "logic", note: "n is divided by the wrong number so digits are skipped." },
    py: L(`def solve(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total`, ["n //= 10", "n //= 100"]),
    js: L(`function solve(n) {
  let total = 0;
  while (n > 0) {
    total += n % 10;
    n = Math.floor(n / 10);
  }
  return total;
}`, ["Math.floor(n / 10)", "Math.floor(n / 100)"]),
    c: L(`int solve(int n) {
    int total = 0;
    while (n > 0) {
        total += n % 10;
        n /= 10;
    }
    return total;
}`, ["n /= 10;", "n /= 100;"]),
    cpp: L(`int solve(int n) {
    int total = 0;
    while (n > 0) {
        total += n % 10;
        n /= 10;
    }
    return total;
}`, ["n /= 10;", "n /= 100;"]),
    java: L(`static int solve(int n) {
    int total = 0;
    while (n > 0) {
        total += n % 10;
        n /= 10;
    }
    return total;
}`, ["n /= 10;", "n /= 100;"])
  },
  {
    id: "d041", title: "Reverse a Number", topic: "Math", level: "Easy", kind: "int",
    statement: "Print the number formed by reversing the digits of n (n >= 0). Trailing zeros disappear: 1200 becomes 21.",
    cases: ["123", "1200", "5"], hidden: ["0", "9"],
    bug: { type: "missing", note: "The accumulated reverse is never shifted left by a digit." },
    py: L(`def solve(n):
    rev = 0
    while n > 0:
        rev = rev * 10 + n % 10
        n //= 10
    return rev`, ["rev = rev * 10 + n % 10", "rev = rev + n % 10"]),
    js: L(`function solve(n) {
  let rev = 0;
  while (n > 0) {
    rev = rev * 10 + (n % 10);
    n = Math.floor(n / 10);
  }
  return rev;
}`, ["rev = rev * 10 + (n % 10);", "rev = rev + (n % 10);"]),
    c: L(`int solve(int n) {
    int rev = 0;
    while (n > 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    return rev;
}`, ["rev = rev * 10 + n % 10;", "rev = rev + n % 10;"]),
    cpp: L(`int solve(int n) {
    int rev = 0;
    while (n > 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    return rev;
}`, ["rev = rev * 10 + n % 10;", "rev = rev + n % 10;"]),
    java: L(`static int solve(int n) {
    int rev = 0;
    while (n > 0) {
        rev = rev * 10 + n % 10;
        n /= 10;
    }
    return rev;
}`, ["rev = rev * 10 + n % 10;", "rev = rev + n % 10;"])
  },
  {
    id: "d042", title: "Integer Power", topic: "Math", level: "Easy", kind: "ints",
    statement: "The array holds two integers: base b and exponent e (e >= 0). Print b raised to the power e. The result fits in a 32-bit integer.",
    cases: ["2 2 10", "2 3 0", "2 5 3"], hidden: ["2 1 20", "2 10 5"],
    bug: { type: "logic", note: "The loop adds the base instead of multiplying." },
    py: L(`def solve(a):
    result = 1
    for _ in range(a[1]):
        result *= a[0]
    return result`, ["result *= a[0]", "result += a[0]"]),
    js: L(`function solve(a) {
  let result = 1;
  for (let i = 0; i < a[1]; i++) {
    result *= a[0];
  }
  return result;
}`, ["result *= a[0];", "result += a[0];"]),
    c: L(`int solve(int a[], int n) {
    int result = 1;
    for (int i = 0; i < a[1]; i++) {
        result *= a[0];
    }
    return result;
}`, ["result *= a[0];", "result += a[0];"]),
    cpp: L(`int solve(vector<int>& a) {
    int result = 1;
    for (int i = 0; i < a[1]; i++) {
        result *= a[0];
    }
    return result;
}`, ["result *= a[0];", "result += a[0];"]),
    java: L(`static int solve(int[] a) {
    int result = 1;
    for (int i = 0; i < a[1]; i++) {
        result *= a[0];
    }
    return result;
}`, ["result *= a[0];", "result += a[0];"])
  },
  {
    id: "d043", title: "Count Primes up to n", topic: "Math", level: "Medium", kind: "int",
    statement: "Print how many prime numbers are <= n.",
    cases: ["10", "2", "1"], hidden: ["30", "100"],
    bug: { type: "logic", note: "The loop starts at 1, which is not prime." },
    py: L(`def solve(n):
    count = 0
    for x in range(2, n + 1):
        prime = True
        i = 2
        while i * i <= x:
            if x % i == 0:
                prime = False
                break
            i += 1
        if prime:
            count += 1
    return count`, ["range(2, n + 1)", "range(1, n + 1)"]),
    js: L(`function solve(n) {
  let count = 0;
  for (let x = 2; x <= n; x++) {
    let prime = true;
    for (let i = 2; i * i <= x; i++) {
      if (x % i === 0) {
        prime = false;
        break;
      }
    }
    if (prime) count++;
  }
  return count;
}`, ["let x = 2;", "let x = 1;"]),
    c: L(`int solve(int n) {
    int count = 0;
    for (int x = 2; x <= n; x++) {
        int prime = 1;
        for (int i = 2; i * i <= x; i++) {
            if (x % i == 0) {
                prime = 0;
                break;
            }
        }
        if (prime) count++;
    }
    return count;
}`, ["int x = 2;", "int x = 1;"]),
    cpp: L(`int solve(int n) {
    int count = 0;
    for (int x = 2; x <= n; x++) {
        bool prime = true;
        for (int i = 2; i * i <= x; i++) {
            if (x % i == 0) {
                prime = false;
                break;
            }
        }
        if (prime) count++;
    }
    return count;
}`, ["int x = 2;", "int x = 1;"]),
    java: L(`static int solve(int n) {
    int count = 0;
    for (int x = 2; x <= n; x++) {
        boolean prime = true;
        for (int i = 2; i * i <= x; i++) {
            if (x % i == 0) {
                prime = false;
                break;
            }
        }
        if (prime) count++;
    }
    return count;
}`, ["int x = 2;", "int x = 1;"])
  },
  {
    id: "d044", title: "Count Set Bits", topic: "Math", level: "Easy", kind: "int",
    statement: "Print the number of 1 bits in the binary representation of n (n >= 0).",
    cases: ["5", "8", "255"], hidden: ["0", "1023"],
    bug: { type: "logic", note: "Every bit is counted instead of only the 1 bits." },
    py: L(`def solve(n):
    count = 0
    while n > 0:
        count += n % 2
        n //= 2
    return count`, ["count += n % 2", "count += 1"]),
    js: L(`function solve(n) {
  let count = 0;
  while (n > 0) {
    count += n % 2;
    n = Math.floor(n / 2);
  }
  return count;
}`, ["count += n % 2;", "count += 1;"]),
    c: L(`int solve(int n) {
    int count = 0;
    while (n > 0) {
        count += n % 2;
        n /= 2;
    }
    return count;
}`, ["count += n % 2;", "count += 1;"]),
    cpp: L(`int solve(int n) {
    int count = 0;
    while (n > 0) {
        count += n % 2;
        n /= 2;
    }
    return count;
}`, ["count += n % 2;", "count += 1;"]),
    java: L(`static int solve(int n) {
    int count = 0;
    while (n > 0) {
        count += n % 2;
        n /= 2;
    }
    return count;
}`, ["count += n % 2;", "count += 1;"])
  },
  {
    id: "d045", title: "LCM of Two Numbers", topic: "Math", level: "Medium", kind: "ints",
    statement: "The array holds two positive integers. Print their least common multiple. The result fits in a 32-bit integer.",
    cases: ["2 4 6", "2 5 7", "2 12 12"], hidden: ["2 1 9", "2 21 6"],
    bug: { type: "missing", note: "The product is never divided by the gcd." },
    py: L(`def solve(a):
    x = a[0]
    y = a[1]
    while y != 0:
        x, y = y, x % y
    return a[0] // x * a[1]`, ["a[0] // x * a[1]", "a[0] * a[1]"]),
    js: L(`function solve(a) {
  let x = a[0], y = a[1];
  while (y !== 0) {
    const tmp = y;
    y = x % y;
    x = tmp;
  }
  return Math.floor(a[0] / x) * a[1];
}`, ["Math.floor(a[0] / x) * a[1]", "a[0] * a[1]"]),
    c: L(`int solve(int a[], int n) {
    int x = a[0], y = a[1];
    while (y != 0) {
        int tmp = y;
        y = x % y;
        x = tmp;
    }
    return a[0] / x * a[1];
}`, ["a[0] / x * a[1]", "a[0] * a[1]"]),
    cpp: L(`int solve(vector<int>& a) {
    int x = a[0], y = a[1];
    while (y != 0) {
        int tmp = y;
        y = x % y;
        x = tmp;
    }
    return a[0] / x * a[1];
}`, ["a[0] / x * a[1]", "a[0] * a[1]"]),
    java: L(`static int solve(int[] a) {
    int x = a[0], y = a[1];
    while (y != 0) {
        int tmp = y;
        y = x % y;
        x = tmp;
    }
    return a[0] / x * a[1];
}`, ["a[0] / x * a[1]", "a[0] * a[1]"])
  }
];

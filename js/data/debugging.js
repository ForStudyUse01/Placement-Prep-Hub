// Debugging Arena question bank.
// Each item: id, lang, title, pattern, difficulty, buggy(code string), bugExplain, fixed(code string)
// JS items may include tests:[{input, expected}] run live via a sandboxed Function for instant pass/fail.
export const LANGS = ["Python", "Java", "C", "C++", "JavaScript"];

export const DEBUG_BANK = [
  // ---------------- PYTHON ----------------
  {
    id: "py-1", lang: "Python", title: "Mutable default argument", pattern: "Mutable default args",
    difficulty: "Medium",
    buggy: `def add_item(item, bucket=[]):
    bucket.append(item)
    return bucket

print(add_item(1))
print(add_item(2))`,
    bugExplain: "The default list is created ONCE at function-definition time and shared across every call that doesn't pass bucket explicitly. Expected [1] then [2]; actually prints [1] then [1, 2].",
    fixed: `def add_item(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket`
  },
  {
    id: "py-2", lang: "Python", title: "Off-by-one in range()", pattern: "Off-by-one / loop condition",
    difficulty: "Easy",
    buggy: `def sum_first_n(n):
    total = 0
    for i in range(1, n):
        total += i
    return total

print(sum_first_n(5))  # expected 15 (1+2+3+4+5)`,
    bugExplain: "range(1, n) stops at n-1, excluding n itself. Should be range(1, n+1) to include n.",
    fixed: `def sum_first_n(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total`
  },
  {
    id: "py-3", lang: "Python", title: "KeyError on dictionary access", pattern: "Incorrect dictionary key access",
    difficulty: "Easy",
    buggy: `def get_score(scores, name):
    return scores[name] * 2

scores = {"alice": 90, "bob": 85}
print(get_score(scores, "carol"))`,
    bugExplain: "Direct scores[name] raises KeyError when the key is missing. Use .get() with a default, or check membership first.",
    fixed: `def get_score(scores, name):
    return scores.get(name, 0) * 2`
  },
  {
    id: "py-4", lang: "Python", title: "Wrong recursion base case", pattern: "Wrong base case / infinite recursion",
    difficulty: "Medium",
    buggy: `def factorial(n):
    if n == 1:
        return 1
    return n * factorial(n - 1)

print(factorial(0))  # infinite-ish recursion: never hits n==1, goes negative`,
    bugExplain: "Base case only covers n==1, so factorial(0) recurses through negative numbers forever (RecursionError). Base case should cover n<=1.",
    fixed: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`
  },
  {
    id: "py-5", lang: "Python", title: "List slicing off-by-one", pattern: "Incorrect list slicing",
    difficulty: "Easy",
    buggy: `def last_three(items):
    return items[-3:-1]

print(last_three([1,2,3,4,5]))  # expected [3,4,5]`,
    bugExplain: "items[-3:-1] excludes the very last element (the end index is exclusive). Should be items[-3:] to include through the end.",
    fixed: `def last_three(items):
    return items[-3:]`
  },
  {
    id: "py-6", lang: "Python", title: "Type conversion crash", pattern: "Incorrect type conversion",
    difficulty: "Easy",
    buggy: `def average(nums_str):
    nums = [int(n) for n in nums_str]
    return sum(nums) / len(nums)

print(average(["1", "2", "3.5"]))`,
    bugExplain: "int('3.5') raises ValueError — the string contains a decimal. Use float() when inputs may be non-integer.",
    fixed: `def average(nums_str):
    nums = [float(n) for n in nums_str]
    return sum(nums) / len(nums)`
  },
  {
    id: "py-7", lang: "Python", title: "Circular array index wrap", pattern: "Circular array / modulo",
    difficulty: "Medium",
    buggy: `def rotate_view(arr, start, count):
    result = []
    for i in range(count):
        idx = (start + i) % (len(arr) - 1)
        result.append(arr[idx])
    return result

print(rotate_view([10,20,30,40,50], 3, 5))`,
    bugExplain: "Modulo base should be len(arr), not len(arr)-1 — using -1 skips the last element and wraps one index early.",
    fixed: `def rotate_view(arr, start, count):
    result = []
    for i in range(count):
        idx = (start + i) % len(arr)
        result.append(arr[idx])
    return result`
  },
  {
    id: "py-8", lang: "Python", title: "Exception swallowed silently", pattern: "Unhandled / mis-handled exceptions",
    difficulty: "Medium",
    buggy: `def safe_divide(a, b):
    try:
        return a / b
    except:
        pass

print(safe_divide(10, 0))  # prints None, bug hides the real issue`,
    bugExplain: "Bare except: pass silently swallows every error (including typos/KeyboardInterrupt) and returns None with no signal. Catch the specific exception and return/raise meaningfully.",
    fixed: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None  # or raise a clear, specific error`
  },

  // ---------------- JAVA ----------------
  {
    id: "java-1", lang: "Java", title: "NullPointerException from unchecked null", pattern: "Null handling",
    difficulty: "Easy",
    buggy: `String name = getName(); // may return null
System.out.println(name.length());`,
    bugExplain: "Calling .length() on a potentially-null reference throws NullPointerException. Always null-check before dereferencing.",
    fixed: `String name = getName();
if (name != null) {
    System.out.println(name.length());
}`
  },
  {
    id: "java-2", lang: "Java", title: "ArrayIndexOutOfBoundsException", pattern: "Off-by-one / array bounds",
    difficulty: "Easy",
    buggy: `int[] arr = {1, 2, 3, 4, 5};
for (int i = 0; i <= arr.length; i++) {
    System.out.println(arr[i]);
}`,
    bugExplain: "Loop condition i <= arr.length allows i == arr.length, one past the last valid index (length-1). Use i < arr.length.",
    fixed: `int[] arr = {1, 2, 3, 4, 5};
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}`
  },
  {
    id: "java-3", lang: "Java", title: "Comparing objects with == instead of equals()", pattern: "Object comparison",
    difficulty: "Medium",
    buggy: `String a = new String("hi");
String b = new String("hi");
if (a == b) {
    System.out.println("equal");
} else {
    System.out.println("not equal");  // prints this — surprising to many
}`,
    bugExplain: "== compares object references, not content. Two separately-constructed String objects with the same text are different objects. Use .equals() for value comparison.",
    fixed: `if (a.equals(b)) {
    System.out.println("equal");
}`
  },
  {
    id: "java-4", lang: "Java", title: "Infinite loop from wrong update", pattern: "Incorrect loop condition",
    difficulty: "Medium",
    buggy: `int i = 10;
while (i > 0) {
    System.out.println(i);
    i++;  // should decrement, never terminates
}`,
    bugExplain: "The loop variable increases while the condition requires it to shrink toward 0 — infinite loop.",
    fixed: `int i = 10;
while (i > 0) {
    System.out.println(i);
    i--;
}`
  },
  {
    id: "java-5", lang: "Java", title: "Integer division truncation", pattern: "Type conversion",
    difficulty: "Easy",
    buggy: `int total = 7;
int count = 2;
double average = total / count;
System.out.println(average);  // prints 3.0, not 3.5`,
    bugExplain: "total/count is INTEGER division (7/2 = 3) before the result is widened to double. Cast one operand to double first.",
    fixed: `double average = (double) total / count;  // 3.5`
  },
  {
    id: "java-6", lang: "Java", title: "StringBuilder vs String concatenation in a loop", pattern: "Efficiency / common pitfall",
    difficulty: "Medium",
    buggy: `String result = "";
for (int i = 0; i < 10000; i++) {
    result += i;   // creates a new String object every iteration — O(n^2)
}`,
    bugExplain: "Each += on a String allocates a brand-new String (Strings are immutable in Java), making the loop O(n²). Use StringBuilder for O(n) accumulation.",
    fixed: `StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}
String result = sb.toString();`
  },
  {
    id: "java-7", lang: "Java", title: "ClassCastException from unsafe cast", pattern: "Type errors",
    difficulty: "Medium",
    buggy: `Object obj = "hello";
Integer num = (Integer) obj;  // obj is actually a String`,
    bugExplain: "Casting an Object to a type it isn't actually an instance of throws ClassCastException at runtime. Check with instanceof first.",
    fixed: `Object obj = "hello";
if (obj instanceof Integer) {
    Integer num = (Integer) obj;
} else {
    // handle the actual type
}`
  },

  // ---------------- C ----------------
  {
    id: "c-1", lang: "C", title: "Off-by-one buffer write", pattern: "Array bounds / undefined behavior",
    difficulty: "Medium",
    buggy: `#include <stdio.h>
int main() {
    int arr[5];
    for (int i = 0; i <= 5; i++) {
        arr[i] = i * 2;   // i==5 writes one past the array — UB
    }
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
}`,
    bugExplain: "Writing arr[5] on a 5-element array (valid indices 0-4) is undefined behavior — it may silently corrupt adjacent memory instead of crashing.",
    fixed: `for (int i = 0; i < 5; i++) {
    arr[i] = i * 2;
}`
  },
  {
    id: "c-2", lang: "C", title: "Dereferencing an uninitialized pointer", pattern: "Pointers / memory",
    difficulty: "Hard",
    buggy: `#include <stdio.h>
int main() {
    int *ptr;          // uninitialized — points to garbage
    *ptr = 42;          // undefined behavior, likely crash
    printf("%d\\n", *ptr);
}`,
    bugExplain: "ptr was never assigned a valid address. Writing through it is undefined behavior. Always initialize pointers (NULL, malloc, or a valid variable's address) before dereferencing.",
    fixed: `int value;
int *ptr = &value;
*ptr = 42;
printf("%d\\n", *ptr);`
  },
  {
    id: "c-3", lang: "C", title: "Missing & on scanf argument", pattern: "Pointers / function arguments",
    difficulty: "Easy",
    buggy: `#include <stdio.h>
int main() {
    int x;
    scanf("%d", x);   // missing & — passes garbage address
    printf("%d\\n", x);
}`,
    bugExplain: "scanf needs the ADDRESS of the variable to write into. Passing x (its value, uninitialized) instead of &x causes undefined behavior / crash.",
    fixed: `int x;
scanf("%d", &x);
printf("%d\\n", x);`
  },
  {
    id: "c-4", lang: "C", title: "Memory leak from missing free()", pattern: "Memory management",
    difficulty: "Medium",
    buggy: `#include <stdlib.h>
void process() {
    int *data = malloc(100 * sizeof(int));
    // ... use data ...
    // missing free(data) — leaked every call
}`,
    bugExplain: "Every malloc() needs a matching free() once the memory is no longer needed, or the program leaks memory on every call to process().",
    fixed: `void process() {
    int *data = malloc(100 * sizeof(int));
    // ... use data ...
    free(data);
}`
  },
  {
    id: "c-5", lang: "C", title: "String not null-terminated", pattern: "Strings / buffers",
    difficulty: "Medium",
    buggy: `#include <string.h>
#include <stdio.h>
int main() {
    char buf[5];
    strncpy(buf, "hello world", 5);  // copies exactly 5 bytes, no room for '\\0'
    printf("%s\\n", buf);             // reads past the buffer — UB
}`,
    bugExplain: "strncpy does not guarantee null-termination if the source is longer than n. Reserve space for '\\0' or terminate manually.",
    fixed: `char buf[12];
strncpy(buf, "hello world", 11);
buf[11] = '\\0';
printf("%s\\n", buf);`
  },

  // ---------------- C++ ----------------
  {
    id: "cpp-1", lang: "C++", title: "Dangling reference to a local variable", pattern: "References / memory lifetime",
    difficulty: "Hard",
    buggy: `#include <iostream>
int& getValue() {
    int local = 42;
    return local;   // returns a reference to a destroyed stack variable
}
int main() {
    int& ref = getValue();
    std::cout << ref << std::endl;  // undefined behavior
}`,
    bugExplain: "local is destroyed when getValue() returns; the caller holds a dangling reference. Return by value, or use dynamic/static storage instead.",
    fixed: `int getValue() {
    int local = 42;
    return local;   // return by value — a safe copy
}`
  },
  {
    id: "cpp-2", lang: "C++", title: "Vector index out of range (no exception by default with [])", pattern: "Array bounds",
    difficulty: "Medium",
    buggy: `#include <vector>
#include <iostream>
int main() {
    std::vector<int> v = {1,2,3};
    std::cout << v[3] << std::endl;  // UB: operator[] does no bounds check
}`,
    bugExplain: "std::vector::operator[] does NOT bounds-check. Use .at(3) to get a safe std::out_of_range exception instead of undefined behavior.",
    fixed: `std::cout << v.at(3) << std::endl;  // throws std::out_of_range, catchable`
  },
  {
    id: "cpp-3", lang: "C++", title: "Iterator invalidation while erasing in a loop", pattern: "Containers / iterators",
    difficulty: "Hard",
    buggy: `#include <vector>
std::vector<int> v = {1,2,3,4,5};
for (auto it = v.begin(); it != v.end(); ++it) {
    if (*it % 2 == 0) v.erase(it);  // invalidates 'it' — UB on next ++it
}`,
    bugExplain: "erase() invalidates the iterator passed to it (and beyond). The following ++it is undefined behavior. erase() returns the next valid iterator — use it.",
    fixed: `for (auto it = v.begin(); it != v.end(); ) {
    if (*it % 2 == 0) it = v.erase(it);
    else ++it;
}`
  },
  {
    id: "cpp-4", lang: "C++", title: "Passing large object by value instead of reference", pattern: "Performance / pass-by-value",
    difficulty: "Medium",
    buggy: `#include <string>
#include <vector>
int countLongWords(std::vector<std::string> words) {  // copies the whole vector!
    int c = 0;
    for (auto w : words) if (w.size() > 5) c++;  // also copies each string
    return c;
}`,
    bugExplain: "Passing the vector (and each string) by value copies potentially large amounts of data unnecessarily. Pass by const reference instead.",
    fixed: `int countLongWords(const std::vector<std::string>& words) {
    int c = 0;
    for (const auto& w : words) if (w.size() > 5) c++;
    return c;
}`
  },

  // ---------------- JAVASCRIPT ----------------
  {
    id: "js-1", lang: "JavaScript", title: "var in a loop captured by closures", pattern: "Closures / var vs let",
    difficulty: "Medium",
    buggy: `function makeFns() {
  const fns = [];
  for (var i = 0; i < 3; i++) {
    fns.push(function() { return i; });
  }
  return fns.map(f => f());
}
console.log(makeFns());`,
    bugExplain: "var is function-scoped, so all three closures share the SAME i, which ends at 3 after the loop. Expected [0,1,2], actual [3,3,3]. Use let for per-iteration binding.",
    fixed: `function makeFns() {
  const fns = [];
  for (let i = 0; i < 3; i++) {
    fns.push(function() { return i; });
  }
  return fns.map(f => f());
}`,
    tests: [{ expr: "makeFns()", expected: "[3,3,3] (buggy) vs [0,1,2] (fixed)" }]
  },
  {
    id: "js-2", lang: "JavaScript", title: "== vs === coercion bug", pattern: "Type coercion",
    difficulty: "Easy",
    buggy: `function isEmpty(value) {
  return value == false;
}
console.log(isEmpty(0));      // true (ok by luck)
console.log(isEmpty(""));     // true (ok by luck)
console.log(isEmpty([]));     // true -- but an empty array probably shouldn't equal "empty"`,
    bugExplain: "Loose == triggers type coercion with surprising rules ([] == false is true!). Use strict === and explicit checks instead of relying on coercion.",
    fixed: `function isEmpty(value) {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "string") return value.length === 0;
  return value === null || value === undefined;
}`
  },
  {
    id: "js-3", lang: "JavaScript", title: "Array index off-by-one in reverse loop", pattern: "Off-by-one",
    difficulty: "Easy",
    buggy: `function reverseArray(arr) {
  const out = [];
  for (let i = arr.length; i > 0; i--) {
    out.push(arr[i]);   // arr[arr.length] is undefined
  }
  return out;
}
console.log(reverseArray([1,2,3]));`,
    bugExplain: "Valid indices go up to arr.length-1. Starting at arr.length reads undefined first and skips the true last element.",
    fixed: `function reverseArray(arr) {
  const out = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    out.push(arr[i]);
  }
  return out;
}`,
    tests: [{ expr: "reverseArray([1,2,3])", expected: "[3,2,1]" }]
  },
  {
    id: "js-4", lang: "JavaScript", title: "Async function not awaited", pattern: "Async / Promises",
    difficulty: "Medium",
    buggy: `async function getData() {
  return fetch("/api/data").then(r => r.json());
}
function run() {
  const data = getData();  // missing await — data is a Promise, not the result
  console.log(data.length);  // undefined, likely throws
}`,
    bugExplain: "Calling an async function returns a Promise immediately; the caller must await it (or .then it) to get the resolved value.",
    fixed: `async function run() {
  const data = await getData();
  console.log(data.length);
}`
  },
  {
    id: "js-5", lang: "JavaScript", title: "Mutating state via shared object reference", pattern: "Reference semantics",
    difficulty: "Medium",
    buggy: `function addTodo(state, todo) {
  state.todos.push(todo);   // mutates the original object — breaks React-style state updates
  return state;
}`,
    bugExplain: "Mutating the input object directly means callers that rely on reference-equality checks (React, Redux) won't detect the change. Return a new object/array instead.",
    fixed: `function addTodo(state, todo) {
  return { ...state, todos: [...state.todos, todo] };
}`
  },
  {
    id: "js-6", lang: "JavaScript", title: "NaN comparison bug", pattern: "Type errors",
    difficulty: "Easy",
    buggy: `function isValidNumber(x) {
  return x == x;   // intended to check NaN, but this is always true except for NaN... written backwards
}
console.log(isValidNumber(NaN));  // should be false, prints true because of the bug below
function parseAndCheck(str) {
  const n = Number(str);
  if (n === NaN) return false;   // NaN === NaN is ALWAYS false, this check never works
  return true;
}
console.log(parseAndCheck("abc"));  // should be false, prints true`,
    bugExplain: "NaN !== NaN by spec, so `n === NaN` never detects NaN. Use Number.isNaN(n) instead.",
    fixed: `function parseAndCheck(str) {
  const n = Number(str);
  if (Number.isNaN(n)) return false;
  return true;
}`,
    tests: [{ expr: "parseAndCheck('abc')", expected: "false" }]
  }
];

// Hand-written lessons for the Video Explainer (part 1: programming, Python, errors, arrays).
// Scene helpers keep the data compact. Narration is written to be spoken aloud.
export const T = (title, subtitle, narration) => ({ type: "title", title, subtitle, narration });
export const B = (heading, bullets, narration) => ({ type: "bullets", heading, bullets, narration });
export const F = (heading, steps, narration) => ({ type: "flow", heading, steps, narration });
export const A = (heading, items, steps, narration) => ({ type: "array", heading, items, steps, narration });
export const C = (heading, language, lines, steps, narration) => ({ type: "code", heading, language, lines, steps, narration });
export const V = (heading, l, lp, r, rp, narration) => ({ type: "compare", heading, left: { title: l, points: lp }, right: { title: r, points: rp }, narration });
export const K = (text, narration) => ({ type: "callout", text, narration });
export const S = (hi, ptr, label) => ({ hi, ptr, label });
export const L = (lines, label) => ({ lines, label });

export const PART1 = {
  "pf-variables": { title: "Variables and Types", scenes: [
    T("Variables and Types", "Programming fundamentals", "Every program stores values, and a surprising number of placement questions are just asking what type a value has. Let's make that automatic."),
    B("What a variable really is", ["A name attached to a value in memory", "Python decides the type at run time", "C, C++ and Java fix the type up front"], "A variable is only a name pointing at a value. In Python the type travels with the value, so the same name can hold a number now and text later. In C, C plus plus and Java you must declare the type first."),
    C("Trace the values", "python", ["x = 7", "y = 2", "a = x / y", "b = x // y", "c = int(a)", "d = '5' + '5'"], [L([2], "A single slash gives a float: 3.5"), L([3], "Double slash floors: 3"), L([4], "int() chops the decimal: 3"), L([5], "Plus on strings joins them: '55'")], "Watch each line. Seven divided by two with one slash gives three point five. Double slash floors it to three. Converting three point five with int just chops the decimal, it does not round. And adding two strings glues them together, so five plus five becomes fifty five."),
    V("Same symbol, different answer", "Python 3", ["7 / 2 is 3.5", "7 // 2 is 3"], "C, C++, Java", ["7 / 2 is 3 for two ints", "Cast one side to get 3.5"], "Here is the classic trap. In C and Java, dividing two integers throws away the fraction, so seven over two is three. In Python three the same slash returns a float. Always check which language the question uses."),
    B("Casting pitfalls to remember", ["int(2.9) is 2, never 3", "int('3.5') raises ValueError", "A number plus a string is a TypeError"], "Three quick rules. Converting with int truncates, it never rounds. Converting the text three point five with int fails, so use float first. And mixing a number with a string using plus raises a type error."),
    K("Check the types before you trust the output.", "Before you trust any output, ask what the type of every value is. Do that and half of the tricky questions disappear.")
  ] },

  "pf-operators": { title: "Operator Precedence", scenes: [
    T("Operator Precedence", "Programming fundamentals", "An expression is not read from left to right. It is read by precedence, and if you know the order you can evaluate any exam expression in seconds."),
    B("The order of power", ["Brackets first", "Power, then multiply and divide", "Then add and subtract", "Comparison, then not, and, or"], "Remember the ladder. Brackets always win. Then powers, then multiplication and division, then addition and subtraction. After that come comparisons, and finally not, and, or."),
    F("Evaluate it step by step", ["4 ** 2 = 16", "3 * 16 = 48", "2 + 48 = 50", "50 > 20 is True", "not False is True", "True and True is True"], "Take two plus three times four squared, greater than twenty, and not False. Power first gives sixteen. Multiply by three, forty eight. Add two, fifty. Fifty is greater than twenty, so true. Not False is true. True and true is true."),
    V("Two famous traps", "Minus and power", ["-2 ** 2 is -4", "Power binds tighter than minus"], "Power chains", ["2 ** 3 ** 2 is 512", "They group from the right"], "Two traps appear again and again. Minus two squared is negative four, because power binds tighter than the minus sign. And two to the three to the two is five hundred twelve, because chained powers group from the right."),
    B("Exam habits", ["Add brackets in your head", "and stops as soon as it sees False", "Do not mix = and =="], "In the exam, add imaginary brackets to make the order visible. Remember that and stops at the first false, so the right side may never run. And watch for a single equals sign, which assigns instead of comparing."),
    K("When unsure, add brackets.", "If you are ever unsure about the order, add brackets. They cost nothing and they remove the doubt.")
  ] },

  "pf-conditionals-loops": { title: "Loops and Conditions", scenes: [
    T("Loops and Conditions", "Programming fundamentals", "Loops are the skeleton of every algorithm. Tests love to ask how many times a line runs or what a counter ends up as."),
    C("Nested loop with continue", "python", ["for i in range(3):", "    for j in range(3):", "        if j == 1:", "            continue", "        print(i, j)"], [L([1], "Inner loop runs for each i"), L([2], "Check j == 1"), L([3], "continue skips only the inner loop body"), L([4], "Prints 0 0, 0 2, 1 0 ...")], "Here the outer loop runs three times and the inner loop three times each. When j equals one, continue skips the print, but only for that pass of the inner loop. The outer loop carries on. So six lines are printed in total."),
    F("Count the prints", ["i = 0: prints j = 0, 2", "i = 1: prints j = 0, 2", "i = 2: prints j = 0, 2", "3 passes x 2 prints = 6"], "Count it. For each of the three values of i, the inner loop prints twice, because j equals one is skipped. Three times two is six."),
    V("break versus continue", "continue", ["Skips to the next pass", "Loop keeps running"], "break", ["Leaves the loop entirely", "Only the nearest loop"], "People mix these up. Continue skips the rest of this pass and starts the next one. Break leaves the loop completely. And both only affect the nearest loop, never an outer one."),
    B("Classic bugs", ["range(1, n) stops at n minus one", "A while loop that never updates", "Changing a list while looping over it"], "Three classic bugs. Range stops one before the end value. A while loop with no update runs forever. And modifying a list while you loop over it skips items."),
    K("Dry run the loop with small numbers.", "When in doubt, dry run the loop with a tiny input. Write the variables on paper and tick through every pass.")
  ] },

  "pf-functions-recursion": { title: "Recursion and Scope", scenes: [
    T("Recursion and Scope", "Programming fundamentals", "Recursion is a function that calls itself. It looks like magic until you see the call stack, so let's watch one."),
    C("Factorial", "python", ["def factorial(n):", "    if n <= 1:", "        return 1", "    return n * factorial(n - 1)"], [L([1, 2], "Base case stops the recursion"), L([3], "Smaller problem: n minus one"), L([3], "Answer builds on the way back up")], "Factorial of n is n times factorial of n minus one. The base case, n at most one, returns one and stops the chain. Without it the function would call itself forever."),
    F("The call stack for factorial of 4", ["factorial(4) waits", "factorial(3) waits", "factorial(2) waits", "factorial(1) returns 1", "Unwind: 2, 6, 24"], "Calls pile up like plates. Factorial four calls three, which calls two, which calls one. One returns one. Then each waiting call finishes: two times one, three times two, four times six. The answer is twenty four."),
    V("Local and global scope", "Inside a function", ["x = 2 creates a new local x", "It dies when the function ends"], "Outside", ["Global x is unchanged", "Use the global keyword to change it"], "Scope trips people up. Assigning to x inside a function creates a brand new local variable. The global x stays as it was, unless you declare it with the global keyword."),
    B("Recursion bugs", ["Missing or wrong base case", "Forgetting to return the recursive call", "Never moving toward the base case"], "Most recursion bugs are one of three. The base case is missing or wrong. The recursive call is not returned, so the function gives back nothing. Or the input never gets smaller."),
    K("Every recursion needs a base case and progress.", "Remember, every recursion needs a base case, and every call must make progress toward it.")
  ] },

  "py-mutability": { title: "Mutable Default Arguments", scenes: [
    T("The Mutable Default Bug", "Python core", "This is the single most famous Python bug, and it is a named pattern in debugging rounds. Once you see it, you will never forget it."),
    V("Mutable versus immutable", "Immutable", ["int, str, tuple", "Changing makes a new object"], "Mutable", ["list, dict, set", "Changed in place, everyone sees it"], "Some objects can change in place and some cannot. Numbers, strings and tuples are immutable, a change creates a new object. Lists, dictionaries and sets are mutable, so a change is visible through every name that points to them."),
    C("The shared default list", "python", ["def add_item(item, bucket=[]):", "    bucket.append(item)", "    return bucket", "add_item(1)", "add_item(2)"], [L([0], "Default list is created ONCE, at def time"), L([3], "First call: [1]"), L([4], "Second call reuses it: [1, 2]")], "When Python reads the def line it creates the empty list one time and keeps it. The first call adds one. The second call uses the very same list, so you get one and two, not just two."),
    C("The fix", "python", ["def add_item(item, bucket=None):", "    if bucket is None:", "        bucket = []", "    bucket.append(item)", "    return bucket"], [L([0], "Use None as the default"), L([1, 2], "Create a fresh list inside"), L([3], "Each call now starts clean")], "The fix is simple. Use none as the default and create a new list inside the function. Now every call starts with its own empty list."),
    B("Related traps", ["b = a does not copy a list", "A tuple can hold a changeable list", "Use == for value, is for identity"], "Related traps include thinking that b equals a makes a copy. It does not, both names share one list. Also remember that a tuple can contain a list that still changes."),
    K("Never use a list or dict as a default argument.", "So remember: never use a list or a dictionary as a default argument.")
  ] },

  "py-collections": { title: "Lists, Dicts and Slicing", scenes: [
    T("Lists, Dicts and Slicing", "Python core", "Lists, dictionaries and sets appear in almost every Python question, and slicing is where off by one mistakes hide."),
    B("Pick the right container", ["list: ordered, changeable, duplicates", "tuple: ordered, fixed", "set: unique items, fast lookup", "dict: key to value, fast lookup"], "A list keeps order and allows duplicates. A tuple is the fixed version. A set stores unique items and checks membership very fast. A dictionary maps keys to values, also with fast lookup."),
    A("Slicing a = [10..70]", ["10", "20", "30", "40", "50", "60", "70"], [S([1, 3], { 1: "start", 3: "" }, "a[1:5:2] picks indexes 1 and 3: 20, 40"), S([4, 5, 6], { 4: "-3" }, "a[-3:] is the last three: 50, 60, 70"), S([5, 4, 3], { 5: "5" }, "a[5:2:-1] walks backwards: 60, 50, 40")], "Take a list of seven numbers. A slice from one to five with a step of two picks indexes one and three. A slice starting at minus three gives the last three items. And with a negative step you walk backwards. The stop index is never included."),
    V("Copying lists", "Shallow copy", ["b = a.copy()", "Inner lists are still shared"], "Deep copy", ["copy.deepcopy(a)", "Fully independent"], "A shallow copy duplicates only the outer list, so inner lists are still shared. Change an inner list through the copy and the original changes too. Use deep copy when you need full independence."),
    B("Common slips", ["d['x'] on a missing key raises KeyError", "list.sort() returns None", "A set has no order"], "Three slips. Reading a missing dictionary key raises key error, so use get. The sort method sorts in place and returns none. And a set has no guaranteed order."),
    K("The stop index in a slice is exclusive.", "If you remember one thing, remember that the stop index of a slice is exclusive.")
  ] },

  "py-comprehensions": { title: "Comprehensions and Lambda", scenes: [
    T("Comprehensions and Lambda", "Python core", "A comprehension builds a list in one line. It is short, readable and very popular in output questions."),
    C("Squares of even numbers", "python", ["squares = [x*x for x in range(10) if x % 2 == 0]"], [L([0], "Loop x from 0 to 9"), L([0], "Keep only even x"), L([0], "Result: 0, 4, 16, 36, 64")], "Read it left to right. For each x from zero to nine, keep it only if x is even, and put x times x in the list. The result is zero, four, sixteen, thirty six, sixty four."),
    F("How it unrolls", ["x = 0 passes, add 0", "x = 1 fails, skip", "x = 2 passes, add 4", "x = 4, 6, 8 add 16, 36, 64"], "Unroll it by hand. Zero passes the filter and adds zero. One fails and is skipped. Two adds four. Then four, six and eight add sixteen, thirty six and sixty four."),
    V("The lambda late binding trap", "What people expect", ["[0, 1, 2]"], "What Python returns", ["[2, 2, 2]", "Every lambda reads the final i"], "Here is a nasty one. A list of lambdas built in a loop all read the variable i later, after the loop has finished. So they all see two. Fix it with a default argument, lambda i equals i, which freezes the value."),
    B("Syntax reminders", ["Filter goes at the end: if cond", "If-else goes before the loop", "Dict version: {k: v for ...}"], "A filter goes at the end. If you need an else, the whole conditional moves to the front. And dictionaries work the same way with curly braces and a key value pair."),
    K("Read a comprehension as: for each, keep if, produce.", "A good way to read any comprehension: for each item, keep it if the condition holds, and produce this value.")
  ] },

  "py-args-kwargs": { title: "args and kwargs", scenes: [
    T("args and kwargs", "Python core", "Function calls in Python can be flexible. Knowing exactly how arguments bind is a favourite exam topic."),
    C("A flexible function", "python", ["def f(a, b=10, *args, **kwargs):", "    print(a, b, args, kwargs)", "f(1)", "f(1, 2, 3, 4, x=5)", "f(1, b=7)"], [L([2], "a = 1, b uses its default 10"), L([3], "b = 2, extras go to args and kwargs"), L([4], "keyword b = 7 overrides the default")], "This function takes a required a, an optional b, any extra positional values in args, and any extra keyword values in kwargs. Calling it with just one uses the default for b. Adding more values fills b, then collects the rest."),
    F("Where each value goes", ["1 fills a", "2 fills b", "3, 4 collect in args", "x=5 collects in kwargs"], "In the second call, one fills a and two fills b. The extra positional values three and four are collected into a tuple called args. The keyword x equals five is collected into a dictionary called kwargs."),
    V("Two common errors", "Missing a", ["f(b=2)", "TypeError: missing argument a"], "Wrong order", ["positional after keyword", "SyntaxError"], "Two errors to recognise. Calling without the required argument gives a type error. And putting a positional argument after a keyword argument is a syntax error."),
    B("Unpacking", ["*items spreads a list into arguments", "**options spreads a dict", "Defaults are evaluated once"], "Use a star to spread a list into arguments and two stars to spread a dictionary. And remember that default values are evaluated only once, which is the root of the mutable default bug."),
    K("Positional first, then keywords.", "Keep the rule: positional arguments first, keyword arguments after.")
  ] },

  "py-exceptions": { title: "Exception Handling", scenes: [
    T("Exception Handling", "Python core", "Errors will happen. Exception handling decides whether your program recovers or crashes, and exams ask exactly which blocks run."),
    C("try, except, else, finally", "python", ["try:", "    value = d['b']", "except KeyError:", "    value = 0", "else:", "    print('ok')", "finally:", "    print('done')"], [L([0, 1], "Risky code goes in try"), L([2, 3], "Handles only KeyError"), L([4, 5], "else runs if no error happened"), L([6, 7], "finally always runs")], "Put risky code in try. The except block handles a specific error. The else block runs only if nothing went wrong. And finally runs no matter what, even after an error."),
    F("Which blocks run", ["No error: try, else, finally", "KeyError: try, except, finally", "Other error: try, finally, then crash"], "Memorise three cases. With no error you get try, else and finally. With a key error you get try, except and finally. With a different error nothing matches, finally still runs, and then the program crashes."),
    V("Good and bad habits", "Good", ["Catch the specific error", "Specific except first"], "Bad", ["Bare except hides bugs", "return inside finally"], "Catch the specific error you expect, and put specific handlers before general ones. Avoid a bare except, because it hides real bugs. And do not return from finally, it can swallow errors."),
    B("In the exam", ["Trace the blocks in order", "Remember finally always runs", "Spot the uncaught exception"], "In the exam trace the blocks in order, remember that finally always runs, and look for an error that no except block catches."),
    K("finally always runs. else runs only without errors.", "So remember: finally always runs, while else runs only when there was no error.")
  ] },

  "py-iterators-generators": { title: "Generators", scenes: [
    T("Generators", "Python core", "A generator produces values one at a time. It saves memory and it pauses between values, which is what makes questions about it tricky."),
    C("A countdown generator", "python", ["def countdown(n):", "    while n > 0:", "        yield n", "        n -= 1", "g = countdown(3)"], [L([4], "Calling it runs no code yet"), L([2], "First next: runs to yield, gives 3"), L([3, 1, 2], "Resumes: n becomes 2, yields 2"), L([1], "At 0 the loop ends: StopIteration")], "Calling the function does not run anything. It only creates the generator. The first next call runs to the yield and hands back three, then pauses. The next call resumes right after the yield, decreases n, and yields two. When n reaches zero the function ends and stop iteration is raised."),
    F("What each next returns", ["next(g) gives 3", "next(g) gives 2", "next(g) gives 1", "next(g) raises StopIteration"], "So the four calls return three, two, one, and then stop iteration. Only one value lives in memory at a time."),
    V("List versus generator", "List comprehension", ["Builds everything now", "Can be reused"], "Generator expression", ["Produces one at a time", "Used up after one pass"], "A list comprehension builds everything immediately and can be reused. A generator expression produces values lazily and is exhausted after one pass."),
    B("Gotchas", ["Second list(g) is empty", "yield pauses, return ends", "len() does not work on a generator"], "A classic gotcha: converting a generator to a list twice gives an empty list the second time. Yield pauses, return ends. And you cannot take the length of a generator."),
    K("A generator remembers where it paused.", "In one sentence: a generator remembers exactly where it paused, and continues from there.")
  ] },

  "err-types": { title: "Debugging Workflow", scenes: [
    T("The Debugging Workflow", "Errors and debugging", "The debugging round gives you broken code. A calm four step routine beats guessing every time."),
    F("Review, Identify, Fix, Validate", ["Review: read the goal and the code", "Identify: find the faulty line", "Fix: smallest change possible", "Validate: normal and edge cases"], "First review the goal and the code. Then identify the exact line or condition that is wrong. Fix it with the smallest change. And finally validate with normal inputs and edge cases."),
    C("A bug you cannot see", "python", ["total = 0", "for i in range(1, 5):", "    total += i", "print(total)   # expected 15"], [L([3], "Runs fine, prints 10, no error"), L([1], "range(1, 5) stops at 4"), L([1], "Fix: range(1, 6)")], "This program runs without any error, but prints ten instead of fifteen. That means a logical error. The loop range stops at four, so five is never added. The fix is range one to six."),
    B("Know the error names", ["IndexError: index out of range", "KeyError: missing dictionary key", "TypeError: wrong type for the operation", "ValueError: right type, bad value"], "Learn the names. Index error means the index is out of range. Key error means the dictionary has no such key. Type error means the wrong type for the operation. Value error means the right type with a bad value."),
    V("Three kinds of error", "Syntax and runtime", ["Syntax: never runs", "Runtime: crashes midway"], "Logical", ["Runs, wrong answer", "Hardest to spot"], "A syntax error stops the program before it runs. A runtime error crashes partway through. A logical error runs happily but gives the wrong answer, and that is the hardest kind."),
    K("Fix the smallest thing, then test the edges.", "Fix the smallest thing that is wrong, then test the edge cases: empty input, one item, and the largest value.")
  ] },

  "arr-traversal-2d": { title: "Arrays, Grids and Circular Arrays", scenes: [
    T("Grids and Circular Arrays", "Arrays and strings", "Matrix walks and circular arrays hide off by one and modulo bugs, both named patterns in the debugging round."),
    A("A circular array", ["A", "B", "C", "D", "E", "F"], [S([3], { 3: "start" }, "Start at index 3: D"), S([4], { 4: "" }, "(3 + 1) % 6 = 4: E"), S([5], { 5: "" }, "(3 + 2) % 6 = 5: F"), S([0], { 0: "wrap" }, "(3 + 3) % 6 = 0: back to A")], "Imagine six letters in a circle. Start at index three. Each step adds one and takes the remainder by six. After F at index five, the next index is zero, so the walk wraps back to A."),
    C("The modulo bug", "python", ["idx = (start + i) % len(arr)", "idx = (start + i) % (len(arr) - 1)  # bug"], [L([0], "Correct: modulo the length"), L([1], "Bug: index 5 is never reached")], "Always take the remainder by the length of the array. If you use length minus one, the last element can never be reached."),
    F("Walking a matrix", ["Row by row: outer rows, inner columns", "Column by column: swap the loops", "Spiral: shrink four borders"], "To walk a matrix row by row, loop over rows outside and columns inside. Swap the loops to go column by column. A spiral keeps four borders and shrinks them as you go."),
    B("Bugs to watch", ["Swapping row and column indexes", "Modulo by n minus one", "Spiral revisiting a row"], "Common bugs are swapping the row and column indexes, taking the modulo by the wrong number, and a spiral that visits a row twice when the borders cross."),
    K("Wrap with the remainder by the length.", "To wrap around, use the remainder by the length. Nothing else.")
  ] },

  "arr-two-pointer-sliding-window": { title: "Two Pointers and Sliding Window", scenes: [
    T("Two Pointers and Sliding Window", "Arrays and strings", "These two tricks turn slow nested loops into a single pass. They show up in coding rounds all the time."),
    A("Pair that sums to 10", ["1", "3", "4", "6", "8", "11"], [S([0, 5], { 0: "L", 5: "R" }, "1 + 11 = 12, too big"), S([0, 4], { 0: "L", 4: "R" }, "Move R left: 1 + 8 = 9, too small"), S([1, 4], { 1: "L", 4: "R" }, "Move L right: 3 + 8 = 11, too big"), S([1, 3], { 1: "L", 3: "R" }, "3 + 6 = 9, too small"), S([2, 3], { 2: "L", 3: "R" }, "4 + 6 = 10. Found!")], "The array is sorted. Put one pointer at each end. One plus eleven is twelve, too big, so move the right pointer in. One plus eight is nine, too small, so move the left pointer. Keep going and you land on four plus six, which is ten."),
    B("Why it is fast", ["Each pointer moves one way only", "At most n moves in total", "O(n) instead of O(n squared)"], "Each pointer only moves in one direction, so there are at most n moves in total. That is linear time instead of the quadratic time of checking every pair."),
    A("Window of size 3", ["2", "1", "5", "1", "3", "2"], [S([0, 1, 2], { 0: "start", 2: "end" }, "First window: 2 + 1 + 5 = 8"), S([1, 2, 3], { 1: "start", 3: "end" }, "Drop 2, add 1: sum 7"), S([2, 3, 4], { 2: "start", 4: "end" }, "Drop 1, add 3: sum 9"), S([3, 4, 5], { 3: "start", 5: "end" }, "Drop 5, add 2: sum 6. Best is 9")], "For a window of size three, compute the first sum, eight. Then slide: subtract the item leaving and add the item entering. The sums are seven, nine and six, so the best is nine. Only two operations per slide."),
    V("When to use which", "Two pointers", ["Sorted data, pairs", "Reverse, palindrome, merge"], "Sliding window", ["Contiguous subarray", "Fixed or variable size"], "Use two pointers for sorted data and pair problems. Use a sliding window for contiguous subarrays, with a fixed size or one that grows and shrinks."),
    K("Never recompute the whole window. Add one, drop one.", "The golden rule: never recompute the whole window. Add the new item, drop the old one.")
  ] },

  "arr-string-algos": { title: "Palindromes and Anagrams", scenes: [
    T("Palindromes and Anagrams", "Arrays and strings", "Two warm up problems that every placement test loves, and one technique that solves both: pointers and counting."),
    A("racecar is a palindrome", ["r", "a", "c", "e", "c", "a", "r"], [S([0, 6], { 0: "L", 6: "R" }, "r equals r"), S([1, 5], { 1: "L", 5: "R" }, "a equals a"), S([2, 4], { 2: "L", 4: "R" }, "c equals c"), S([3], { 3: "L,R" }, "Pointers meet. Palindrome!")], "Put one pointer at each end and compare. R matches R, A matches A, C matches C. When the pointers meet in the middle, every pair matched, so it is a palindrome. One mismatch would end it immediately."),
    F("Anagram with counting", ["Count letters of listen", "Subtract letters of silent", "All counts back to zero", "So they are anagrams"], "For anagrams, count the letters in the first word. Then subtract the letters of the second word. If every count returns to zero, the two words use exactly the same letters."),
    V("Brute force versus counting", "Sorting both", ["O(n log n)", "Simple but slower"], "Counting", ["O(n) time", "Needs a hash map or array"], "You could sort both words and compare, which takes n log n. Counting takes only linear time, so it is the better answer."),
    B("Watch for", ["Case and punctuation rules", "An empty string is a palindrome", "Unequal lengths: instant no"], "Read the statement for rules about case and punctuation. An empty string counts as a palindrome. And if the lengths differ, two words can never be anagrams."),
    K("Palindrome: two pointers. Anagram: count letters.", "Short version: palindrome means two pointers, anagram means count the letters.")
  ] }
};

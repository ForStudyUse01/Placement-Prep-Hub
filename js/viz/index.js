import * as D from "./dsa.js";
import * as P from "./python.js";
import * as A from "./aiviz.js";

export const TOPIC_VIZ = {
  "pf-variables": [P.varsTrace],
  "pf-operators": [P.precedence],
  "pf-conditionals-loops": [P.loopsTrace],
  "pf-functions-recursion": [P.callStack, P.scopeTrace],
  "py-mutability": [P.mutableDefault, P.copyDemo],
  "py-collections": [P.slicing],
  "py-comprehensions": [P.comprehension, P.lateBinding],
  "py-args-kwargs": [P.argsBinder],
  "py-exceptions": [P.exceptionFlow],
  "py-iterators-generators": [P.generatorTrace],
  "err-types": [P.errorExplorer],
  "arr-traversal-2d": [D.grid2d, D.circular],
  "arr-two-pointer-sliding-window": [D.twoPointer, D.slidingWindow],
  "arr-string-algos": [D.palindrome, D.anagram],
  "ll-fundamentals": [D.llReverse, D.llCycle],
  "stack-queue": [D.stackDemo, D.queueDemo, D.stackParens, D.nextGreater],
  "tree-traversals": [D.traversals, D.treeHeight],
  "bst-ops": [D.bstDemo],
  "graph-representation-traversal": [D.graphWalk],
  "graph-cycles-shortest-path": [D.cycleDemo, D.gridBfs],
  "dp-fundamentals": [D.fibCount, D.fibTable],
  "dp-classics": [D.lcsDemo, D.knapsackDemo],
  "advanced-greedy-heap": [D.heapDemo, D.greedyIntervals],
  "complexity-bigo": [D.bigO, D.sortSearch],
  "ai-fundamentals": [A.hierarchy, A.paradigms],
  "ai-llms": [A.tokenizer, A.temperature, A.contextWindow],
  "ai-prompt-engineering": [A.promptBuilder, A.injection],
  "ai-rag": [A.ragFlow, A.vectorSpace],
  "ai-agentic": [A.agentLoop, A.multiAgent],
  "ai-responsible": [A.biasDemo],
  "ai-evaluation-monitoring": [A.precisionRecall, A.driftChart],
  "ai-in-software-dev": [A.reviewLoop, A.insecureCode]
};

import { BATCH1 } from "./p1.js";
import { BATCH2 } from "./p2.js";
import { BATCH3 } from "./p3.js";
import { BATCH4 } from "./p4.js";
import { BATCH5 } from "./p5.js";
import { EXPECTED } from "./expected.js";
import { assemble, KINDS } from "./templates.js";

export const LANGS = [["py", "Python"], ["c", "C"], ["cpp", "C++"], ["java", "Java"], ["js", "JavaScript"]];
export const FORMAT_HELP = KINDS;

export const PROBLEMS = [...BATCH1, ...BATCH2, ...BATCH3, ...BATCH4, ...BATCH5].map((p) => ({ ...p, expected: EXPECTED[p.id] || [] }));

// Full program the learner edits (bugged) or the reference answer (fixed).
export function buildProgram(problem, lang, variant) {
  const [fixed, pairs] = problem[lang];
  let code = fixed;
  if (variant === "bug") for (const [from, to] of pairs) code = code.replace(from, () => to);
  return assemble(lang, problem.kind, code);
}

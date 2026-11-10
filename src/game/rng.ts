/**
 * Deterministic, local RNG. The generator never calls Math.random(), so every
 * attempt is reproducible from (stageIndex, attempt) and the seed travels in
 * the run result.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedForAttempt(stageIndex: number, attempt: number): number {
  return ((stageIndex * 7919) ^ (attempt * 104729)) >>> 0;
}

export function seedForDate(dateKey: string): number {
  let h = 2166136261;
  for (let i = 0; i < dateKey.length; i++) {
    h ^= dateKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickInt(rnd: () => number, minIncl: number, maxExcl: number) {
  return minIncl + Math.floor(rnd() * (maxExcl - minIncl));
}

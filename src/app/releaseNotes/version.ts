// Strict SemVer, with an optional GitHub tag prefix. BigInt avoids precision loss.
const VERSION =
  /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/;

export function normalizeVersion(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 100) {
    return null;
  }
  const clean = value.replace(/-grl(?=\+|$)/i, '');
  if (!VERSION.test(clean)) {
    return null;
  }
  return clean.replace(/^v/, '').split('+')[0];
}

export function compareVersions(a: string, b: string): number {
  const cleanA = typeof a === 'string' ? a.replace(/-grl(?=\+|$)/i, '') : a;
  const cleanB = typeof b === 'string' ? b.replace(/-grl(?=\+|$)/i, '') : b;
  const left = VERSION.exec(cleanA);
  const right = VERSION.exec(cleanB);
  if (!left || !right) return 0;
  for (let i = 1; i <= 3; i++) {
    if (BigInt(left[i]) !== BigInt(right[i])) {
      return BigInt(left[i]) > BigInt(right[i]) ? 1 : -1;
    }
  }
  const preA = left[4]?.split('.');
  const preB = right[4]?.split('.');
  if (!preA && !preB) return 0;
  if (!preA) return 1;
  if (!preB) return -1;
  for (let i = 0; i < Math.max(preA.length, preB.length); i++) {
    if (preA[i] === undefined) return -1;
    if (preB[i] === undefined) return 1;
    if (preA[i] === preB[i]) continue;
    const numA = /^\d+$/.test(preA[i]);
    const numB = /^\d+$/.test(preB[i]);
    if (numA && numB) return BigInt(preA[i]) > BigInt(preB[i]) ? 1 : -1;
    if (numA !== numB) return numA ? -1 : 1;
    return preA[i] > preB[i] ? 1 : -1;
  }
  return 0;
}

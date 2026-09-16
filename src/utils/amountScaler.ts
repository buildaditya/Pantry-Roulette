/**
 * Utility to parse and scale recipe ingredient amounts dynamically
 */

function formatFraction(val: number): string {
  if (Math.abs(val - Math.round(val)) < 0.05) {
    return Math.round(val).toString();
  }

  const whole = Math.floor(val);
  const remainder = val - whole;

  const fractions: [number, string][] = [
    [1 / 8, '1/8'],
    [1 / 4, '1/4'],
    [1 / 3, '1/3'],
    [3 / 8, '3/8'],
    [1 / 2, '1/2'],
    [5 / 8, '5/8'],
    [2 / 3, '2/3'],
    [3 / 4, '3/4'],
    [7 / 8, '7/8'],
  ];

  for (const [fracVal, fracStr] of fractions) {
    if (Math.abs(remainder - fracVal) < 0.06) {
      return whole > 0 ? `${whole} ${fracStr}` : fracStr;
    }
  }

  // Fallback to 1 decimal place if odd fraction
  return val.toFixed(1).replace(/\.0$/, '');
}

/**
 * Scales an amount string like "2 tbsp", "1/2 cup", "1.5 tsp", "400g"
 */
export function scaleAmount(amountStr: string, factor: number): string {
  if (!amountStr || factor === 1) return amountStr;

  // Pattern for mixed fraction: e.g. "1 1/2 cups"
  const mixedMatch = amountStr.match(/^(\d+)\s+(\d+)\/(\d+)(.*)$/);
  if (mixedMatch) {
    const whole = parseFloat(mixedMatch[1]);
    const num = parseFloat(mixedMatch[2]);
    const den = parseFloat(mixedMatch[3]);
    const val = (whole + num / den) * factor;
    return `${formatFraction(val)}${mixedMatch[4]}`;
  }

  // Pattern for simple fraction: e.g. "1/2 cup"
  const fracMatch = amountStr.match(/^(\d+)\/(\d+)(.*)$/);
  if (fracMatch) {
    const num = parseFloat(fracMatch[1]);
    const den = parseFloat(fracMatch[2]);
    const val = (num / den) * factor;
    return `${formatFraction(val)}${fracMatch[3]}`;
  }

  // Pattern for decimal or integer at start: e.g. "2 tbsp", "1.5 cups", "200g"
  const numMatch = amountStr.match(/^([\d.]+)(.*)$/);
  if (numMatch) {
    const val = parseFloat(numMatch[1]) * factor;
    return `${formatFraction(val)}${numMatch[2]}`;
  }

  return amountStr;
}

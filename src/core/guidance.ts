export function lengthGuidance(value: string): string {
  const length = Array.from(value).length;
  if (!length) return 'Enter a test password to see length guidance.';
  if (length < 15) {
    return 'Below NIST’s 15-character minimum for single-factor sign-in services. Length guidance only; the guess estimate is separate.';
  }
  return 'Meets NIST’s single-factor length minimum. This does not guarantee a strong password.';
}

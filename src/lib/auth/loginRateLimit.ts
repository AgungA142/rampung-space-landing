const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

type Entry = { count: number; resetAt: number };

const attempts = new Map<string, Entry>();

export function isRateLimited(email: string): boolean {
  const entry = attempts.get(email);
  if (!entry) return false;
  if (Date.now() >= entry.resetAt) {
    attempts.delete(email);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(email: string): void {
  const entry = attempts.get(email);
  if (!entry || Date.now() >= entry.resetAt) {
    attempts.set(email, { count: 1, resetAt: Date.now() + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearAttempts(email: string): void {
  attempts.delete(email);
}

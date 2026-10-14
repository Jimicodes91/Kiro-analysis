/**
 * Returns a time-of-day greeting based on a 24-hour clock hour (0–23).
 *
 * The hour is expected to come from the user's local device clock
 * (`new Date().getHours()`), so each client sees the greeting that matches
 * their own wall-clock time. This is intentionally client-local: a greeting
 * should reflect the user's experience, not the server's timezone.
 *
 * - 00:00–11:59 -> "Good morning"
 * - 12:00–16:59 -> "Good afternoon"
 * - 17:00–23:59 -> "Good evening"
 */
export function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Builds the full greeting line, e.g. "Good morning, John".
 * Falls back to just the time greeting when no name is available, so the UI
 * never renders "Good morning, undefined".
 */
export function buildGreeting(hour: number, name?: string | null): string {
  const greeting = getGreeting(hour);
  const trimmed = name?.trim();
  return trimmed ? `${greeting}, ${trimmed}` : greeting;
}

export function logApiEvent(
  event: string,
  metadata?: Record<string, unknown>
) {
  console.info(
    `[API] ${event}`,
    metadata ?? {}
  );
}
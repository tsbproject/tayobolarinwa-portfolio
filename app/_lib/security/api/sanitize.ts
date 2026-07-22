export function sanitizeText(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "");
}
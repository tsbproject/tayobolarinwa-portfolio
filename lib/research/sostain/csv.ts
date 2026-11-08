/**
 * Safely serialize de-identified research answers for spreadsheet programs.
 * Formulas are escaped even when preceded by whitespace or control characters.
 */
function cell(value: unknown): string {
  const text = value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
  const escaped = /^[\s\u0000-\u001f]*[=+@-]/u.test(text) ? "'" + text : text;
  return '"' + escaped.replace(/"/g,'""') + '"';
}

export function safeResearchCsv(rows: readonly Record<string, unknown>[], columns: readonly string[]): string {
  return [columns.map(cell).join(","), ...rows.map(row => columns.map(col => cell(row[col])).join(","))].join("\r\n");
}

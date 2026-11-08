/**
 * Protect exported research CSVs against formula injection in spreadsheet apps.
 * Export de-identified response data by default; do not include contact details.
 */
function cell(value: unknown): string {
  const text = value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
  const escaped = /^[\\s\\u0000-\\u001f]*[=+@\-]/.test(text) ? "'" + text : text;
  return '"' + escaped.replace(/"/g,'""') + '"';
}
export function safeResearchCsv(rows: readonly Record<string,unknown>[], columns: readonly string[]): string {
  return [columns.map(cell).join(","),...rows.map(row=>columns.map(col=>cell(row[col])).join(","))].join("\r\n");
}

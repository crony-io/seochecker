/**
 * @fileoverview Shared helper functions for export utilities.
 */

/**
 * Helper to download a blob.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Extracts domain slug from URL for filename.
 */
export function getDomainSlug(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/\./g, '-');
  } catch {
    return 'unknown';
  }
}

/**
 * Escapes HTML entities to prevent XSS.
 */
export function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char] ?? char);
}

/**
 * Escapes a value for CSV.
 */
export function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

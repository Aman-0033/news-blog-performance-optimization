/**
 * Ticket: ENG-84718
 * Input Sanitization Utility for News Blog Performance Optimization
 * Strips script tags, style tags, inline event handlers, and malicious HTML tags.
 */

export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input ?? '';
  }

  // 1. Strip script tags and all content inside them
  let clean = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 2. Strip style tags and all content inside them
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // 3. Strip inline event handlers (onerror=, onmouseover=, onload=, onclick=, etc.)
  clean = clean.replace(/\bon\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 4. Strip javascript: pseudo-protocols
  clean = clean.replace(/javascript\s*:/gi, '');

  // 5. Strip any remaining HTML tags to prevent stored XSS
  clean = clean.replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi, '');

  return clean.trim();
}

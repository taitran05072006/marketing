import DOMPurify from 'isomorphic-dompurify';

/**
 * XSS Protection Utilities for Next.js App Router
 */

/**
 * An toan tuan tu hoa JSON-LD de ngan chan XSS break-out trong the <script>
 * Escape cac ky tu dac biet nhu <, >, &, line separator, paragraph separator
 */
export function safeJsonLdReplacer(data: any): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Danh sach the HTML an toan duoc phep hien thi trong bai viet va san pham
 */
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'span', 'b', 'strong', 'i', 'em', 'u', 's', 'strike',
  'ul', 'ol', 'li',
  'blockquote', 'code', 'pre',
  'a', 'img',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'br', 'hr', 'div'
];

/**
 * Danh sach thuoc tinh an toan
 */
const ALLOWED_ATTR = [
  'href', 'title', 'target', 'rel',
  'src', 'alt', 'width', 'height', 'loading',
  'class', 'style', 'id'
];

/**
 * Chi cho phep cac giao thuc URL hop le: http, https, mailto, tel hoac relative paths
 */
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;

/**
 * Sanitize noi dung HTML bang thu vien DOMPurify chuyen dung thay vi regex tu viet.
 * Ngan chan moi vector tan cong XSS (script injection, DOM clobbering, event handlers).
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    ALLOW_DATA_ATTR: false,
    RETURN_TRUSTED_TYPE: false,
  });
}

/**
 * Format ISO date string to Vietnamese locale
 */
export function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

/**
 * Format ISO date string to short date
 */
export function formatDateShort(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

/**
 * Returns relative time (e.g. "2 ngày trước")
 */
export function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const rtf = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });
    const seconds = diff / 1000;
    if (seconds < 60) return rtf.format(-Math.round(seconds), 'second');
    const minutes = seconds / 60;
    if (minutes < 60) return rtf.format(-Math.round(minutes), 'minute');
    const hours = minutes / 60;
    if (hours < 24) return rtf.format(-Math.round(hours), 'hour');
    const days = hours / 24;
    if (days < 30) return rtf.format(-Math.round(days), 'day');
    const months = days / 30;
    if (months < 12) return rtf.format(-Math.round(months), 'month');
    return rtf.format(-Math.round(months / 12), 'year');
  } catch {
    return dateStr;
  }
}

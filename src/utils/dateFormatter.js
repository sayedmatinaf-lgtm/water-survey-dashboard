export function formatDate(dateString, lang = 'en') {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    if (lang === 'fa') {
      return new Intl.DateTimeFormat('fa-AF', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}
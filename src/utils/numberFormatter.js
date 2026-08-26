export function formatNumber(value, lang = 'en') {
  if (value === null || value === undefined || isNaN(value)) return '0';
  const formattedStr = Number(value).toLocaleString(lang === 'fa' ? 'fa-AF' : 'en-US');
  if (lang !== 'fa') return formattedStr;

  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return formattedStr.replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
}

export function formatPercent(value, lang = 'en') {
  const num = formatNumber(Math.round(value || 0), lang);
  return lang === 'fa' ? `٪${num}` : `${num}%`;
}
export function formatNumber(value: number, lang: 'pt' | 'en' = 'pt'): string {
  const locale = lang === 'en' ? 'en-US' : 'pt-BR';
  return new Intl.NumberFormat(locale).format(value);
}

export function formatBusinessMetric(
  value: number,
  unit: string,
  lang: 'pt' | 'en' = 'pt',
): string {
  if (unit === 'R$') {
    const locale = lang === 'en' ? 'en-US' : 'pt-BR';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  if (unit === '%') {
    return `${value}%`;
  }

  return `${value}${unit}`;
}

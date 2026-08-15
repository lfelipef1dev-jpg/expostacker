export function formatBusinessMetric(value: number, unit: string): string {
  if (unit === 'R$') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
  return `${value}${unit}`;
}

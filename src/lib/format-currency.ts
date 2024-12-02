export function formatCurrency(
  amount: number,
  locale = "id-ID",
  currency = "IDR",
): string {
  return amount.toLocaleString(locale, { style: "currency", currency });
}

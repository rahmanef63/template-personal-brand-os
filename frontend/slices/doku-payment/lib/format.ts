/** IDR formatter — no decimals, locale id-ID. */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Group a VA number in 4-char blocks for readability. */
export function groupVa(va: string): string {
  return va.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Countdown helpers — DOKU instructions expire after `expiry_minutes`. */
export function timeLeft(expiresAt: number | undefined): string | null {
  if (!expiresAt) return null;
  const ms = expiresAt - Date.now();
  if (ms <= 0) return "Kedaluwarsa";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (m >= 60) {
    const h = Math.floor(m / 60);
    return `${h}j ${m % 60}m`;
  }
  return `${m}m ${s}s`;
}

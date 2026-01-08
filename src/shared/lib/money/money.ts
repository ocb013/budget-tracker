export function formatCents(amountCents: number): string {
    const sign = amountCents < 0 ? '-' : '';
    const abs = Math.abs(amountCents);

    const dollars = Math.floor(abs / 100);
    const cents = abs % 100;

    return `${sign}$${dollars.toLocaleString('en-US')}.${String(
        cents
    ).padStart(2, '0')}`;
}

export function parseAmountToCents(input: string): number | null {
    const normalized = input.replace(',', '.').trim();
    if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null;

    const [whole, frac = ''] = normalized.split('.');
    const cents =
        Number(whole) * 100 + Number((frac + '00').slice(0, 2));
    if (!Number.isFinite(cents) || cents <= 0) return null;

    return cents;
}

export function sanitizeAmountInput(raw: string): string {
    let v = raw.replace(/[^\d.]/g, '');
    const firstDot = v.indexOf('.');
    if (firstDot !== -1) {
        v =
            v.slice(0, firstDot + 1) +
            v.slice(firstDot + 1).replace(/\./g, '');
    }

    const [whole, frac] = v.split('.');
    if (typeof frac === 'string') {
        v = `${whole}.${frac.slice(0, 2)}`;
    }

    if (v.startsWith('.')) v = `0${v}`;

    return v;
}

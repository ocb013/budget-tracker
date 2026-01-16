export function readJson<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export function writeJson<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
}

export declare class InMemoryCache<T> {
    private readonly ttlMs;
    private readonly maxEntries;
    private store;
    constructor(ttlMs: number, maxEntries: number);
    get(key: string): T | undefined;
    set(key: string, value: T): void;
    private evictIfNeeded;
}
//# sourceMappingURL=cache.d.ts.map
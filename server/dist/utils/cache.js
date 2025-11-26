"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCache = void 0;
class InMemoryCache {
    constructor(ttlMs, maxEntries) {
        this.ttlMs = ttlMs;
        this.maxEntries = maxEntries;
        this.store = new Map();
    }
    get(key) {
        const record = this.store.get(key);
        if (!record) {
            return undefined;
        }
        if (Date.now() > record.expiresAt) {
            this.store.delete(key);
            return undefined;
        }
        // refresh recency
        this.store.delete(key);
        this.store.set(key, record);
        return record.value;
    }
    set(key, value) {
        if (this.store.has(key)) {
            this.store.delete(key);
        }
        this.evictIfNeeded();
        this.store.set(key, {
            value,
            expiresAt: Date.now() + this.ttlMs,
        });
    }
    evictIfNeeded() {
        if (this.store.size < this.maxEntries) {
            return;
        }
        // remove oldest entry
        const oldestKey = this.store.keys().next().value;
        if (oldestKey !== undefined) {
            this.store.delete(oldestKey);
        }
    }
}
exports.InMemoryCache = InMemoryCache;
//# sourceMappingURL=cache.js.map
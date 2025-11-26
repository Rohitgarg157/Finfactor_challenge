type CacheRecord<T> = {
  value: T;
  expiresAt: number;
};

export class InMemoryCache<T> {
  private store = new Map<string, CacheRecord<T>>();

  constructor(private readonly ttlMs: number, private readonly maxEntries: number) {}

  get(key: string): T | undefined {
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

  set(key: string, value: T): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    }

    this.evictIfNeeded();
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  private evictIfNeeded(): void {
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


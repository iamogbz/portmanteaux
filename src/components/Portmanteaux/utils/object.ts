type Key = string | number;

type CollectionToObject<T> = T extends Map<Key, infer V>
  ? Record<Key, CollectionToObject<V>>
  : T extends Set<infer V>
  ? CollectionToObject<V>[]
  : T;

export function collectionToObject<V>(
  c: Map<Key, V> | Set<V> | unknown
): CollectionToObject<typeof c> {
  if (c instanceof Map) {
    const o = {} as CollectionToObject<Map<Key, V>>;
    c.forEach((v: V, k: Key) => {
      o[k] = collectionToObject(v);
    });
    return o;
  } else if (c instanceof Set) {
    const l = [] as CollectionToObject<Set<V>>;
    c.forEach((v: V) => {
      l.push(collectionToObject(v));
    });
    return l;
  } else {
    return c;
  }
}

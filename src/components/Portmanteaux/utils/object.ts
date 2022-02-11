type Key = string | number;

type CollectionToObject<T> = T extends Map<Key, infer V>
  ? Record<Key, CollectionToObject<V>>
  : T extends Set<infer V>
  ? CollectionToObject<V>[]
  : T;

export function collectionToObject<V>(
  c: Map<Key, V> | Set<V> | V
): CollectionToObject<typeof c> {
  if (c instanceof Map) {
    const o = {} as CollectionToObject<Map<Key, V>>;
    c.forEach((v: V, k: Key) => {
      o[k] = collectionToObject(v) as CollectionToObject<V>;
    });
    return o;
  } else if (c instanceof Set) {
    const l = [] as CollectionToObject<Set<V>>;
    c.forEach((v: V) => {
      l.push(collectionToObject(v) as CollectionToObject<V>);
    });
    return l;
  } else {
    return c as CollectionToObject<V>;
  }
}

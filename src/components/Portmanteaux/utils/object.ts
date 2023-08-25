type CollectionKey<T> = T extends Map<infer K, any>
  ? K extends keyof any
    ? K
    : never
  : never;

type CollectionValue<T> = T extends Map<keyof any, infer V>
  ? V
  : T extends Set<infer U>
  ? U
  : never;

type CollectionPojo<T> = CollectionKey<T> extends never
  ? CollectionValue<T> extends never
    ? T
    : Array<CollectionPojo<CollectionValue<T>>>
  : Record<CollectionKey<T>, CollectionPojo<CollectionValue<T>>>;

export function collectionToObject<T>(c: T): CollectionPojo<T> {
  if (c instanceof Map) {
    const o = {} as Record<
      CollectionKey<T>,
      CollectionPojo<CollectionValue<T>>
    >;
    c.forEach((v: CollectionValue<T>, k: CollectionKey<T>) => {
      o[k] = collectionToObject(v);
    });
    return o as CollectionPojo<T>;
  } else if (c instanceof Set) {
    const l = [] as Array<CollectionPojo<CollectionValue<T>>>;
    c.forEach((v: CollectionValue<T>) => {
      l.push(collectionToObject(v));
    });
    return l as CollectionPojo<T>;
  } else {
    return c as CollectionPojo<T>;
  }
}

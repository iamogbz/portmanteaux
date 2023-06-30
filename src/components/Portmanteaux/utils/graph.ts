import { collectionToObject } from '../../Portmanteaux/utils/object';

export function* findAllPaths<T>(
  directionalGraph: Map<T, Map<T, number>>,
  source: T,
  target?: T
): Generator<T[]> {
  const currentPath: T[] = [];
  const nodesToVisit: (readonly [T, number])[] = [[source, 0]];

  while (nodesToVisit.length > 0) {
    const [[currentNode, currentDepth]] = nodesToVisit.splice(0, 1);
    currentPath.splice(currentDepth);
    currentPath.push(currentNode);

    const seenNodes = new Set(currentPath);
    const childNodes = Array.from(directionalGraph.get(currentNode) ?? [])
      .filter(([n]) => !seenNodes.has(n))
      .map(([n]) => [n, currentDepth + 1] as const);

    nodesToVisit.splice(0, 0, ...childNodes);

    const isSufficient = currentPath.length > 2;
    const isDone = childNodes.length === 0 || currentNode === target;
    if (isDone && isSufficient) {
      yield currentPath.slice(1, -1);
    }
  }
}

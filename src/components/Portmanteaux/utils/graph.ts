export function findAllPaths<T>(
  directionalGraph: Map<T, Set<T>>,
  source: T,
  target: T,
  currentPath: T[] = []
): T[][] {
  const path = [...currentPath, source];
  if (source === target) {
    return [path];
  }

  const nextNodes = directionalGraph.get(source);
  if (!nextNodes?.size) {
    return [];
  }

  return Array.from(nextNodes)
    .filter((node) => !path.includes(node))
    .map((node) => findAllPaths(directionalGraph, node, target, path))
    .reduce((previous, current) => [...previous, ...current]);
}

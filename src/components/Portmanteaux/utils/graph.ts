export function findAllPaths<T>(
  directionalGraph: Map<T, Set<T>>,
  source: T,
  target: T
): T[][] {
  const finishedPaths: T[][] = [];
  const ongoingPaths: T[][] = [[source]];

  while (ongoingPaths.length > 0) {
    const currentPath = ongoingPaths.pop();
    if (!currentPath) continue;
    const seenNodes = new Set(currentPath);
    const lastNode = currentPath[currentPath.length - 1];
    directionalGraph.get(lastNode)?.forEach((nextNode) => {
      if (seenNodes.has(nextNode)) return;
      const newPath = [...currentPath, nextNode];
      if (nextNode === target) finishedPaths.push(newPath);
      else ongoingPaths.push(newPath);
    });
  }

  return finishedPaths;
}

/**
 * 1
 * 1 2
 * 1 3
 */
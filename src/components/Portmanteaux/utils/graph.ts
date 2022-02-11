// export function findAllPaths<T>(
//   directionalGraph: Map<T, Set<T>>,
//   source: T,
//   target: T
// ): T[][] {
//   const finishedPaths: T[][] = [];
//   const ongoingPaths: T[][] = [[source]];

//   while (ongoingPaths.length > 0) {
//     const currentPath = ongoingPaths.pop();
//     if (!currentPath) continue;
//     const seenNodes = new Set(currentPath);
//     const lastNode = currentPath[currentPath.length - 1];
//     directionalGraph.get(lastNode)?.forEach((nextNode) => {
//       if (seenNodes.has(nextNode)) return;
//       const newPath = [...currentPath, nextNode];
//       if (nextNode === target) finishedPaths.push(newPath);
//       else ongoingPaths.push(newPath);
//     });
//   }

//   return finishedPaths;
// }

export function* findAllPaths<T>(
  directionalGraph: Map<T, Set<T>>,
  source: T,
  target: T
): Generator<T[]> {
  const depth = 0;
  const currentPath: T[] = [];
  const nodesToVisit: [T, number][] = [[source, depth]];
  const seenNodes = new Set();
  // const excludeSeen = (node: T) => !seenNodes.has(node);
  const generatedPathsCache: Map<T, T[][]> = new Map();
  while (nodesToVisit.length > 0) {
    const [[currentNode, currentDepth]] = nodesToVisit.splice(0, 1);
    seenNodes.add(currentNode);
    nodesToVisit.splice(
      0,
      0,
      ...Array.from(directionalGraph.get(currentNode) ?? [])
        // .filter(excludeSeen)
        .map((n) => [n, currentDepth + 1] as [T, number])
    );
    console.log('currentPath:', `${currentPath}`);
    console.log('currentNode:', currentNode);
    console.log('nextNodes:', `${nodesToVisit}`);

    currentPath.push(currentNode);
    if (currentNode === target) {
      yield [...currentPath];
      currentPath.splice(-currentDepth + 1, currentDepth);
    }
  }
}

/**
 * {0:[1,2],1:[3,4],2:[4,5],3:[4]}
 * target: 4
 * next    | path
 * [0]     | []
 * [1,2]   | [0]
 * [3,4,2] | [0,1]
 * [4,4,2] | [0,1,3]
 * [4,2]   | [0,1,3,4] -> yield
 * [2]     | [0,1,4] -> yield
 */

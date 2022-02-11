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
  directionalGraph: Map<T, Map<T, number>>,
  source: T,
  target: T
): Generator<T[]> {
  const currentPath: T[] = [];
  const nodesToVisit: (readonly [T, number])[] = [[source, 0]];
  // const seenNodes = new Set();
  // const excludeSeen = (node: T) => !seenNodes.has(node);
  const generatedPathsCache: Map<T, T[][]> = new Map();
  while (nodesToVisit.length > 0) {
    const [[currentNode, currentDepth]] = nodesToVisit.splice(0, 1);
    // seenNodes.add(currentNode);
    const childNodes = Array.from(directionalGraph.get(currentNode) ?? [])
      // .filter(excludeSeen)
      .map(([n]) => [n, currentDepth + 1] as const);

    console.log('---');
    console.log('currentPath:', `[${currentPath}]`);
    console.log('currentNode:', currentNode);
    console.log('currentDepth:', currentDepth);
    console.log('childNodes:', `[${childNodes}]`);
    console.log('nextNodes:', `[${nodesToVisit}]`);
    console.log('---');

    currentPath.push(currentNode);
    nodesToVisit.splice(0, 0, ...childNodes);

    if (currentNode === target) {
      // cache each fully traversed path
      // if (!generatedPathsCache.has(currentPath[1])) {
      //   generatedPathsCache.set(currentPath[1], []);
      // }
      // generatedPathsCache.get(currentPath[1]).push(currentPath);

      console.log('yielded:', `${currentPath}`);
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

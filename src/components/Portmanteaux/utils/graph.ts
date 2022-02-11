// export function findAllPaths<T>(
//   directionalGraph: Map<T, Set<T>>,
//   source: T,
//   target: T
// ): T[][] {
//   const finishedPaths: T[][] = [];
//   const ongoingPaths: T[][] = [[source]];

import { collectionToObject } from '../../Portmanteaux/utils/object';

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
  target?: T
): Generator<T[]> {
  const currentPath: T[] = [];
  const nodesToVisit: (readonly [T, number])[] = [[source, 0]];
  // const seenNodes = new Set();
  // const excludeSeen = (node: T) => !seenNodes.has(node);
  const generatedPathsCache: Map<T, T[][]> = new Map();
  while (nodesToVisit.length > 0) {
    const [[currentNode, currentDepth]] = nodesToVisit.splice(0, 1);
    currentPath.splice(currentDepth);
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

    const isSufficient = currentPath.length > 2;
    const isDone = childNodes.length === 0 || currentNode === target;
    if (isDone && isSufficient) {
      const completePath = currentPath.slice(1, -1);
      // cache each fully traversed path
      if (!generatedPathsCache.has(completePath[0])) {
        generatedPathsCache.set(completePath[0], []);
      }
      generatedPathsCache.get(completePath[0]).push(completePath);

      console.log('yielded:', `${completePath}`);
      yield completePath;
    }
    console.log('all:', collectionToObject(generatedPathsCache));
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

import * as React from 'react';
// import { collectionToObject } from '../utils/object';
import { findAllPaths } from '../utils/graph';

import { useWords } from './useWords';

const WORD_COUNT = 1000;
const UNIQUE_LETTERS = 3;
const TOKEN_SOURCE = '{S}'; // special string to mark start of portmanteaux
const TOKEN_TARGET = '{T}'; // special string to mark end of portmanteaux

function buildPortmanteau(left: string, right: string, overlap: number) {
  return `${left.substr(0, left.length - overlap)}${right}`;
}

function buildPortmaneaux(words: Set<string>) {
  const wordToSuffixes: Map<string, Set<string>> = new Map();
  const prefixesToWords: Map<string, Set<string>> = new Map();
  for (const word of words) {
    if (!wordToSuffixes.has(word)) {
      wordToSuffixes.set(word, new Set());
    }
    for (let i = UNIQUE_LETTERS; i < word.length; i++) {
      wordToSuffixes.get(word)?.add(word.substr(-i));
      const prefix = word.substring(0, i);
      if (!prefixesToWords.has(prefix)) {
        prefixesToWords.set(prefix, new Set());
      }
      prefixesToWords.get(prefix)?.add(word);
    }
  }

  // console.log(
  // 'prefix suffix maps:'
  // '\n[suffixes]',
  // collectionToObject(wordToSuffixes),
  // '\n[prefixes]',
  // collectionToObject(prefixesToWords)
  // );

  const wordGraph = new Map<string, Map<string, number>>();

  // check all words for the start of a portmanteau
  wordGraph.set(TOKEN_SOURCE, new Map(Array.from(words).map((w) => [w, 0])));
  for (const [sourceWord, suffixes] of wordToSuffixes) {
    // all words can traverse to end to complete path
    wordGraph.set(sourceWord, new Map([[TOKEN_TARGET, 0]]));
    for (const connection of suffixes) {
      prefixesToWords.get(connection)?.forEach((targetWord) => {
        // if (!portmanteauPairs.has(sourceWord)) {
        //   portmanteauPairs.set(sourceWord, new Map());
        // }
        const overlap = connection.length;
        // set overlap of portmanteau pair for easy combination later
        // portmanteauPairs.get(sourceWord)!.set(targetWord, overlap);
        // filter out portmanteaus that are existing full words
        const portmanteau = buildPortmanteau(sourceWord, targetWord, overlap);
        if (words.has(portmanteau)) return;
        // set mapping of source word (left) to target word (right) for portmanteaus
        wordGraph.get(sourceWord)!.set(targetWord, overlap);
      });
    }
  }

  console.log(
    'word connectome:',
    wordGraph.size,
    'nodes'
    // '\n[graph]',
    // collectionToObject(wordGraph),
    // '\n[pairs]',
    // collectionToObject(portmanteauPairs)
  );

  const findAllPathsLogLabel = 'found all paths:';
  console.time(findAllPathsLogLabel);
  const allPortmanteauPaths = [
    ...findAllPaths(wordGraph, TOKEN_SOURCE, TOKEN_TARGET),
  ].filter((path) => path.length > 3); // exclude single word paths
  console.timeEnd(findAllPathsLogLabel);
  console.log(
    findAllPathsLogLabel,
    allPortmanteauPaths.length,
    'items'
    // allPortmanteauPaths
  );

  const allPortmanteaux = allPortmanteauPaths.map((pathWithEnds) => {
    const path = pathWithEnds.slice(1, -1);
    let portmanteaux = path[0];
    for (let i = 1; i < path.length; i++) {
      const [left, right] = path.slice(i - 1, i + 1);
      const overlap = wordGraph.get(left)!.get(right)!;
      portmanteaux = buildPortmanteau(portmanteaux, right, overlap);
    }
    return portmanteaux;
  });

  return allPortmanteaux;
}

export function usePortmanteaux(): string[] {
  const words = useWords(WORD_COUNT, UNIQUE_LETTERS);
  const [portmanteauxList, setPortmanteauxList] = React.useState<string[]>([]);

  React.useEffect(() => {
    const uniquePortmanteaus = buildPortmaneaux(words);
    setPortmanteauxList(Array.from(uniquePortmanteaus));
  }, [words]);

  return portmanteauxList;
}

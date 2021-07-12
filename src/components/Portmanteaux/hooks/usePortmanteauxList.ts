import * as React from 'react';
import { findAllPaths } from '../utils/graph';

import { useWordList } from './useWordList';

const UNIQUE_LETTERS = 3;
const TOKEN_SOURCE = '[S]'; // special string to mark start of portmanteaux
const TOKEN_TARGET = '[T]'; // special string to mark end of portmanteaux

function buildPortmanteau(left: string, right: string, overlap: number) {
  return left + right.substr(overlap - right.length);
}

function buildPortmaneauxChain(wordList: string[]) {
  const wordToSuffixes: Map<string, Set<string>> = new Map();
  const prefixesToWords: Map<string, Set<string>> = new Map();
  for (const word of wordList) {
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

  const words = new Set(wordList);
  const portmanteauPairs = new Map<string, Map<string, number>>();
  const wordGraph = new Map<string, Set<string>>();

  // start can traverse to all words to build path
  wordGraph.set(TOKEN_SOURCE, words);

  for (const [sourceWord, suffixes] of wordToSuffixes) {
    for (const connection of suffixes) {
      prefixesToWords.get(connection)?.forEach((targetWord) => {
        const overlap = connection.length;
        // set overlap of portmanteau pair for easy combination later
        if (!portmanteauPairs.has(sourceWord)) {
          portmanteauPairs.set(sourceWord, new Map());
        }
        portmanteauPairs.get(sourceWord)!.set(targetWord, overlap);

        // filter out portmanteaus that are existing full words
        const portmanteau = buildPortmanteau(sourceWord, targetWord, overlap);
        if (words.has(portmanteau)) {
          return;
        }

        // set mapping of source word (left) to target word (right) for portmanteaus
        if (!wordGraph.has(sourceWord)) {
          // all words can traverse to end to complete path
          wordGraph.set(sourceWord, new Set([TOKEN_TARGET]));
        }
        wordGraph.get(sourceWord)!.add(targetWord);
      });
    }
  }

  const allPortmanteauPaths = findAllPaths(
    wordGraph,
    TOKEN_SOURCE,
    TOKEN_TARGET
  );
  const allPortmanteaux = allPortmanteauPaths.map((pathWithEnds) => {
    const path = pathWithEnds.slice(1, -1);
    let portmanteaux = path[0];
    for (let i = 1; i < path.length; i++) {
      const [left, right] = path.slice(i - 1, i + 1);
      const overlap = portmanteauPairs.get(left)!.get(right)!;
      portmanteaux = buildPortmanteau(portmanteaux, right, overlap);
    }
    return portmanteaux;
  });

  return allPortmanteaux;
}

function shouldIncludeWord(word: string): boolean {
  return new Set(word.split('')).size >= UNIQUE_LETTERS;
}

export function usePortmanteauxList(): string[] {
  const wordList = useWordList();
  const [portmanteauxList, setPortmanteauxList] = React.useState<string[]>([]);

  const acceptedWords = React.useMemo(() => {
    return wordList.filter(shouldIncludeWord);
  }, [wordList]);

  React.useEffect(() => {
    const uniquePortmanteaus = new Set(buildPortmaneauxChain(acceptedWords));
    setPortmanteauxList(Array.from(uniquePortmanteaus));
  }, [acceptedWords]);

  return portmanteauxList;
}

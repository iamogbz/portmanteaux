import * as React from 'react';

import { useWordList } from './useWordList';

function concatSets<T>(...sets: Set<T>[]): Set<T> {
  return sets.reduce((acc, val) => {
    val.forEach(acc.add);
    return acc;
  }, new Set<T>());
}

function buildPortmaneauxChain(wordList: string[]) {
  const wordToSuffixes: Map<string, Set<string>> = new Map();
  const prefixesToWords: Map<string, Set<string>> = new Map();

  for (const word of wordList) {
    if (!wordToSuffixes.has(word)) {
      wordToSuffixes.set(word, new Set());
    }
    for (let i = 3; i < word.length; i++) {
      wordToSuffixes.get(word)?.add(word.substr(-i));
      const prefix = word.substr(0, i);
      if (!prefixesToWords.has(prefix)) {
        prefixesToWords.set(prefix, new Set());
      }
      prefixesToWords.get(prefix)?.add(word);
    }
  }

  function buildPortmanteaux(
    word: string,
    portmanteaux = '',
    skip: Set<string> = new Set()
  ): Set<string> {
    const suffixes = Array.from(wordToSuffixes.get(word) ?? []).filter(
      (suffix) => skip.has(suffix)
    );
    const nextPortmanteaux = portmanteaux.substr(-word.length) + word;
    const nextSkip = new Set([...skip, ...suffixes, word]);
    return concatSets(
      ...suffixes.map((nextWord) =>
        buildPortmanteaux(nextWord, nextPortmanteaux, nextSkip)
      )
    );
  }

  return concatSets(
    ...Array.from(wordToSuffixes.keys()).map((word) => buildPortmanteaux(word))
  );
}

export function usePortmanteauxList(): string[] {
  const wordList = useWordList();
  const [portmanteauxList, setPortmanteauxList] = React.useState<string[]>([]);

  const wordsWithAtLeastUniqueLetters = React.useMemo(() => {
    return wordList.filter((word) => new Set(word.split('')).size > 2);
  }, [wordList]);

  console.log(wordsWithAtLeastUniqueLetters);

  React.useEffect(() => {
    setPortmanteauxList(
      Array.from(buildPortmaneauxChain(wordsWithAtLeastUniqueLetters)).sort()
    );
  }, [wordsWithAtLeastUniqueLetters]);

  console.log(portmanteauxList);

  return portmanteauxList;
}

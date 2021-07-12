import * as React from 'react';

import { useWordList } from './useWordList';

function concatSets<T>(...sets: Set<T>[]): Set<T> {
  return sets.reduce((acc, val) => {
    val.forEach(acc.add);
    return acc;
  }, new Set<T>());
}

function buildPortmaneauxChain(wordList: string[]) {
  const wordToSuffixes: Record<string, Set<string>> = {};
  const prefixesToWords: Record<string, Set<string>> = {};

  for (const word of wordList) {
    if (!wordToSuffixes[word]) {
      wordToSuffixes[word] = new Set();
    }
    for (let i = 3; i < word.length; i++) {
      wordToSuffixes[word].add(word.substr(-i));
      const prefix = word.substr(0, i);
      if (!prefixesToWords[prefix]) {
        prefixesToWords[prefix] = new Set();
      }
      prefixesToWords[prefix].add(word);
    }
  }

  function buildPortmanteaux(
    word: string,
    portmanteaux = '',
    skip: Set<string> = new Set()
  ): Set<string> {
    const suffixes = wordToSuffixes[word];
    const nextPortmanteaux = portmanteaux.substr(-word.length) + word;
    const nextSkip = new Set([...skip, ...suffixes, word]);
    return concatSets(
      ...Array.from(suffixes)
        .filter(suffix => skip.has(suffix))
        .map(nextWord =>
          buildPortmanteaux(nextWord, nextPortmanteaux, nextSkip)
        )
    );
  }

  return concatSets(
    ...Object.keys(wordToSuffixes).map(word => buildPortmanteaux(word))
  );
}

function usePormanteauxList(): string[] {
  const wordList = useWordList();
  const [portmanteauxList, setPortmanteauxList] = React.useState<string[]>([]);

  const wordsWithAtLeastUniqueLetters = React.useMemo(() => {
    return wordList.filter(word => new Set(word.split('')).size > 2);
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

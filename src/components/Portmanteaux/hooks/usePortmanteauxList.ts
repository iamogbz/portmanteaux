import * as React from 'react';

import { useWordList } from './useWordList';

function buildPortmaneauxChain(wordList: string[]) {
  const wordToSuffixes: Map<string, Set<string>> = new Map();
  const prefixesToWords: Map<string, Set<string>> = new Map();

  for (const word of wordList) {
    if (!wordToSuffixes.has(word)) {
      wordToSuffixes.set(word, new Set());
    }
    for (let i = 3; i < word.length; i++) {
      wordToSuffixes.get(word)?.add(word.substr(-i));
      const prefix = word.substring(0, i);
      if (!prefixesToWords.has(prefix)) {
        prefixesToWords.set(prefix, new Set());
      }
      prefixesToWords.get(prefix)?.add(word);
    }
  }

  const allPortmanteaux = new Set<string>();

  const stack: [string, string, Set<string>][] = Array.from(wordToSuffixes.keys()).map(w => [w, '', new Set()]);

  while (stack.length && allPortmanteaux.size < 10) {
    const [suffix, portmanteaux, skip] = stack.pop()!;
    for (const nextWord of prefixesToWords.get(suffix) ?? []) {
      const nextPortmanteaux = portmanteaux + nextWord.substr(0, suffix.length);
      const suffixes = Array.from(wordToSuffixes.get(nextWord) ?? []).filter(
        (suffix) => !skip.has(suffix)
      );
      if (!suffixes.length) allPortmanteaux.add(nextPortmanteaux);
      const nextSkip = new Set([...skip, ...suffixes, nextWord]);
      suffixes.forEach(nextSuffix => stack.push([nextSuffix, nextPortmanteaux, nextSkip]))
    }
  }

  return allPortmanteaux;
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

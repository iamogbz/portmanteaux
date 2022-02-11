import * as React from 'react';

export function useWords(
  maxWordCount: number,
  minLetterCount: number,
  wordMatcher: RegExp
) {
  const [wordList, setWordList] = React.useState<string[]>();
  const [words, setWords] = React.useState(new Set<string>());

  React.useEffect(function loadWordList() {
    fetch(
      'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
    )
      .then((response) => response.text())
      .then((responseText) =>
        responseText
          .split('\n')
          .sort(() => Math.random() - Math.random())
          .map((w) => w.trim())
      )
      .then(setWordList);
  }, []);

  React.useEffect(
    function parseWordList() {
      if (!wordList) return;

      console.log(`loaded words: ${wordList.length}`, {
        maxWordCount,
        minLetterCount,
      });

      const parsedWords = wordList
        .filter((w) => w.match(wordMatcher))
        .filter((w) => new Set(w.split('')).size >= minLetterCount)
        .slice(0, maxWordCount);

      console.log(parsedWords);

      setWords(new Set(parsedWords));
    },
    [wordList, maxWordCount, minLetterCount, wordMatcher]
  );

  return words;
}

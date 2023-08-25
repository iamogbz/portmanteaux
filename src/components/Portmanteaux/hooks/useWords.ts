import * as React from 'react';

export function useWords(
  maxWordCount: number,
  minLetterCount: number,
  wordMatcher: (text: string) => boolean,
) {
  const [wordList, setWordList] = React.useState<string[]>();
  const [words, setWords] = React.useState(new Set<string>());

  React.useEffect(function loadWordList() {
    fetch(
      'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt',
    )
      .then((response) => response.text())
      .then((responseText) =>
        responseText
          .split('\n')
          .sort(() => Math.random() - Math.random())
          .map((w) => w.trim()),
      )
      .then(setWordList);
  }, []);

  React.useEffect(
    function parseWordList() {
      if (!wordList) { return; }

      const parsedWords = wordList
        .filter(wordMatcher)
        .filter((w) => new Set(w.split('')).size >= minLetterCount)
        .slice(0, maxWordCount);

      // console.log(`parsed words: ${parsedWords.length}/${wordList.length}`, {
      //   maxWordCount,
      //   minLetterCount,
      //   wordMatcher,
      // });

      setWords(new Set(parsedWords));
    },
    [wordList, maxWordCount, minLetterCount, wordMatcher],
  );

  return words;
}

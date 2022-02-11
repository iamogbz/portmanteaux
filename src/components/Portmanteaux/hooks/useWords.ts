import * as React from 'react';

export function useWords(maxWordCount: number, minLetterCount: number) {
  const [words, setWords] = React.useState(new Set<string>());

  React.useEffect(
    function loadWordList() {
      fetch(
        'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
      )
        .then((response) => response.text())
        .then((words) => {
          console.log(`loaded words: ${words.length}`, {
            maxWordCount,
            minLetterCount,
          });

          const parsedWords = words
            .split('\n')
            .sort(() => Math.random() - Math.random())
            .map((w) => w.trim())
            .slice(0, maxWordCount)
            .filter((w) => new Set(w.split('')).size >= minLetterCount);

          setWords(new Set(parsedWords));
        });
    },
    [maxWordCount, minLetterCount]
  );

  return words;
}

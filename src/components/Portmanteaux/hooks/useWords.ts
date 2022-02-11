import * as React from 'react';

export function useWords(maxWordCount: number, minLetterCount: number) {
  console.log('use words', { maxWordCount, minLetterCount });
  const [words, setWords] = React.useState(new Set<string>());

  React.useEffect(
    function loadWordList() {
      fetch(
        'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
      )
        .then((response) => response.text())
        .then((words) => {
          console.log(`loaded words: ${words.length}`);

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

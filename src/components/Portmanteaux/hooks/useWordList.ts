import * as React from 'react';

export function useWordList(): string[] {
  const [wordList, setWordList] = React.useState<string[]>([]);

  React.useEffect(function loadWordList() {
    fetch(
      'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
    )
      .then(response => response.text())
      .then(words => words.split('\n').map(w => w.trim()))
      .then(setWordList);
  }, []);

  return wordList;
}

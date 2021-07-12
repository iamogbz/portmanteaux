import * as React from "react";
import styled from "styled-components";

import { Colors } from "../../constants/styles";
import { usePormanteauxList } from './usePormanteauxList';


const Word = styled.span`
    border: solid 1px ${Colors.FOREGROUND};
    border-radius: 2px;
    margin: 2px;
    padding: 4px;
`;

export function Portmanteaux(props: { filterText?: string }): JSX.Element {
    const wordList = usePormanteauxList();
    const matchingWordList = React.useMemo(() => {
        return wordList.filter((word) => word.includes(props.filterText ?? ""));
    }, [props.filterText]);

    return (
        <div>
            {matchingWordList.map((word) => (
                <Word key={word}>{word}</Word>
            ))}
        </div>
    );
}

import * as React from 'react';
import styled from 'styled-components';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  FixedSizeGrid as Grid,
  FixedSizeGridProps,
  GridChildComponentProps,
} from 'react-window';

import { Colors } from '../../constants/styles';
import { withProps } from './hocs/withProps';
import { usePortmanteauxList } from './hooks/usePortmanteauxList';

const Word = styled.span`
  align-items: center;
  cursor: default;
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 4px;
  text-align: center;
  word-break: break-all;

  &:hover {
    color: ${Colors.PRIMARY};
  }
`;

interface AutoSizeCellProps extends GridChildComponentProps<string[]> {
  gridProps: FixedSizeGridProps<string[]>;
  getValue: (
    columnCount: number,
    columnIndex: number,
    rowIndex: number
  ) => string;
}

function AutoSizeCell({
  columnIndex,
  getValue,
  gridProps: { columnCount },
  rowIndex,
  style,
}: AutoSizeCellProps) {
  return (
    <span style={style}>
      <Word>{getValue(columnCount, columnIndex, rowIndex)}</Word>
    </span>
  );
}

interface AutoSizeGridProps
  extends Omit<
    FixedSizeGridProps<string[]>,
    'columnCount' | 'rowCount' | 'height' | 'width'
  > {
  valueCount: number;
}

function AutoSizeGrid(props: AutoSizeGridProps) {
  return (
    <AutoSizer>
      {({ height, width }) => {
        const columnCount = Math.floor(width / props.columnWidth);
        const gridProps = {
          columnCount,
          rowCount: Math.ceil(props.valueCount / columnCount),
          height: height - 50,
          width,
          ...props,
        };
        return (
          <Grid {...gridProps}>{withProps({ gridProps }, props.children)}</Grid>
        );
      }}
    </AutoSizer>
  );
}

export function Portmanteaux({
  filterText,
  ...props
}: {
  filterText?: string;
}): JSX.Element {
  const wordList = usePortmanteauxList();
  const matchingWordList = React.useMemo(() => {
    return wordList
      .filter((word) => word.startsWith(filterText ?? ''))
      .sort(function (a, b) {
        return b.length - a.length || a.localeCompare(b);
      });
  }, [wordList, filterText]);

  const getValue: AutoSizeCellProps['getValue'] = React.useCallback(
    (columnCount, columnIndex, rowIndex) => {
      const index = columnIndex + columnCount * rowIndex;
      return matchingWordList[index];
    },
    [matchingWordList]
  );

  if (!matchingWordList.length) {
    return <div style={{ textAlign: 'center'}}><h2>No results</h2></div>
  }

  return (
    <AutoSizeGrid
      {...props}
      columnWidth={144}
      rowHeight={96}
      valueCount={matchingWordList.length}
    >
      {withProps({ getValue, gridProps: null }, AutoSizeCell)}
    </AutoSizeGrid>
  );
}

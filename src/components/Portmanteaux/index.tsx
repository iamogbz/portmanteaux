import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  FixedSizeGrid as Grid,
  FixedSizeGridProps,
  GridChildComponentProps,
} from 'react-window';
import styled from 'styled-components';

import { Colors } from '../../constants/styles';
import { withProps } from './hocs/withProps';
import { usePortmanteaux } from './hooks/usePortmanteaux';

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

interface IAutoSizeCellProps extends GridChildComponentProps<string[]> {
  columnCount: number;
  getValue: (
    columnCount: number,
    columnIndex: number,
    rowIndex: number
  ) => string;
}

function AutoSizeCell({
  columnCount,
  columnIndex,
  getValue,
  rowIndex,
  style,
}: IAutoSizeCellProps) {
  return (
    <span style={style}>
      <Word>{getValue(columnCount, columnIndex, rowIndex)}</Word>
    </span>
  );
}

interface IAutoSizeGridProps
  extends Omit<
    FixedSizeGridProps<string[]>,
    'children' | 'columnCount' | 'rowCount' | 'height' | 'width'
  > {
  valueCount: number;
  children: React.ComponentType<Optional<IAutoSizeCellProps, 'getValue'>>;
}

function AutoSizeGrid({ children, ...props }: IAutoSizeGridProps) {
  return (
    <AutoSizer>
      {({ height, width }) => {
        const columnCount = Math.floor(width / props.columnWidth);
        const gridProps = {
          columnCount,
          height: height - 50,
          rowCount: Math.ceil(props.valueCount / columnCount),
          width,
          ...props,
        };
        return (
          <Grid {...gridProps}>{withProps({ columnCount }, children)}</Grid>
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
  const wordList = usePortmanteaux();
  const matchingWordList = React.useMemo(() => {
    return wordList
      .filter((word) => word.includes(filterText ?? ''))
      .sort((a, b) => b.length - a.length || a.localeCompare(b));
  }, [wordList, filterText]);

  const getValue: IAutoSizeCellProps['getValue'] = React.useCallback(
    (columnCount, columnIndex, rowIndex) => {
      const index = columnIndex + columnCount * rowIndex;
      return matchingWordList[index];
    },
    [matchingWordList]
  );

  if (!matchingWordList.length) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>No results</h2>
      </div>
    );
  }

  return (
    <AutoSizeGrid
      {...props}
      columnWidth={144}
      rowHeight={96}
      valueCount={matchingWordList.length}
    >
      {withProps({ getValue }, AutoSizeCell)}
    </AutoSizeGrid>
  );
}

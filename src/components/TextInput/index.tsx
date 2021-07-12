import * as React from 'react';
import styled from 'styled-components';

import { Colors } from '../../constants/styles';

const StyledInput = styled.input`
  border: solid 3px ${Colors.FOREGROUND};
  border-radius: 4px;
  padding: 8px;

  &:active,
  &:hover {
    border-color: ${Colors.PRIMARY};
  }
`;

export function TextInput(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > &
    React.RefAttributes<HTMLInputElement>
): JSX.Element {
  return <StyledInput {...props} />;
}

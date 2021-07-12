import * as React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { TextInput } from '../../components/TextInput';
import { Portmanteaux } from '../../components/Portmanteaux';
import { Colors } from '../../constants/styles';

const Body = styled.body`
  background: ${Colors.BACKGROUND};
  color: ${Colors.FOREGROUND};
`;

export function App(): JSX.Element {
  const [textValue, setTextValue] = React.useState('');
  const handleChange: React.ChangeEventHandler<
    HTMLInputElement
  > = React.useCallback(
    function handleChange(e) {
      e.preventDefault();
      setTextValue(e.target.value);
    },
    [setTextValue]
  );

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Portmanteaux</title>
      </Helmet>
      <Body>
        <TextInput onChange={handleChange} />
        <Portmanteaux filterText={textValue} />
      </Body>
    </>
  );
}

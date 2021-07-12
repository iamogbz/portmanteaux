import * as React from 'react';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import { Colors } from '../../constants/styles';
import { TextInput } from '../../components/TextInput';
import { Portmanteaux } from '../../components/Portmanteaux';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    background: ${Colors.BACKGROUND};
    color: ${Colors.FOREGROUND};
    font-family: monospace;
    height: 100vh;
    margin: 0;
    padding: 0;
    width: 100vw;
  }
`;

export function App(): JSX.Element {
  const [textValue, setTextValue] = React.useState('');
  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    React.useCallback(
      function handleChange(e) {
        e.preventDefault();
        setTimeout(() => setTextValue(e.target.value), 300);
      },
      [setTextValue]
    );

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Portmanteaux</title>
      </Helmet>
      <GlobalStyle />
      <div
        style={{
          alignItems: 'center',
          backgroundColor: Colors.PRIMARY,
          display: 'flex',
          justifyContent: 'center',
          padding: 4,
          height: 42,
        }}
      >
        <TextInput
          onChange={handleChange}
          placeholder="Type to filter portmanteaux"
          style={{ textAlign: 'center', width: 400 }}
        />
      </div>
      <Portmanteaux filterText={textValue} />
    </>
  );
}

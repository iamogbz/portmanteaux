import * as React from 'react';

export function withProps<
  /** static initial props given */ T,
  /** props given at render time */ U
>(initialProps: T, Component: React.ComponentType<T & U>) {
  const HOC = (props: Partial<T> & U) => (
    <Component {...initialProps} {...props} />
  );
  HOC.displayName = `withProps(${Component.displayName ?? Component.name})`;
  return HOC;
}

import * as React from 'react';

export function withProps<T, P>(initialProps: T, Component: React.ComponentType<P>) {
    const HOC = (props: P) => <Component {...initialProps} {...props} />;
    HOC.displayName = `withProps(${Component.displayName ?? Component.name})`;
    return HOC as React.ComponentType<Omit<P, keyof T>>;
  }

export type DefaultOrNot<T> = { default: T } | T;

export type Importer<T> = () => Promise<DefaultOrNot<React.ComponentType<T>>>;
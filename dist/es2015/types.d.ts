/// <reference types="react" />
export declare type Importer<T> = () => Promise<{
    default: React.ComponentType<T>;
}>;

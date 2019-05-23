/// <reference types="react" />
import { Importer } from "./types";
export declare function useSidecar<T>(importer: Importer<T>): [React.ComponentType<T> | null, Error | null];

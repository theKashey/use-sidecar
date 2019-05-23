import * as React from 'react';
import { Importer } from "./types";
export declare function sidecar<T>(importer: Importer<T>, errorComponent?: React.ReactNode): React.FunctionComponent<T>;

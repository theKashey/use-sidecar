export interface IConfig {
    onError(e: Error): void;
}
export declare const config: {
    onError: (e: any) => void;
};
export declare const setConfig: (conf: Partial<IConfig>) => void;

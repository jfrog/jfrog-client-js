export interface ILogger {
    error: (...args: any) => void;
    warn: (...args: any) => void;
    debug: (...args: any) => void;
}

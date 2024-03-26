import { XscLogLevel } from './index';

export interface XscLog {
    log_level: XscLogLevel;
    source: string;
    message: string;
}

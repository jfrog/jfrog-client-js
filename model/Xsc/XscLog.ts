import { XscLogLevel } from './XscTypes';

export interface XscLog {
    log_level: XscLogLevel;
    source: string;
    message: string;
}

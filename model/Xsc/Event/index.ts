export { ScanEvent } from './ScanEvent';
export { StartScanRequest } from './StartScanRequest';
export { ScanEventResponse } from './ScanEventResponse';
export { XscLog } from './XscLog';

export enum ScanEventStatus {
    Started = 'started',
    Completed = 'completed',
    Cancelled = 'cancelled',
    Failed = 'failed',
}

export enum ScanEventType {
    SourceCode = 1,
}

export type XscLogLevel = 'debug' | 'info' | 'warning' | 'error';

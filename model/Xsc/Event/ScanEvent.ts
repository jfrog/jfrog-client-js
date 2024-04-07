import { ScanEventStatus } from './index';

export interface ScanEvent extends ScanEventEndData {
    multi_scan_id: string;
}

export interface ScanEventEndData {
    event_status?: ScanEventStatus;
    total_findings?: number;
    total_ignored_findings?: number;
    total_scan_duration?: string;
}

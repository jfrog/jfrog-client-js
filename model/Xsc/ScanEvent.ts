import { ScanEventStatus } from './index';

export interface ScanEvent {
    multi_scan_id: string;
    event_status?: ScanEventStatus;
    total_findings?: number;
    total_ignored_findings?: number;
    total_scan_duration?: number;
}

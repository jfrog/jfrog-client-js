import { ScanEventType, ScanEventStatus } from './index';

export interface StartScanRequest {
    event_type?: ScanEventType;
    event_status?: ScanEventStatus;
    product?: string;
    product_version?: string;
    jpd_version?: string;
    jfrog_user?: string;
    os_platform?: string;
    os_architecture?: string;
    machine_id?: string;
    analyzer_manager_version?: string;
    is_default_config?: boolean;
}

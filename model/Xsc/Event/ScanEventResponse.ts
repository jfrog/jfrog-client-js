import { ScanEventEndData } from './ScanEvent';
import { StartScanRequest } from './StartScanRequest';

export interface ScanEventResponse extends StartScanRequest, ScanEventEndData {}

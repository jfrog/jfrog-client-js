import { IGraphLicense } from './GraphLicense';
import { IViolation } from './Violation';
import { IVulnerability } from './Vulnerability';

export interface IGraphResponse {
    scan_id: string;
    package_type: string;
    progress_percentage: number;
    licenses: IGraphLicense[];
    violations: IViolation[];
    vulnerabilities: IVulnerability[];
}

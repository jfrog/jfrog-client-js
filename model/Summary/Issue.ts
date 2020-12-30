import { Severity } from '../Severity';
import { ICve } from './Cve';
import { IVulnerableComponent } from './VulnerableComponent';

export interface IIssue {
    summary: string;
    description: string;
    severity: Severity;
    provider: string;
    created: string;
    issue_type: string;
    impact_path: string;
    components: IVulnerableComponent[];
    cves: ICve[];
}

import { Severity } from '../Severity';
import { ICve } from './Cve';
import { IVulnerableComponent } from './VulnerableComponent';

export interface IIssue {
    issue_id: string;
    summary: string;
    description: string;
    severity: Severity;
    provider: string;
    created: string;
    issue_type: string;
    impact_path: string;
    components: IVulnerableComponent[];
    cves: ICve[];
    references: string[];
}

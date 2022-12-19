import { Severity } from '../Severity';

export interface IExtendedInformation {
    short_description: string;
    full_description: string;
    remediation?: string;
    jfrog_research_severity: Severity;
    jfrog_research_severity_reasons?: ISeverityReasons[];
}

export interface ISeverityReasons {
    name: string;
    description: string;
    is_positive: boolean;
}

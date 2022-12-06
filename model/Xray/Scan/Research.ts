import { Severity } from '../Severity';

export interface IResearch {
  shortDescription: string;
  fullDescription: string;
  remediation?: string;
  jfrogResearchSeverity:Severity
  jfrogResearchSeverityReason?: ISeverityReasons[];
}

export interface ISeverityReasons {
  name: string;
  description: string;
  isPositive: string;
}

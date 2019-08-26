import { IGeneral } from './General';
import { IIssue } from './Issue';
import { ILicense } from './License';

export interface IArtifact {
    general: IGeneral;
    issues: IIssue[];
    licenses: ILicense[];
}

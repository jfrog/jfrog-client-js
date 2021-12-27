import { IGraphLicense, IVulnerability } from '.';

export interface IViolation extends IVulnerability, IGraphLicense {}

import { IGraphLicense, IVulnerability } from '.';

export interface IViolation extends IVulnerability, IGraphLicense {
    watch_name: string;
}

import { IImpactPath } from '.';

export interface IComponent {
    package_name: string;
    package_version: string;
    package_type: string;
    fixed_versions: string[];
    impact_paths: IImpactPath[][];
}

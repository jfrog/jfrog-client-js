import { IImpactPath } from '.';

export interface IComponent {
    fixed_versions: string[];
    impact_paths: IImpactPath[][];
}

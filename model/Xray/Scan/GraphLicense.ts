import { IComponent } from '.';
export interface IGraphLicense {
    license_key: string;
    license_name: string;
    components: Map<string, IComponent>;
    references: string[];
}

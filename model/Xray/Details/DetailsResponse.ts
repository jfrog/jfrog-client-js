import { IArtifact } from '../Summary';
import { IDetailsError } from './Error';

export interface IDetailsResponse {
    build_name: string;
    build_number: string;
    is_scan_completed: boolean;
    components: IArtifact[];
    error_details: IDetailsError;
}

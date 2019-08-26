import { IError } from './Error';
import { IArtifact } from './Artifact';

export interface ISummaryResponse {
    artifacts: IArtifact[];
    errors: IError[];
}

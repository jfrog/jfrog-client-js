import { ILogger } from '../../model';
import { BaseLogger } from '../BaseLogger';

const PREFIX: string = 'ArtifactoryClient: ';

export class ArtifactoryLogger extends BaseLogger {
    constructor(logger: ILogger) {
        super(logger, PREFIX);
    }
}

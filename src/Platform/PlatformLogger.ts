import { ILogger } from '../../model';
import { BaseLogger } from '../BaseLogger';

const PREFIX: string = 'PlatformClient: ';

export class PlatformLogger extends BaseLogger {
    constructor(logger: ILogger) {
        super(logger, PREFIX);
    }
}

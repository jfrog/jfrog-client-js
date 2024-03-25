import { ILogger } from '../../model';
import { BaseLogger } from '../BaseLogger';

const PREFIX: string = 'XscClient: ';

export class XscLogger extends BaseLogger {
    constructor(logger: ILogger) {
        super(logger, PREFIX);
    }
}

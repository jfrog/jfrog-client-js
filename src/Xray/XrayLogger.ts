import { ILogger } from '../../model';
import { BaseLogger } from '../BaseLogger';

const PREFIX: string = 'XrayClient: ';

export class XrayLogger extends BaseLogger {
    constructor(logger: ILogger) {
        super(logger, PREFIX);
    }
}

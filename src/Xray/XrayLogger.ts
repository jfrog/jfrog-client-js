import { ILogger } from '../../model';
import { BaseLogger } from '../BaseLogger';

const PREFIX = 'XrayClient::';

export class XrayLogger extends BaseLogger {
    constructor(logger: ILogger) {
        super(logger, PREFIX);
    }
}

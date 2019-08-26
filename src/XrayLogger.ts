import { ILogger } from '../model/Logger';

const PREFIX = 'XrayClient::';

export class XrayLogger {
    constructor(private readonly logger: ILogger) {}

    public warn(str: string): void {
        this.logger.warn(PREFIX + str);
    }

    public debug(str: string): void {
        this.logger.debug(PREFIX + str);
    }

    public error(str: string): void {
        this.logger.error(PREFIX + str);
    }
}

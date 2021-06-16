import { ILogger } from '../model/';

export abstract class BaseLogger {
    protected constructor(private readonly logger: ILogger, private readonly prefix: string) {}

    public warn(str: string): void {
        this.logger.warn(this.prefix + str);
    }

    public debug(str: string): void {
        this.logger.debug(this.prefix + str);
    }

    public error(str: string): void {
        this.logger.error(this.prefix + str);
    }
}

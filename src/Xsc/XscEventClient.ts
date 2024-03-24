import { HttpClient } from '..';
import { IRequestParams } from '../HttpClient';

import { ILogger } from '../../model/';
import { XscLog } from './XscLog';

export class XscEventClient {
    static readonly logEventEndpoint: string = 'api/v1/event/logMessage';
    static readonly startScanEventEndpoint: string = 'api/v1/scan/graph';
    static readonly endScanEventEndpoint: string = 'api/v1/scan/graph';

    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

    public async log(logEvent: XscLog): Promise<boolean> {
        this.logger.debug("Sending POST event/logMessage request...");
        const requestParams: IRequestParams = {
            url: XscEventClient.logEventEndpoint,
            method: 'POST',
            data: logEvent,
        };
        try {
            await this.httpClient.doAuthRequest(requestParams);
            return true;
        } catch (error) {
            this.logger.debug(error);
            return false;
        }
    }

    public async startScan(): Promise<string> {
        //
        return '';
    }

    public async endScan(msi: string): Promise<void> {
        //
    }
}
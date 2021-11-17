import { HttpClient } from '../HttpClient';
import { XraySystemClient } from './XraySystemClient';
import { ILogger } from '../../model';
import { XrayLogger } from './XrayLogger';
import { XraySummaryClient } from './XraySummaryClient';
import { XrayDetailsClient } from './XrayDetailsClient';
import { IClientSpecificConfig } from '../../model/ClientSpecificConfig';

export class XrayClient {
    private readonly httpClient: HttpClient;
    private logger: ILogger;

    public constructor(config: IClientSpecificConfig) {
        const { serverUrl, logger = console, username, password, accessToken, proxy, headers } = config;
        if (!serverUrl) {
            throw new Error('Xray client : must provide platformUrl or xrayUrl');
        }
        this.httpClient = new HttpClient({ serverUrl, username, password, accessToken, proxy, headers });
        this.logger = new XrayLogger(logger);
    }

    public summary(): XraySummaryClient {
        return new XraySummaryClient(this.httpClient);
    }

    public system(): XraySystemClient {
        return new XraySystemClient(this.httpClient);
    }

    public details(): XrayDetailsClient {
        return new XrayDetailsClient(this.httpClient);
    }
}

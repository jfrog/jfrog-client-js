import { HttpClient } from '../HttpClient';
import { XraySystemClient } from './XraySystemClient';
import { IClientConfig, ILogger } from '../../model';
import { XrayLogger } from './XrayLogger';
import { XraySummaryClient } from './XraySummaryClient';

export class XrayClient {
    private readonly httpClient: HttpClient;
    private logger: ILogger;

    public constructor(config: IClientConfig) {
        const { serverUrl, logger = console, username, password, proxy, headers } = config;
        if (!serverUrl) {
            throw new Error('Xray client : must provide serverUrl');
        }
        this.httpClient = new HttpClient({ serverUrl, username, password, proxy, headers });
        this.logger = new XrayLogger(logger);
    }

    public summary(): XraySummaryClient {
        return new XraySummaryClient(this.httpClient);
    }

    public system(): XraySystemClient {
        return new XraySystemClient(this.httpClient);
    }
}

import { HttpClient } from './HttpClient';
import { SystemClient } from './SystemClient';
import { IClientConfig, ILogger } from '../model';
import { XrayLogger } from './XrayLogger';
import { SummaryClient } from './SummaryClient';

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

    public summary(): SummaryClient {
        return new SummaryClient(this.httpClient);
    }

    public system(): SystemClient {
        return new SystemClient(this.httpClient);
    }
}

import { HttpClient } from '../HttpClient';
import { ILogger } from '../../model/';
import { XscLogger } from './XscLogger';
import { IClientSpecificConfig } from '../../model/ClientSpecificConfig';

import { XscEventClient } from './XscEventClient';
import { XscSystemClient } from './XscSystemClient';
import { XrayScanClient } from '../Xray/XrayScanClient';

export class XscClient {
    static readonly xscScanGraphEndpoint: string = 'api/v1/sca/scan/graph';

    private readonly httpClient: HttpClient;
    private logger: ILogger;

    public constructor(config: IClientSpecificConfig) {
        const {
            serverUrl,
            logger = console,
            username,
            password,
            accessToken,
            proxy,
            headers,
            retries,
            timeout,
            retryOnStatusCode,
            retryDelay,
        }: IClientSpecificConfig = config;
        if (!serverUrl) {
            throw new Error('Xsc client : must provide platformUrl');
        }
        this.logger = new XscLogger(logger);
        this.httpClient = new HttpClient(
            {
                serverUrl,
                username,
                password,
                accessToken,
                proxy,
                headers,
                retries,
                timeout,
                retryOnStatusCode,
                retryDelay,
            },
            this.logger
        );
    }

    public scan(): XrayScanClient {
        return new XrayScanClient(this.httpClient, XscClient.xscScanGraphEndpoint, this.logger);
    }

    public event(): XscEventClient {
        return new XscEventClient(this.httpClient, this.logger);
    }

    public system(): XscSystemClient {
        return new XscSystemClient(this.httpClient, this.logger);
    }
}

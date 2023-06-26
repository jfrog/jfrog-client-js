import { HttpClient } from '../HttpClient';
import { WebLoginClient } from './WebLoginClient';
import { ILogger } from '../../model/';
import { PlatformLogger } from './PlatformLogger';
import { IClientSpecificConfig } from '../../model/ClientSpecificConfig';

export class PlatformClient {
    private readonly httpClient: HttpClient;
    private logger: ILogger;

    constructor(config: IClientSpecificConfig) {
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
        }: IClientSpecificConfig = config;
        this.logger = new PlatformLogger(logger);

        this.httpClient = new HttpClient(
            { serverUrl, username, password, accessToken, proxy, headers, retries, timeout, retryOnStatusCode },
            this.logger
        );
    }

    public WebLogin(): WebLoginClient {
        return new WebLoginClient(this.httpClient);
    }
}

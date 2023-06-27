import { HttpClient } from '../HttpClient';
import { WebLoginClient } from './WebLoginClient';
import { ILogger } from '../../model/';
import { PlatformLogger } from './PlatformLogger';
import { IClientSpecificConfig } from '../../model/ClientSpecificConfig';
import { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

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
            retryDelay,
        }: IClientSpecificConfig = config;
        this.logger = new PlatformLogger(logger);

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

    public webLogin(): WebLoginClient {
        return new WebLoginClient(this.httpClient);
    }

    public static retryOnStatusCodeSso: (error: Error) => boolean = (error: Error): boolean => {
        if (axiosRetry.isNetworkOrIdempotentRequestError(error)) {
            return true;
        }
        if (error instanceof AxiosError) {
            return error.response?.status === 400;
        }
        return false;
    };
}

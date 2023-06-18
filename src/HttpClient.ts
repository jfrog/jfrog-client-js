import axios, { AxiosError, AxiosInstance, AxiosProxyConfig, AxiosRequestConfig } from 'axios';
import { IClientResponse, ILogger, IProxyConfig } from '../model';
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry';
import { HttpsProxyAgent } from 'https-proxy-agent';

export class HttpClient {
    private static readonly AUTHORIZATION_HEADER: string = 'Authorization';
    private static readonly USER_AGENT_HEADER: string = 'User-Agent';
    private static readonly DEFAULT_RETRIES: number = 5;
    // Delay between retries, in milliseconds
    private static readonly DEFAULT_RETRY_DELAY_IN_MILLISECONDS: number = 1000;
    // Specifies the number of milliseconds before the request times out.
    // If the request takes longer than `DEFAULT_TIMEOUT_IN_MILLISECONDS`, the request will be aborted.
    public static readonly DEFAULT_TIMEOUT_IN_MILLISECONDS: number = 60000;
    private readonly _basicAuth: BasicAuth;
    private readonly _accessToken: string;
    private readonly _axiosInstance: AxiosInstance;

    constructor(config: IHttpConfig, private logger?: ILogger) {
        config.headers = config.headers || {};
        this.addUserAgentHeader(config.headers);
        this._axiosInstance = axios.create({
            baseURL: config.serverUrl,
            headers: config.headers,
            timeout: config.timeout,
            proxy: this.getAxiosProxyConfig(config.proxy),
            // Use instead of the default one since there is a bug in Axios if http -> https
            httpsAgent: HttpClient.getHttpToHttpsProxyConfig(config.proxy),
        } as AxiosRequestConfig);
        this._basicAuth = {
            username: config.username,
            password: config.password,
        } as BasicAuth;
        this._accessToken = config.accessToken || '';
        axiosRetry(this._axiosInstance, {
            retries: config.retries ?? HttpClient.DEFAULT_RETRIES,
            retryDelay: (retryCount: number, err: AxiosError) => {
                logger?.debug(`Request ended with error: ${err}\nRetrying (attempt #${retryCount})...`);
                return retryCount * HttpClient.DEFAULT_RETRY_DELAY_IN_MILLISECONDS;
            },
        } as IAxiosRetryConfig);
    }

    public async doRequest(requestParams: IRequestParams): Promise<IClientResponse> {
        return await this._axiosInstance(requestParams);
    }

    public async doAuthRequest(requestParams: IRequestParams): Promise<IClientResponse> {
        if (this._accessToken !== '') {
            this.addAuthHeader(requestParams);
        } else {
            requestParams.auth = this._basicAuth;
        }
        return this.doRequest(requestParams);
    }

    /**
     * Method to use for beforeRedirect attribute in IRequestParams.
     * Before redirecting checks if the target location for the redirect is for 'reactivate-server' and throws ServerNotActiveError if so.
     */
    public static validateServerIsActive(_: Record<string, any>, responseDetails: { headers: Record<string, string> }) {
        let movedLocation: string | undefined = responseDetails?.headers['location'];
        if (movedLocation && movedLocation.includes('reactivate-server')) {
            throw new ServerNotActiveError(movedLocation);
        }
    }

    private addUserAgentHeader(headers: { [key: string]: string }) {
        if (!headers[HttpClient.USER_AGENT_HEADER]) {
            headers[HttpClient.USER_AGENT_HEADER] = 'jfrog-client-js';
        }
    }

    private addAuthHeader(requestParams: IRequestParams) {
        if (!requestParams.headers) {
            requestParams.headers = {};
        }
        if (!requestParams.headers[HttpClient.AUTHORIZATION_HEADER]) {
            requestParams.headers[HttpClient.AUTHORIZATION_HEADER] = 'Bearer ' + this._accessToken;
        }
    }

    /**
     * Use to create httpsAgent to handle Http proxy sending to a https server.
     * (Artifactory is https server, proxy protocol can be both)
     * @param proxyConfig - Receives on of the three:
     * 1. IProxyConfig to use specific proxy config.
     * 2. 'false' to disable proxy.
     * 3. 'undefined' to use environment variables if exist.
     * @returns if the proxy is http protocol return httpsAgent else return undefined
     */
    public static getHttpToHttpsProxyConfig(
        proxyConfig: IProxyConfig | false | undefined
    ): HttpsProxyAgent | undefined {
        if (
            !proxyConfig ||
            !proxyConfig.host ||
            !proxyConfig.port ||
            (proxyConfig.protocol && proxyConfig.protocol.includes('https'))
        ) {
            return undefined;
        }
        return new HttpsProxyAgent(`http://${proxyConfig.host}:${proxyConfig.port}`);
    }

    /**
     * @param proxyConfig - Receives on of the three:
     * 1. IProxyConfig to use specific proxy config.
     * 2. 'false' to disable proxy.
     * 3. 'undefined' to use environment variables if exist.
     *
     * @returns AxiosProxyConfig to use specific proxy config, false to disable proxy or undefined to use environment.
     */
    private getAxiosProxyConfig(proxyConfig: IProxyConfig | false | undefined): AxiosProxyConfig | false | undefined {
        // Return false to disable proxy or undefined to use default environment variables.
        if (!proxyConfig) {
            return proxyConfig;
        }
        if (proxyConfig.protocol && !proxyConfig.protocol.includes('https')) {
            // Disable default proxy handling
            return false;
        }
        // Return undefined to use default environment variables.
        const proxyHost: string = proxyConfig.host;
        const proxyPort: number = proxyConfig.port;
        if (!proxyHost && !proxyPort) {
            return undefined;
        }
        return {
            host: proxyConfig.host,
            port: proxyConfig.port,
            protocol: proxyConfig.protocol,
        } as AxiosProxyConfig;
    }
    /**
     * Performs polling on the provided URL for a given time interval.
     * @param interval - The time interval in milliseconds at which the URL should be polled.
     * @param url - The URL to poll.
     * @param duration - The total duration of the polling process in milliseconds.
     * @returns A Promise that resolves when the polling is completed.
     */
    public async pollURLForTime(interval: number, url: string, duration: number): Promise<IClientResponse | undefined> {
        const endTime: number = Date.now() + duration;
        const request: IRequestParams = {
            url: url,
            method: 'GET',
        };
        let response: IClientResponse | undefined;
        while (Date.now() < endTime) {
            try {
                response = await this.doRequest(request);
                this.logger?.debug(`Polling ended successfully from ${url} with status ${response.status}`);
                return response;
            } catch (error) {
                this.logger?.debug(`Error polling ${url}:`, error);
            }

            // Delay in milliseconds
            await this.delay(interval);
        }
        return response;
    }

    private async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export class ServerNotActiveError extends Error {
    constructor(public readonly activationUrl: string) {
        super('Server is not active');
    }
}

interface BasicAuth {
    username: string;
    password: string;
}

export interface IHttpConfig {
    serverUrl?: string;
    username?: string;
    password?: string;
    accessToken?: string;
    proxy?: IProxyConfig | false;
    headers?: { [key: string]: string };
    retries?: number;
    timeout?: number;
}

export type method = 'GET' | 'POST' | 'HEAD';
export type responseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

export interface IRequestParams {
    url: string;
    method: method;
    data?: any;
    auth?: BasicAuth;
    timeout?: number;
    headers?: any;
    responseType?: responseType;
    validateStatus?: ((status: number) => boolean) | null;
    beforeRedirect?: (options: Record<string, any>, responseDetails: { headers: Record<string, string> }) => void;
}

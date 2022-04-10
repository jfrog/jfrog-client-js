import axios, { AxiosInstance, AxiosProxyConfig, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IProxyConfig } from '../model';
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry';

export class HttpClient {
    private static readonly AUTHORIZATION_HEADER: string = 'Authorization';
    private static readonly USER_AGENT_HEADER: string = 'User-Agent';
    private static readonly DEFAULT_RETRIES: number = 3;
    private readonly _basicAuth: BasicAuth;
    private readonly _accessToken: string;
    private readonly _axiosInstance: AxiosInstance;

    constructor(config: IHttpConfig) {
        config.headers = config.headers || {};
        this.addUserAgentHeader(config.headers);
        this._axiosInstance = axios.create({
            baseURL: config.serverUrl,
            headers: config.headers,
            proxy: this.getAxiosProxyConfig(config.proxy),
        } as AxiosRequestConfig);
        this._basicAuth = {
            username: config.username,
            password: config.password,
        } as BasicAuth;
        this._accessToken = config.accessToken || '';
        axiosRetry(this._axiosInstance, {
            retries: config.retries ? config.retries : HttpClient.DEFAULT_RETRIES,
        } as IAxiosRetryConfig);
    }

    public async doRequest(requestParams: IRequestParams): Promise<any> {
        const { data }: AxiosResponse = await this._axiosInstance(requestParams);
        return data;
    }

    public async doAuthRequest(requestParams: IRequestParams): Promise<any> {
        if (this._accessToken !== '') {
            this.addAuthHeader(requestParams);
        } else {
            requestParams.auth = this._basicAuth;
        }
        return this.doRequest(requestParams);
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
}

export type method = 'GET' | 'POST';

export interface IRequestParams {
    url: string;
    method: method;
    data?: any;
    auth?: BasicAuth;
    timeout?: number;
    headers?: any;
    validateStatus?: ((status: number) => boolean) | null;
}

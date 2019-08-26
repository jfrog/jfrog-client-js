import axios, { AxiosBasicCredentials, AxiosInstance, AxiosProxyConfig, AxiosRequestConfig } from 'axios';
import { IProxyConfig } from '../model/ProxyConfig';

export class HttpClient {
    private USER_AGENT_HEADER: string = 'User-Agent';
    private _basicCredentials: AxiosBasicCredentials | undefined;
    private _axiosInstance: AxiosInstance;

    constructor(config: IHttpConfig) {
        config.headers = config.headers || {};
        this.addUserAgentHeader(config.headers);
        this._axiosInstance = axios.create({
            baseURL: config.serverUrl,
            headers: config.headers,
            proxy: this.getAxiosProxyConfig(config.proxy)
        } as AxiosRequestConfig);
        this._basicCredentials = {
            username: config.username,
            password: config.password
        } as AxiosBasicCredentials;
    }

    public async doRequest(httpOptions: AxiosRequestConfig): Promise<any> {
        const { data } = await this._axiosInstance(httpOptions);
        return data;
    }

    public async doAuthRequest(httpOptions: AxiosRequestConfig): Promise<any> {
        httpOptions.auth = this._basicCredentials;
        return this.doRequest(httpOptions);
    }

    private addUserAgentHeader(headers: { [key: string]: string }) {
        if (!headers[this.USER_AGENT_HEADER]) {
            headers[this.USER_AGENT_HEADER] = 'jfrog-xray-client';
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
            protocol: proxyConfig.protocol
        } as AxiosProxyConfig;
    }
}

export interface IHttpConfig {
    serverUrl?: string;
    username?: string;
    password?: string;
    proxy?: IProxyConfig | false;
    headers?: { [key: string]: string };
}

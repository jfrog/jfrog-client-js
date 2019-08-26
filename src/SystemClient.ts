import { AxiosRequestConfig } from 'axios';
import { IVersion } from '../model/System/Version';
import { HttpClient } from './HttpClient';

export class SystemClient {
    private readonly pingEndpoint = '/api/v1/system/ping';
    private readonly versionEndpoint = '/api/v1/system/version';

    constructor(private readonly httpClient: HttpClient) {}

    public async ping(): Promise<boolean> {
        const httpOptions: AxiosRequestConfig = {
            url: this.pingEndpoint,
            method: 'get',
            timeout: 2000
        };
        try {
            return await this.httpClient.doRequest(httpOptions);
        } catch (error) {
            return false;
        }
    }

    public async version(): Promise<IVersion> {
        const httpOptions: AxiosRequestConfig = {
            url: this.versionEndpoint,
            method: 'get'
        };
        return await this.httpClient.doAuthRequest(httpOptions);
    }
}

import { IVersion } from '../model/System/Version';
import { HttpClient, IRequestParams } from './HttpClient';

export class SystemClient {
    private readonly pingEndpoint = '/api/v1/system/ping';
    private readonly versionEndpoint = '/api/v1/system/version';

    constructor(private readonly httpClient: HttpClient) {}

    public async ping(): Promise<boolean> {
        const requestParams: IRequestParams = {
            url: this.pingEndpoint,
            method: 'GET',
            timeout: 2000
        };
        try {
            return await this.httpClient.doRequest(requestParams);
        } catch (error) {
            return false;
        }
    }

    public async version(): Promise<IVersion> {
        const requestParams: IRequestParams = {
            url: this.versionEndpoint,
            method: 'GET'
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

import { IArtifactoryVersion } from '../../model';
import { HttpClient, IRequestParams } from '../HttpClient';

export class ArtifactorySystemClient {
    private readonly pingEndpoint = '/api/system/ping';
    private readonly versionEndpoint = '/api/system/version';

    constructor(private readonly httpClient: HttpClient) {}

    public async ping(): Promise<boolean> {
        const requestParams: IRequestParams = {
            url: this.pingEndpoint,
            method: 'GET',
            timeout: 2000,
        };
        try {
            return await this.httpClient.doRequest(requestParams);
        } catch (error) {
            return false;
        }
    }

    public async version(): Promise<IArtifactoryVersion> {
        const requestParams: IRequestParams = {
            url: this.versionEndpoint,
            method: 'GET',
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

import { IArtifactoryVersion } from '../../model';
import { HttpClient, IRequestParams } from '../HttpClient';
import { ArtifactoryLogger } from './ArtifactoryLogger';

export class ArtifactorySystemClient {
    private readonly pingEndpoint = '/api/system/ping';
    private readonly versionEndpoint = '/api/system/version';

    constructor(private readonly httpClient: HttpClient, private readonly logger: ArtifactoryLogger) {}

    public async ping(): Promise<boolean> {
        this.logger.debug('Sending ping request...');
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
        this.logger.debug('Sending version request...');
        const requestParams: IRequestParams = {
            url: this.versionEndpoint,
            method: 'GET',
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

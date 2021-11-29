import { IXrayVersion } from '../../model';
import { HttpClient, IRequestParams } from '../HttpClient';
import { ILogger } from '../../model/';

export class XraySystemClient {
    private readonly pingEndpoint = '/api/v1/system/ping';
    private readonly versionEndpoint = '/api/v1/system/version';

    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

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

    public async version(): Promise<IXrayVersion> {
        this.logger.debug('Sending version request...');
        const requestParams: IRequestParams = {
            url: this.versionEndpoint,
            method: 'GET',
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

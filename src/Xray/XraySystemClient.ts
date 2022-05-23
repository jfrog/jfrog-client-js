import { IXrayVersion } from '../../model';
import { HttpClient, IRequestParams } from '../HttpClient';
import { ILogger } from '../../model/';

export class XraySystemClient {
    private readonly pingEndpoint: string = '/api/v1/system/ping';
    private readonly versionEndpoint: string = '/api/v1/system/version';

    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

    public async ping(): Promise<boolean> {
        this.logger.debug('Sending ping request...');
        const requestParams: IRequestParams = {
            url: this.pingEndpoint,
            method: 'GET',
            timeout: 2000,
        };
        try {
            return await (await this.httpClient.doRequest(requestParams)).data;
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
        return await (await this.httpClient.doAuthRequest(requestParams)).data;
    }
}

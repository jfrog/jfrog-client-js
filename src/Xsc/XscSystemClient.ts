import { IClientResponse, IXscVersion } from '../../model';
import { HttpClient, IRequestParams } from '../HttpClient';
import { ILogger } from '../../model/';

export class XscSystemClient {
    public static readonly versionEndpoint: string = '/api/v1/system/version';

    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

    public async version(): Promise<IXscVersion> {
        this.logger.debug('Sending version request...');
        const requestParams: IRequestParams = {
            url: XscSystemClient.versionEndpoint,
            method: 'GET',
        };
        let response: IClientResponse = await this.httpClient.doAuthRequest(requestParams);
        return response.data;
    }

    public async enabled(): Promise<boolean> {
        try {
            await this.version();
            return true;
        } catch (error) {
            this.logger.error('Error getting XSC enabled status', error);
            return false;
        }
    }
}

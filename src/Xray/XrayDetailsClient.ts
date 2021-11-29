import { IDetailsResponse } from '../../model';
import { HttpClient, IRequestParams } from '../HttpClient';
import { XrayLogger } from './XrayLogger';

export class XrayDetailsClient {
    constructor(private readonly httpClient: HttpClient, private readonly logger: XrayLogger) {}

    public async build(buildName: string, buildNumber: string): Promise<IDetailsResponse> {
        this.logger.debug('Sending build details request to Xray...');
        const encodedUrl: string = `api/v1/details/build?build_name=${encodeURIComponent(
            buildName
        )}&build_number=${encodeURIComponent(buildNumber)}`;
        const requestParams: IRequestParams = {
            url: encodedUrl,
            method: 'GET',
        };
        this.logger.debug('encoded URL: ' + JSON.stringify(encodedUrl));
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

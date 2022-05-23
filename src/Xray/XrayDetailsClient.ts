import { IDetailsResponse } from '../../model';
import { HttpClient, IRequestParams } from '../HttpClient';
import { ILogger } from '../../model/';

export class XrayDetailsClient {
    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

    public async build(buildName: string, buildNumber: string, projectKey?: string): Promise<IDetailsResponse> {
        this.logger.debug('Sending build details request to Xray...');
        let encodedUrl: string = `api/v1/details/build?build_name=${encodeURIComponent(
            buildName
        )}&build_number=${encodeURIComponent(buildNumber)}`;
        if (projectKey) {
            encodedUrl += `&project_key=${encodeURIComponent(projectKey)}`;
        }
        const requestParams: IRequestParams = {
            url: encodedUrl,
            method: 'GET',
        };
        this.logger.debug('encoded URL: ' + JSON.stringify(encodedUrl));
        return await (await this.httpClient.doAuthRequest(requestParams)).data;
    }
}

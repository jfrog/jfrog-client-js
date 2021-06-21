import { IDetailsResponse } from '../../model';
import { HttpClient, IRequestParams } from '../HttpClient';

export class XrayDetailsClient {
    constructor(private readonly httpClient: HttpClient) {}

    public async build(buildName: string, buildNumber: string): Promise<IDetailsResponse> {
        const encodedUrl: string = `api/v1/details/build?build_name=${encodeURIComponent(buildName)}&build_number=${encodeURIComponent(buildNumber)}`;
        const requestParams: IRequestParams = {
            url: encodedUrl,
            method: 'GET',
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

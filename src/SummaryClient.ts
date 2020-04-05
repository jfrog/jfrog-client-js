import { ISummaryRequestModel } from '../model/Summary/SummaryRequestModel';
import { ISummaryResponse } from '../model/Summary/SummaryResponse';
import { HttpClient, IRequestParams } from './HttpClient';

export class SummaryClient {
    private readonly summaryComponentsEndpoint = '/api/v1/summary/component';

    constructor(private readonly httpClient: HttpClient) {}

    public async component(model: ISummaryRequestModel): Promise<ISummaryResponse> {
        const requestParams: IRequestParams = {
            url: this.summaryComponentsEndpoint,
            method: 'POST',
            data: model
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

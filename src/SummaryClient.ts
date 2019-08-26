import { AxiosRequestConfig } from 'axios';
import { ISummaryRequestModel } from '../model/Summary/SummaryRequestModel';
import { ISummaryResponse } from '../model/Summary/SummaryResponse';
import { HttpClient } from './HttpClient';

export class SummaryClient {
    private readonly summaryComponentsEndpoint = '/api/v1/summary/component';

    constructor(private readonly httpClient: HttpClient) {}

    public async component(model: ISummaryRequestModel): Promise<ISummaryResponse> {
        const httpOptions: AxiosRequestConfig = {
            url: this.summaryComponentsEndpoint,
            method: 'post',
            data: model
        };
        return await this.httpClient.doAuthRequest(httpOptions);
    }
}

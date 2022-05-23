import { ISummaryRequestModel, ISummaryResponse } from '../../model';
import { HttpClient, IRequestParams } from '../HttpClient';
import { ILogger } from '../../model/';
import { IClientResponse } from '../ClientResponse';

export class XraySummaryClient {
    private readonly summaryComponentsEndpoint: string = '/api/v1/summary/component';

    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

    public async component(model: ISummaryRequestModel): Promise<ISummaryResponse> {
        this.logger.debug('Sending summary/component request...');
        const requestParams: IRequestParams = {
            url: this.summaryComponentsEndpoint,
            method: 'POST',
            data: model,
        };
        this.logger.debug('data: ' + JSON.stringify(model));
        const response: IClientResponse = await this.httpClient.doAuthRequest(requestParams);
        return response.data;
    }
}

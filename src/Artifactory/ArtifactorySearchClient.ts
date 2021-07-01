import { HttpClient, IRequestParams } from '../HttpClient';
import { IAqlSearchResult } from '../../model';

export class ArtifactorySearchClient {
    private readonly aqlEndpoint = '/api/search/aql';

    constructor(private readonly httpClient: HttpClient) {}

    public async aqlSearch(aqlQuery: string): Promise<IAqlSearchResult> {
        const requestParams: IRequestParams = {
            url: this.aqlEndpoint,
            method: 'POST',
            data: aqlQuery,
            headers: { 'Content-Type': 'text/plain' },
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

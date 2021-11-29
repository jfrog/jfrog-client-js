import { HttpClient, IRequestParams } from '../HttpClient';
import { IAqlSearchResult } from '../../model';
import { ArtifactoryLogger } from './ArtifactoryLogger';

export class ArtifactorySearchClient {
    private readonly aqlEndpoint = '/api/search/aql';

    constructor(private readonly httpClient: HttpClient, private readonly logger: ArtifactoryLogger) {}

    public async aqlSearch(aqlQuery: string): Promise<IAqlSearchResult> {
        this.logger.debug('Sending AQL request...');
        const requestParams: IRequestParams = {
            url: this.aqlEndpoint,
            method: 'POST',
            data: aqlQuery,
            headers: { 'Content-Type': 'text/plain' },
        };
        this.logger.debug('AQL query: ' + JSON.stringify(aqlQuery));
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

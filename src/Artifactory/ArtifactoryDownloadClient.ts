import { HttpClient, IRequestParams } from '../HttpClient';

export class ArtifactoryDownloadClient {
    constructor(private readonly httpClient: HttpClient) {}

    public async downloadArtifact(artifactPath: string): Promise<string> {
        const requestParams: IRequestParams = {
            url: encodeURI(artifactPath),
            method: 'GET',
            headers: { Connection: 'Keep-Alive' },
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

import { HttpClient, IRequestParams } from '../HttpClient';
import { ArtifactoryLogger } from './ArtifactoryLogger';

export class ArtifactoryDownloadClient {
    constructor(private readonly httpClient: HttpClient, private readonly logger: ArtifactoryLogger) {}

    public async downloadArtifact(artifactPath: string): Promise<string> {
        this.logger.debug('Sending download artifact request...');
        const requestParams: IRequestParams = {
            url: encodeURI(artifactPath),
            method: 'GET',
            headers: { Connection: 'Keep-Alive' },
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

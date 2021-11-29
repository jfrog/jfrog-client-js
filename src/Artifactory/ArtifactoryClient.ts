import { HttpClient } from '../HttpClient';
import { ArtifactoryLogger } from './ArtifactoryLogger';
import { ArtifactorySystemClient } from './ArtifactorySystemClient';
import { ArtifactorySearchClient } from './ArtifactorySearchClient';
import { ArtifactoryDownloadClient } from './ArtifactoryDownloadClient';
import { IClientSpecificConfig } from '../../model/ClientSpecificConfig';

export class ArtifactoryClient {
    private readonly httpClient: HttpClient;
    private logger: ArtifactoryLogger;

    public constructor(config: IClientSpecificConfig) {
        const { serverUrl, logger = console, username, password, accessToken, proxy, headers } = config;
        if (!serverUrl) {
            throw new Error('Artifactory client : must provide platformUrl or artifactoryUrl');
        }
        this.httpClient = new HttpClient({ serverUrl, username, password, accessToken, proxy, headers });
        this.logger = new ArtifactoryLogger(logger);
    }

    public system(): ArtifactorySystemClient {
        return new ArtifactorySystemClient(this.httpClient, this.logger);
    }

    public search(): ArtifactorySearchClient {
        return new ArtifactorySearchClient(this.httpClient, this.logger);
    }

    public download(): ArtifactoryDownloadClient {
        return new ArtifactoryDownloadClient(this.httpClient, this.logger);
    }
}

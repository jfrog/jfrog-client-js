import { HttpClient } from '../HttpClient';
import { ArtifactoryLogger } from './ArtifactoryLogger';
import { ArtifactorySystemClient } from './ArtifactorySystemClient';
import { ArtifactorySearchClient } from './ArtifactorySearchClient';
import { ArtifactoryDownloadClient } from './ArtifactoryDownloadClient';
import { IClientSpecificConfig } from '../../model/ClientSpecificConfig';
import { ILogger } from '../../model/';

export class ArtifactoryClient {
    private readonly httpClient: HttpClient;
    private logger: ILogger;

    public constructor(config: IClientSpecificConfig, private readonly clientId?: string) {
        const {
            serverUrl,
            logger = console,
            username,
            password,
            accessToken,
            proxy,
            headers,
            retries,
            timeout,
            retryOnStatusCode,
            retryDelay,
        }: IClientSpecificConfig = config;
        if (!serverUrl) {
            throw new Error('Artifactory client : must provide platformUrl or artifactoryUrl');
        }
        this.logger = new ArtifactoryLogger(logger);
        this.httpClient = new HttpClient(
            { serverUrl, username, password, accessToken, proxy, headers, retries, timeout, retryOnStatusCode, retryDelay },
            this.logger
        );
    }

    public system(): ArtifactorySystemClient {
        return new ArtifactorySystemClient(this.httpClient, this.logger, this.clientId);
    }

    public search(): ArtifactorySearchClient {
        return new ArtifactorySearchClient(this.httpClient, this.logger);
    }

    public download(): ArtifactoryDownloadClient {
        return new ArtifactoryDownloadClient(this.httpClient, this.logger);
    }
}

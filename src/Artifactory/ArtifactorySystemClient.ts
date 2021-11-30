import { IArtifactoryVersion, IUsageData, IUsageFeature } from '../../model';
import { HttpClient, IRequestParams } from '../HttpClient';
import { ILogger } from '../../model/';

export class ArtifactorySystemClient {
    private readonly pingEndpoint = '/api/system/ping';
    private readonly versionEndpoint = '/api/system/version';
    private readonly usageEndpoint = '/api/system/usage';

    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

    public async ping(): Promise<boolean> {
        this.logger.debug('Sending ping request...');
        const requestParams: IRequestParams = {
            url: this.pingEndpoint,
            method: 'GET',
            timeout: 2000,
        };
        try {
            return await this.httpClient.doRequest(requestParams);
        } catch (error) {
            return false;
        }
    }

    public async version(): Promise<IArtifactoryVersion> {
        this.logger.debug('Sending version request...');
        const requestParams: IRequestParams = {
            url: this.versionEndpoint,
            method: 'GET',
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }

    public async reportUsage(userAgent: string, featureArray: IUsageFeature[]): Promise<string> {
        this.logger.debug('Sending usage report...');
        const usageData: IUsageData = {
            productId: userAgent,
            features: featureArray,
        };
        const requestParams: IRequestParams = {
            url: this.usageEndpoint,
            method: 'POST',
            data: usageData,
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

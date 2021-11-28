import { IArtifactoryVersion, IUsageData, IUsageFeature } from '../../model';
import { HttpClient, IRequestParams } from '../HttpClient';

export class ArtifactorySystemClient {
    private readonly pingEndpoint = '/api/system/ping';
    private readonly versionEndpoint = '/api/system/version';
    private readonly usageEndpoint = '/api/system/usage';

    constructor(private readonly httpClient: HttpClient) {}

    public async ping(): Promise<boolean> {
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
        const requestParams: IRequestParams = {
            url: this.versionEndpoint,
            method: 'GET',
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }

    public async reportUsage(userAgentName: string, userAgentVersion: string, featureName: string): Promise<string> {
        const feature: IUsageFeature[] = [{ featureId: featureName }];
        const usageData: IUsageData = {
            productId: userAgentName + '/' + userAgentVersion,
            features: feature,
        };
        const requestParams: IRequestParams = {
            url: this.usageEndpoint,
            method: 'POST',
            data: usageData,
        };
        return await this.httpClient.doAuthRequest(requestParams);
    }
}

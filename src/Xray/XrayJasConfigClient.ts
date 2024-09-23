import { HttpClient, IRequestParams } from '../HttpClient';
import { IClientResponse, ILogger } from '../../model';
import { IJasConfig } from '../../model/Xray/JasConfig/JasConfig';

export class XrayJasConfigClient {
    private readonly jasConfigurationEndpoint: string = '/api/v1/configuration/jas';
    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}
    /**
     *
     * Sends 'GET /configuration/js requests to Xray and waits for 200 response'.
     * @returns the jas config
     * @throws an exception if an unexpected response received from Xray
     */
    async getJasConfig(): Promise<IJasConfig> {
        this.logger.debug(`Sending GET ${this.jasConfigurationEndpoint} request...`);
        const requestParams: IRequestParams = {
            url: this.jasConfigurationEndpoint,
            method: 'GET',
            validateStatus: (status: number): boolean => {
                return status === 200;
            },
        };
        return await (
          await this.httpClient.doAuthRequest(requestParams)
        ).data;
    }
}

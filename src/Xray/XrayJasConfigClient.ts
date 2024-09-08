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
   * @throws an exception if an unexpected response received from Xray or if checkCanceled threw an exception
   */
  async getJasConfig(): Promise<IJasConfig> {
      this.logger.debug(`Sending GET ${this.jasConfigurationEndpoint} request...`);
      let receivedStatus: number | undefined;
      const requestParams: IRequestParams = {
        url: this.jasConfigurationEndpoint,
        method: 'GET',
        validateStatus: (status: number): boolean => {
          receivedStatus = status;
          return status === 200;
        },
      };
      let message: string | undefined;
      let response: IClientResponse | undefined;
      try {
        response = await this.httpClient.doAuthRequest(requestParams);
      } catch (error) {
        throw new Error(`Received unexpected response from Xray. ${String(error)}`);
      }
      this.logger.debug(`Received status '${receivedStatus}' from Xray.`);
      if (receivedStatus === 200) {
        return response?.data;
      }
      else {
        if (receivedStatus) {
          throw new Error(`Received unexpected status '${receivedStatus}' from Xray: ${message}`);
        }
        throw new Error(`Received response from Xray: ${message}`);
      }
  }

}
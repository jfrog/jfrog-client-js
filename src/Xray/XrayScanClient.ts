import { HttpClient } from '..';
import { IGraphRequestModel, IGraphResponse, ILogger } from '../../model/';
import { IRequestParams } from '../HttpClient';

export class XrayScanClient {
    private static readonly scanGraphEndpoint: string = 'api/v1/scan/graph';
    private static readonly SLEEP_INTERVAL_MILLISECONDS: number = 5000;
    private static readonly MAX_ATTEMPTS: number = 60;

    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

    public async graph(
        model: IGraphRequestModel,
        checkCanceled: () => void,
        projectKey: string | undefined,
        sleepIntervalMilliseconds: number = XrayScanClient.SLEEP_INTERVAL_MILLISECONDS
    ): Promise<IGraphResponse> {
        if (!model) {
            return {} as IGraphResponse;
        }

        const projectProvided: boolean = projectKey !== undefined && projectKey.length > 0;
        this.logger.debug('Sending POST scan/graph request...');
        const requestParams: IRequestParams = {
            url: XrayScanClient.scanGraphEndpoint + (projectProvided ? `?project=${projectKey}` : ''),
            method: 'POST',
            data: model,
        };
        this.logger.debug('data: ' + JSON.stringify(model));
        checkCanceled();
        const response: IGraphResponse = await this.httpClient.doAuthRequest(requestParams);
        return this.getScanGraphResults(response.scan_id, checkCanceled, !projectProvided, sleepIntervalMilliseconds);
    }

    private async getScanGraphResults(
        scanId: string,
        checkCanceled: () => void,
        includeVulnerabilities: boolean,
        sleepIntervalMilliseconds: number
    ): Promise<IGraphResponse> {
        const scanGraphUrl: string =
            XrayScanClient.scanGraphEndpoint +
            '/' +
            scanId +
            '?include_licenses=true' +
            `&include_vulnerabilities=${includeVulnerabilities}`;
        for (let i: number = 0; i < XrayScanClient.MAX_ATTEMPTS; i++) {
            checkCanceled();
            this.logger.debug(`Sending GET ${scanGraphUrl} request...`);
            const requestParams: IRequestParams = {
                url: scanGraphUrl,
                method: 'GET',
                validateStatus: (status: number): boolean => {
                    return status === 200;
                },
            };
            let receivedStatus: number | undefined;
            let message: string | undefined;
            const response: IGraphResponse = await this.httpClient
                .doAuthRequest(requestParams)
                .catch(async (reason: any) => {
                    receivedStatus = reason.response?.status;
                    message = reason?.message;
                });
            if (receivedStatus === 202) {
                await this.delay(sleepIntervalMilliseconds);
            } else if (receivedStatus) {
                throw new Error(`Received unexpected status '${receivedStatus}' from Xray: ${message}`);
            } else {
                return response;
            }
        }
        throw new Error('Xray get scan graph exceeded the timeout.');
    }

    private async delay(sleepIntervalMilliseconds: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, sleepIntervalMilliseconds));
    }
}

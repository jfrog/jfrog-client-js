import { HttpClient } from '..';
import { IGraphRequestModel, IGraphResponse, ILogger } from '../../model/';
import { IRequestParams } from '../HttpClient';
import { XrayScanProgress } from './XrayScanProgress';

export class XrayScanClient {
    private static readonly scanGraphEndpoint: string = 'api/v1/scan/graph';
    private static readonly SLEEP_INTERVAL_MILLISECONDS: number = 5000;
    private static readonly MAX_ATTEMPTS: number = 60;

    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

    public async graph(
        model: IGraphRequestModel,
        progress: XrayScanProgress,
        checkCanceled: () => void,
        projectKey: string | undefined,
        sleepIntervalMilliseconds: number = XrayScanClient.SLEEP_INTERVAL_MILLISECONDS
    ): Promise<IGraphResponse> {
        try {
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
            return await this.getScanGraphResults(
                response.scan_id,
                progress,
                checkCanceled,
                !projectProvided,
                sleepIntervalMilliseconds
            );
        } finally {
            progress.setPercentage(100);
        }
    }

    private async getScanGraphResults(
        scanId: string,
        progress: XrayScanProgress,
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
            let receivedStatus: number | undefined;
            const requestParams: IRequestParams = {
                url: scanGraphUrl,
                method: 'GET',
                validateStatus: (status: number): boolean => {
                    receivedStatus = status;
                    return status === 200 || status === 202;
                },
            };
            let message: string | undefined;
            const response: IGraphResponse = await this.httpClient
                .doAuthRequest(requestParams)
                .catch(async (reason: any) => {
                    receivedStatus = reason.response?.status;
                    message = reason?.message;
                });
            this.logger.debug(`Received status '${receivedStatus}' from Xray.`);
            if (receivedStatus === 200) {
                return response;
            }

            if (receivedStatus === 202) {
                if (response.progress_percentage) {
                    progress.setPercentage(response.progress_percentage);
                }
            } else {
                if (receivedStatus) {
                    throw new Error(`Received unexpected status '${receivedStatus}' from Xray: ${message}`);
                }
                throw new Error(`Received response from Xray: ${message}`);
            }

            await this.delay(sleepIntervalMilliseconds);
        }
        throw new Error('Xray get scan graph exceeded the timeout.');
    }

    private async delay(sleepIntervalMilliseconds: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, sleepIntervalMilliseconds));
    }
}

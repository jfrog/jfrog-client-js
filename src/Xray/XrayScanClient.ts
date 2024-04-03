import { HttpClient } from '..';
import { IGraphRequestModel, IGraphResponse, ILogger } from '../../model/';
import { IClientResponse } from '../ClientResponse';
import { IRequestParams } from '../HttpClient';
import { XrayScanProgress } from './XrayScanProgress';

export class XrayScanClient {
    static readonly scanGraphEndpoint: string = 'api/v1/scan/graph';
    static readonly xscScanGraphEndpoint: string = 'api/v1/sca/scan/graph';
    private static readonly SLEEP_INTERVAL_MILLISECONDS: number = 5000;
    private static readonly MAX_ATTEMPTS: number = 60;

    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

    public async graph(
        request: IGraphRequestModel,
        progress: XrayScanProgress,
        checkCanceled: () => void,
        projectKey: string | undefined,
        watches: string[] | undefined,
        multiScanId: string | undefined,
        technologies: string[] | undefined,
        sleepIntervalMilliseconds: number = XrayScanClient.SLEEP_INTERVAL_MILLISECONDS
    ): Promise<IGraphResponse> {
        try {
            if (!request) {
                return {} as IGraphResponse;
            }
            checkCanceled();
            const response: IClientResponse = await this.postScanGraph(
                request,
                projectKey,
                watches,
                multiScanId,
                technologies
            );
            return await this.getScanGraphResults(
                response.data.scan_id,
                progress,
                checkCanceled,
                (!projectKey || projectKey.length === 0) && (!watches || watches.length === 0),
                multiScanId !== undefined && multiScanId.length > 0,
                sleepIntervalMilliseconds
            );
        } finally {
            progress.setPercentage(100);
        }
    }

    /**
     *
     * Send 'POST /scan/graph' request to Xray.
     *
     * @param request - The Graph to scan
     * @param projectKey - Project key or undefined
     * @param watches - List of Watches or undefined
     * @returns the graph response.
     * @throws an exception if an unexpected response received from Xray.
     */
    private async postScanGraph(
        request: IGraphRequestModel,
        projectKey?: string,
        watches?: string[],
        multiScanId?: string,
        technologies?: string[]
    ): Promise<IClientResponse> {
        this.logger.debug('Sending POST scan/graph request...');
        const requestParams: IRequestParams = {
            url: this.getUrl(projectKey, watches, multiScanId, technologies),
            method: 'POST',
            data: request,
        };
        this.logger.debug('data: ' + JSON.stringify(request));
        try {
            return await this.httpClient.doAuthRequest(requestParams);
        } catch (error) {
            let requestError: any = <any>error;
            if (!requestError.message) {
                // Not an Axios error
                throw error;
            }
            let message: string = requestError.message;
            if (requestError.response?.data?.error) {
                message += ': ' + requestError?.response?.data?.error;
            }
            throw new Error(`${message}`);
        }
    }

    /**
     * Get URL for "POST api/v1/scan/graph".
     * If no project key provided - api/v1/scan/graph
     * If project key was provided - api/v1/scan/graph?project=<projectKey>
     * If watches provided - api/v1/scan/graph?watch=<watch-1>&watch=<watch-2>
     * @param projectKey - Project key or undefined
     * @param watches - List of Watches or undefined
     * @returns URL for "POST api/v1/scan/graph"
     */
    private getUrl(
        projectKey: string | undefined,
        watches?: string[],
        multiScanId?: string,
        technologies?: string[]
    ): string {
        let url: string = XrayScanClient.scanGraphEndpoint;
        let params: string[] = [];

        if (projectKey && projectKey.length > 0) {
            params.push(`project=${projectKey}`);
        } else if (watches && watches.length > 0) {
            params.push(`watch=${watches.join('&watch=')}`);
        }
        if (multiScanId) {
            params.push(`multi_scan_id=${multiScanId}`);
            url = XrayScanClient.xscScanGraphEndpoint;
        }
        if (technologies && technologies.length > 0) {
            params.push(`tech=${technologies.join('&tech=')}`);
        }

        return params.length > 0 ? url + '?' + params.join('&') : url;
    }

    /**
     *
     * Sends 'GET /scan/graph?...' requests to Xray and waits for 200 response.
     * If 202 response is received, it updates the progress and waits sleepIntervalMilliseconds.
     * If any other response received, it throws an error.
     *
     * @param scanId - The scan ID received from Xray, after running a 'POST scan/graph' request
     * @param progress - The progress that will be updated after every 202 response from Xray
     * @param checkCanceled - Function that may stop the scan if it throws an exception
     * @param includeVulnerabilities - True if no context (project or watches) is provided
     * @param sleepIntervalMilliseconds - Sleep interval in milliseconds between attepts
     * @returns the graph response
     * @throws an exception if an unexpected response received from Xray or if checkCanceled threw an exception
     */
    private async getScanGraphResults(
        scanId: string,
        progress: XrayScanProgress,
        checkCanceled: () => void,
        includeVulnerabilities: boolean,
        xsc: boolean,
        sleepIntervalMilliseconds: number
    ): Promise<IGraphResponse> {
        const scanGraphUrl: string = xsc
            ? XrayScanClient.xscScanGraphEndpoint
            : XrayScanClient.scanGraphEndpoint +
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

            if (receivedStatus === 202) {
                if (response?.data.progress_percentage) {
                    progress.setPercentage(response.data.progress_percentage);
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

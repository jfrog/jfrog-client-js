import { HttpClient } from '..';
import { IRequestParams } from '../HttpClient';

import {
    IClientResponse,
    ILogger,
    ScanEventStatus,
    ScanEventType,
    XscLog,
    StartScanRequest,
    ScanEvent,
} from '../../model/';

export class XscEventClient {
    static readonly eventEndpoint: string = 'api/v1/event';
    static readonly logEventEndpoint: string = XscEventClient.eventEndpoint + '/logMessage';

    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

    /**
     *
     * Send 'POST /event/logMessage' request to Xsc.
     *
     * @param logEvent - The Log event to send
     * @returns true if the log was sent successfully, false otherwise.
     */
    public async log(logEvent: XscLog): Promise<boolean> {
        this.logger.debug('Sending POST event/logMessage request...');
        const requestParams: IRequestParams = {
            url: XscEventClient.logEventEndpoint,
            method: 'POST',
            data: logEvent,
        };
        try {
            let response: IClientResponse | undefined = await this.httpClient.doAuthRequest(requestParams);
            return response?.status === 201;
        } catch (error) {
            this.logger.debug(error);
            return false;
        }
    }

    /**
     *
     * Send 'POST /event' request to Xsc.
     *
     * @param eventInfo - The Scan request information that is requested to start
     * @returns the scan event information that started.
     * @throws an exception if an unexpected response received from Xsc.
     */
    public async startScan(eventInfo: StartScanRequest): Promise<ScanEvent> {
        this.logger.debug('Sending POST event request...');
        eventInfo.event_status = ScanEventStatus.Started;
        eventInfo.event_type = ScanEventType.SourceCode;
        const requestParams: IRequestParams = {
            url: XscEventClient.eventEndpoint,
            method: 'POST',
            data: eventInfo,
            validateStatus: (status: number) => status === 201,
        };
        this.logger.debug('data: ' + JSON.stringify(eventInfo));
        return await (
            await this.httpClient.doAuthRequest(requestParams)
        ).data;
    }

    /**
     *
     * Send 'PUT /event' request to Xsc.
     *
     * @param eventInfo - The Scan event to end
     * @returns true if the scan ending information sent successfully, false otherwise.
     */
    public async endScan(event: ScanEvent): Promise<boolean> {
        this.logger.debug('Sending PUT event request...');
        const requestParams: IRequestParams = {
            url: XscEventClient.eventEndpoint,
            method: 'PUT',
            data: event,
        };
        try {
            let response: IClientResponse | undefined = await this.httpClient.doAuthRequest(requestParams);
            return response?.status === 200;
        } catch (error) {
            this.logger.debug(error);
            return false;
        }
    }
}

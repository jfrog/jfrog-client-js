import { AccessTokenResponse, ILogger } from '../../model/';
import { IClientResponse } from '../ClientResponse';
import { HttpClient, IRequestParams } from '../HttpClient';
import { IAuthRequest } from './AuthRequest';

export class WebLoginClient {
    private static readonly REGISTER_SESSION_ID_ENDPOINT: string = `/access/api/v2/authentication/jfrog_client_login/request`; // 10 seconds
    private static readonly POLLING_INTERVAL: number = 10000; // 10 seconds
    private static readonly POLLING_DURATION: number = 5 * 60000; // 5 minutes
    constructor(private readonly httpClient: HttpClient, private logger?: ILogger) {}

    /**
     * Sends an authentication request to the specified URL with the provided session ID.
     * @param id - The session ID.
     * @returns A promise that resolves with the client response.
     */
    public async registerSessionId(sessionId: string): Promise<void> {
        const body: IAuthRequest = { session: sessionId };
        const requestParams: IRequestParams = {
            url: WebLoginClient.REGISTER_SESSION_ID_ENDPOINT,
            method: 'POST',
            data: body,
        };
        const response: IClientResponse = await this.httpClient.doRequest(requestParams);
        this.checkResponse(response, `'sendAuthRequest' failed to send request '${JSON.stringify(requestParams)}'.`);
    }

    /**
     * Polls the URL for an access token using the provided session ID.
     * @param id - The session ID.
     */
    public async waitForToken(sessionId: string): Promise<AccessTokenResponse> {
        const response: IClientResponse | undefined = await this.httpClient.pollURLForTime(
            WebLoginClient.POLLING_INTERVAL,
            `/access/api/v2/authentication/jfrog_client_login/token/${sessionId}`,
            WebLoginClient.POLLING_DURATION
        );
        await this.checkResponse(response, "'pollingForToken' received valid.");
        return response?.data;
    }

    private checkResponse(response: IClientResponse | undefined, prefix: string) {
        if (response && response.status >= 200 && response.status < 300) {
            this.logger?.debug(`${prefix}. status: ${response.status}`);
            return response.data;
        }
        throw new Error('Web login failed while polling');
    }
}

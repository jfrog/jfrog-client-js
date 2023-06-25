import { AccessTokenResponse, ILogger } from '../../model/';
import { IClientResponse } from '../ClientResponse';
import { HttpClient, IRequestParams } from '../HttpClient';
import { IAuthRequest } from './AuthRequest';

export class WebLoginClient {
    private static readonly REGISTER_SESSION_ID_ENDPOINT: string = `/access/api/v2/authentication/jfrog_client_login/request`;
    public static readonly POLLING_INTERVAL: number = 10000; // 10 seconds
    public static readonly POLLING_DURATION: number = 5 * 60000; // 5 minutes
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
        await this.httpClient.doRequest(requestParams);
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
        return response?.data;
    }
}

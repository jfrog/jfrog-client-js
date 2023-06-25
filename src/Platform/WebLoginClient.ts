import { AccessTokenResponse, ILogger } from '../../model/';
import { HttpClient, IRequestParams } from '../HttpClient';
import { IAuthRequest } from './AuthRequest';

export class WebLoginClient {
    private static readonly REGISTER_SESSION_ID_ENDPOINT: string = `/access/api/v2/authentication/jfrog_client_login/request`;
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
     * Get an access token using the provided session ID.
     * @param id - The session ID.
     */
    public async getToken(sessionId: string): Promise<AccessTokenResponse> {
        const request: IRequestParams = {
            url: `/access/api/v2/authentication/jfrog_client_login/token/${sessionId}`,
            method: 'GET',
        };
        return (await this.httpClient.doRequest(request)).data;
    }
}

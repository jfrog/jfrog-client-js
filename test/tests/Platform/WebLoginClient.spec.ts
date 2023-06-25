import nock from 'nock';
import { AccessTokenResponse } from '../../../model';
import { HttpClient } from '../../../src/HttpClient';
import { WebLoginClient } from '../../../src/Platform/WebLoginClient';

describe('WebLoginClient', () => {
    const mockSessionId: string = 'mockSessionId';
    const SERVER_URL: string = 'http://localhost:8000';
    const mockAccessTokenResponse: AccessTokenResponse = {
        access_token: 'mockAccessToken',
        expires_in: 3600,
        refresh_token: 'refresh_token',
        scope: 'scope',
        token_id: 'token_id',
        token_type: 'Bearer',
    };

    beforeEach(() => {
        nock.disableNetConnect();
    });

    afterEach(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });

    it('Register session id', async () => {
        const httpClient: HttpClient = new HttpClient({ serverUrl: SERVER_URL });
        const webLoginClient: WebLoginClient = new WebLoginClient(httpClient);

        nock(SERVER_URL).post('/access/api/v2/authentication/jfrog_client_login/request').reply(200);

        await webLoginClient.registerSessionId(mockSessionId);
    });

    it('Register session id with error', async () => {
        const httpClient: HttpClient = new HttpClient({ serverUrl: SERVER_URL });
        const webLoginClient: WebLoginClient = new WebLoginClient(httpClient);
        const sessionId: string = 'mockInvalidSessionId';

        nock(SERVER_URL).post('/access/api/v2/authentication/jfrog_client_login/request').reply(400);

        await expect(webLoginClient.registerSessionId(sessionId)).rejects.toThrowError(
            'Request failed with status code 400'
        );
    });

    it('Wait for token', async () => {
        const httpClient: HttpClient = new HttpClient({ serverUrl: SERVER_URL });
        const webLoginClient: WebLoginClient = new WebLoginClient(httpClient);

        nock(SERVER_URL)
            .get(`/access/api/v2/authentication/jfrog_client_login/token/${mockSessionId}`)
            .reply(200, mockAccessTokenResponse);

        const accessToken: AccessTokenResponse = await webLoginClient.getToken(mockSessionId);

        expect(accessToken).toEqual(mockAccessTokenResponse);
    });
});

import { IClientResponse, AccessTokenResponse } from '../../../model';
import { HttpClient, IRequestParams } from '../../../src/HttpClient';
import { WebLoginClient } from '../../../src/Platform/WebLoginClient';

describe('WebLoginClient', () => {
    let webLoginClient: WebLoginClient;
    let httpClient: HttpClient;
    const sessionId: string = '1234567890';

    beforeEach(() => {
        httpClient = {
            doRequest: jest.fn(),
            pollURLForTime: jest.fn(),
        } as unknown as HttpClient;
        webLoginClient = new WebLoginClient(httpClient, undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('registerSessionId', () => {
        const expectedRequestParams: IRequestParams = {
            url: '/access/api/v2/authentication/jfrog_client_login/request',
            method: 'POST',
            data: { session: sessionId },
        };
        it('should send authentication request', async () => {
            const expectedResponse: IClientResponse = {
                status: 200,
            };

            (httpClient.doRequest as jest.Mock).mockResolvedValue(expectedResponse);

            await webLoginClient.registerSessionId(sessionId);

            expect(httpClient.doRequest).toHaveBeenCalledTimes(1);
            expect(httpClient.doRequest).toHaveBeenCalledWith(expectedRequestParams);
        });

        it('should throw an error if the authentication request fails', async () => {
            const expectedResponse: IClientResponse = {
                status: 400,
            };

            (httpClient.doRequest as jest.Mock).mockResolvedValue(expectedResponse);

            await expect(webLoginClient.registerSessionId(sessionId)).rejects.toThrowError(
                'Web login failed while polling'
            );
            expect(httpClient.doRequest).toHaveBeenCalledTimes(1);
            expect(httpClient.doRequest).toHaveBeenCalledWith(expectedRequestParams);
        });
    });

    describe('waitForToken', () => {
        const pollingInterval: number = 10000;
        const pollingDuration: number = 5 * 60000;
        const pollingEndpoint: string = `/access/api/v2/authentication/jfrog_client_login/token/${sessionId}`;

        it('should poll URL for access token', async () => {
            const expectedResponse: IClientResponse = {
                status: 200,
                data: {
                    access_token: 'token',
                    expires_in: 3600,
                    refresh_token: 'refresh_token',
                    scope: 'scope',
                    token_id: 'token_id',
                    token_type: 'Bearer',
                } as AccessTokenResponse,
            };

            (httpClient.pollURLForTime as jest.Mock).mockResolvedValue(expectedResponse);

            const result: AccessTokenResponse = await webLoginClient.waitForToken(sessionId);

            expect(httpClient.pollURLForTime).toHaveBeenCalledTimes(1);
            expect(httpClient.pollURLForTime).toHaveBeenCalledWith(pollingInterval, pollingEndpoint, pollingDuration);
            expect(result).toEqual(expectedResponse.data);
        });
    });
});

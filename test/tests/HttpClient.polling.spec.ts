import { IClientResponse, ILogger } from '../../model';
import { HttpClient, IRequestParams } from '../../src/HttpClient';

describe('Http client tests - polling', () => {
    let httpClient: HttpClient;
    const url: string = 'https://example.com';

    const loggerMock: ILogger = {
        debug: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    };

    beforeEach(() => {
        httpClient = new HttpClient({ serverUrl: url, retries: 0 }, loggerMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Poll URL for time', () => {
        let doRequestMock: jest.SpyInstance<Promise<IClientResponse>, [requestParams: IRequestParams]>;
        const duration: number = 5000;
        const interval: number = 1000;

        beforeEach(() => {
            doRequestMock = jest.spyOn(httpClient, 'doRequest');
        });

        it('Polling is successful', async () => {
            const expectedResponse: IClientResponse = {
                status: 200,
            };

            doRequestMock.mockResolvedValue(expectedResponse);

            const result: IClientResponse | undefined = await httpClient.pollURLForTime(interval, url, duration);

            expect(result).toBe(expectedResponse);
            expect(doRequestMock).toHaveBeenCalledTimes(1);
            expect(doRequestMock).toHaveBeenCalledWith({ url: url, method: 'GET' });
            expect(loggerMock.debug).toHaveBeenCalledWith(
                `Polling ended successfully from ${url} with status ${expectedResponse.status}`
            );
        });

        it('Polling is not successful', async () => {
            const expectedError: Error = new Error('Something went wrong');

            doRequestMock.mockRejectedValue(expectedError);

            const result: IClientResponse | undefined = await httpClient.pollURLForTime(interval, url, duration);

            expect(result).toBeUndefined();
            expect(doRequestMock).toHaveBeenCalledTimes(5);
            expect(doRequestMock).toHaveBeenCalledWith({ url: url, method: 'GET' });
            expect(loggerMock.debug).toHaveBeenCalledWith(`Retry #1`, JSON.stringify(expectedError));
            expect(loggerMock.debug).toHaveBeenCalledWith(`Retry #2`, JSON.stringify(expectedError));
        });
    });
});
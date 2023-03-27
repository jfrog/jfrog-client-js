import * as faker from 'faker';
import { HttpsProxyAgent } from 'https-proxy-agent';
import nock from 'nock';
import { IClientResponse, IProxyConfig } from '../../model';
import { HttpClient, IRequestParams } from '../../src/HttpClient';

const subPath: string = '/subpath';
const serverUrl: string = faker.internet.url();
const username: string = faker.internet.userName();
const password: string = faker.internet.password();

beforeAll(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(serverUrl);
});

afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe('Http client tests', () => {
    test('Constructing client', () => {
        const client: HttpClient = new HttpClient({ serverUrl });
        expect(client).toBeInstanceOf(HttpClient);
    });

    [
        {
            name: 'Http config',
            config: { host: 'host', port: 1, protocol: 'http' } as IProxyConfig,
            shouldExists: true,
        },
        {
            name: 'Https config',
            config: { host: 'host', port: 1, protocol: 'https' } as IProxyConfig,
            shouldExists: false,
        },
        {
            name: 'With empty config',
            config: {} as IProxyConfig,
            shouldExists: false,
        },
        {
            name: 'With undefined',
            config: undefined,
            shouldExists: false,
        },
        {
            name: 'With false',
            config: false,
            shouldExists: false,
        },
    ].forEach((testCase) => {
        test('Constructing HttpToHttpsProxyConfig - ' + testCase.name, () => {
            let res: HttpsProxyAgent | undefined = HttpClient.getHttpToHttpsProxyConfig(
                <IProxyConfig | false | undefined>testCase.config
            );
            if (testCase.shouldExists) {
                expect(res).toBeDefined();
            } else {
                expect(res).toBeUndefined();
            }
        });
    });

    test('Do request', async () => {
        nock(serverUrl).post(subPath).matchHeader('User-Agent', 'http-client-test').reply(200, 'RESPONSE');
        const client: HttpClient = new HttpClient({ serverUrl, headers: { 'User-Agent': 'http-client-test' } });
        const requestParams: IRequestParams = {
            method: 'POST',
            url: subPath,
        } as IRequestParams;
        const res: IClientResponse = await client.doRequest(requestParams);
        expect(res.data).toBe('RESPONSE');
        expect(res.status).toBe(200);
    });
    test('Do auth request', async () => {
        nock(serverUrl)
            .post(subPath)
            .basicAuth({ user: username, pass: password })
            .matchHeader('User-Agent', 'jfrog-client-js')
            .reply(200, 'RESPONSE');
        const client: HttpClient = new HttpClient({ serverUrl, username, password });
        const requestParams: IRequestParams = {
            method: 'POST',
            url: subPath,
        } as IRequestParams;
        const res: IClientResponse = await client.doAuthRequest(requestParams);
        expect(res.data).toBe('RESPONSE');
        expect(res.status).toBe(200);
    });
});

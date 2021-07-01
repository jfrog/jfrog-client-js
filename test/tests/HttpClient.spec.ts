import * as faker from 'faker';
import nock from 'nock';
import { HttpClient, IRequestParams } from '../../src/HttpClient';

const subPath = '/subpath';
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
        const client = new HttpClient({ serverUrl });
        expect(client).toBeInstanceOf(HttpClient);
    });
    test('Do request', async () => {
        nock(serverUrl).post(subPath).matchHeader('User-Agent', 'http-client-test').reply(200, 'RESPONSE');
        const client = new HttpClient({ serverUrl, headers: { 'User-Agent': 'http-client-test' } });
        const requestParams = {
            method: 'POST',
            url: subPath,
        } as IRequestParams;
        const res = await client.doRequest(requestParams);
        expect(res).toBe('RESPONSE');
    });
    test('Do auth request', async () => {
        nock(serverUrl)
            .post(subPath)
            .basicAuth({ user: username, pass: password })
            .matchHeader('User-Agent', 'jfrog-client-js')
            .reply(200, 'RESPONSE');
        const client = new HttpClient({ serverUrl, username, password });
        const requestParams = {
            method: 'POST',
            url: subPath,
        } as IRequestParams;
        const res = await client.doAuthRequest(requestParams);
        expect(res).toBe('RESPONSE');
    });
});

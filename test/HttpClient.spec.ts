import { AxiosRequestConfig } from 'axios';
import * as faker from 'faker';
import nock from 'nock';
import { HttpClient } from '../src/HttpClient';

const subPath = '/subpath';
const serverUrl: string = faker.internet.url();
const username: string = faker.internet.userName();
const password: string = faker.internet.password();

beforeAll(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(serverUrl);
});

describe('Http client tests', () => {
    test('Constructing client', () => {
        const client = new HttpClient({ serverUrl });
        expect(client).toBeInstanceOf(HttpClient);
    });
    test('Do request', async done => {
        try {
            nock(serverUrl)
                .post(subPath)
                .matchHeader('User-Agent', 'http-client-test')
                .reply(200, 'RESPONSE');
            const client = new HttpClient({ serverUrl, headers: { 'User-Agent': 'http-client-test' } });
            const httpOptions = {
                method: 'POST',
                url: subPath
            } as AxiosRequestConfig;
            const res = await client.doRequest(httpOptions);
            expect(res).toBe('RESPONSE');
            done();
        } catch (e) {
            done.fail(`Should not fail : ${e.message}`);
        }
    });
    test('Do auth request', async done => {
        try {
            nock(serverUrl)
                .post(subPath)
                .basicAuth({ user: username, pass: password })
                .matchHeader('User-Agent', 'jfrog-xray-client')
                .reply(200, 'RESPONSE');
            const client = new HttpClient({ serverUrl, username, password });
            const httpOptions = {
                method: 'POST',
                url: subPath
            } as AxiosRequestConfig;
            const res = await client.doAuthRequest(httpOptions);
            expect(res).toBe('RESPONSE');
            done();
        } catch (e) {
            done.fail(`Should not fail : ${e.message}`);
        }
    });
});

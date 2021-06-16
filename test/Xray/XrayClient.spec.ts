import nock from 'nock';
import { XraySummaryClient, XrayClient, XraySystemClient } from '../../src';

const SERVER_URL = 'http://localhost:8000';

beforeAll(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(SERVER_URL);
});

describe('Xray clients tests', () => {
    test('Client initialization', () => {
        const client = new XrayClient({ serverUrl: SERVER_URL });
        expect(client).toBeInstanceOf(XrayClient);
    });
    test('Client w/o url', () => {
        expect(() => {
            const client = new XrayClient({ serverUrl: '' });
        }).toThrow('Xray client : must provide serverUrl');
    });
    test('System client', () => {
        const client = new XrayClient({ serverUrl: SERVER_URL });
        expect(client.system()).toBeInstanceOf(XraySystemClient);
    });
    test('Summary client', () => {
        const client = new XrayClient({ serverUrl: SERVER_URL });
        expect(client.summary()).toBeInstanceOf(XraySummaryClient);
    });
});

test('Xray client header tests', async () => {
    const client = new XrayClient({ serverUrl: SERVER_URL, headers: { header1: 'value' } });
    const serviceId = 'jfrog@some.me';
    const scope: nock.Scope = nock(SERVER_URL).matchHeader('header1', 'value').get('/api/v1/system/ping').reply(200, serviceId);
    await client.system().ping();
    expect(scope.isDone()).toBeTruthy();
});

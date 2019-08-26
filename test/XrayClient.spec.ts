import nock from 'nock';
import { SummaryClient } from '../src/SummaryClient';
import { XrayClient } from '../src/XrayClient';
import { SystemClient } from '../src/SystemClient';

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
        expect(client.system()).toBeInstanceOf(SystemClient);
    });
    test('Summary client', () => {
        const client = new XrayClient({ serverUrl: SERVER_URL });
        expect(client.summary()).toBeInstanceOf(SummaryClient);
    });
});

test('Xray client header tests', async () => {
    const client = new XrayClient({ serverUrl: SERVER_URL, headers: { header1: 'value' } });
    const serviceId = 'jfrog@some.me';
    const scope: nock.Scope = nock(SERVER_URL)
        .matchHeader('header1', 'value')
        .get('/api/v1/system/ping')
        .reply(200, serviceId);
    await client.system().ping();
    expect(scope.isDone()).toBeTruthy();
});

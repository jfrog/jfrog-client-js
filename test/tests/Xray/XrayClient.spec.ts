import nock from 'nock';
import { XrayDetailsClient, XraySummaryClient, XraySystemClient } from '../../../src';
import { XrayClient } from '../../../src/Xray/XrayClient';
import { TestUtils } from '../../TestUtils';

const SERVER_URL = 'http://localhost:8000';

beforeAll(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(SERVER_URL);
});

afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe('Xray clients tests', () => {
    test('Client initialization', () => {
        const client = new XrayClient({ serverUrl: SERVER_URL });
        expect(client).toBeInstanceOf(XrayClient);
    });
    test('Client w/o url', () => {
        expect(() => {
            const client = new XrayClient({ serverUrl: '' });
        }).toThrow('Xray client : must provide platformUrl or xrayUrl');
    });
    test('System client', () => {
        const client = new XrayClient({ serverUrl: SERVER_URL });
        expect(client.system()).toBeInstanceOf(XraySystemClient);
    });
    test('Summary client', () => {
        const client = new XrayClient({ serverUrl: SERVER_URL });
        expect(client.summary()).toBeInstanceOf(XraySummaryClient);
    });
    test('Details client', () => {
        const client = new XrayClient({ serverUrl: SERVER_URL });
        expect(client.details()).toBeInstanceOf(XrayDetailsClient);
    });
});

test('Xray client header tests', async () => {
    const client = new XrayClient({
        serverUrl: SERVER_URL,
        headers: { header1: 'value' },
        logger: TestUtils.createTestLogger(),
    });
    const serviceId = 'jfrog@some.me';
    const scope: nock.Scope = nock(SERVER_URL)
        .matchHeader('header1', 'value')
        .get('/api/v1/system/ping')
        .reply(200, serviceId);
    await client.system().ping();
    expect(scope.isDone()).toBeTruthy();
});

import nock from 'nock';
import { XscClient } from '../../../src/Xsc/XscClient';
import { TestUtils } from '../../TestUtils';
import { XscSystemClient } from '../../../src/Xsc/XscSystemClient';
import { XscEventClient } from '../../../src/Xsc/XscEventClient';

const SERVER_URL: string = 'http://localhost:8000';

beforeAll(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(SERVER_URL);
});

afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe('Xsc clients tests', () => {
    test('Client initialization', () => {
        const client: XscClient = new XscClient({ serverUrl: SERVER_URL });
        expect(client).toBeInstanceOf(XscClient);
    });
    test('Client w/o url', () => {
        expect(() => {
            new XscClient({ serverUrl: '' });
        }).toThrow('Xsc client : must provide platformUrl');
    });
    test('System client', () => {
        const client: XscClient = new XscClient({ serverUrl: SERVER_URL });
        expect(client.system()).toBeInstanceOf(XscSystemClient);
    });
    test('Event client', () => {
        const client: XscClient = new XscClient({ serverUrl: SERVER_URL });
        expect(client.event()).toBeInstanceOf(XscEventClient);
    });
});

test('Xsc client header tests', async () => {
    const client: XscClient = new XscClient({
        serverUrl: SERVER_URL,
        headers: { header1: 'value' },
        logger: TestUtils.createTestLogger(),
    });
    const serviceId: string = 'jfrog@some.me';
    const scope: nock.Scope = nock(SERVER_URL)
        .matchHeader('header1', 'value')
        .get('/api/v1/system/version')
        .reply(200, serviceId);
    await client.system().version();
    expect(scope.isDone()).toBeTruthy();
});

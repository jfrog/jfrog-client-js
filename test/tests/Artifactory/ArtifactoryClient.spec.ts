import nock from 'nock';
import { ArtifactoryClient, ArtifactorySystemClient, ArtifactoryDownloadClient, ArtifactorySearchClient } from '../../../src';

const SERVER_URL = 'http://localhost:8000';

beforeAll(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(SERVER_URL);
});

describe('Artifactory clients tests', () => {
    test('Client initialization', () => {
        const client = new ArtifactoryClient({ serverUrl: SERVER_URL });
        expect(client).toBeInstanceOf(ArtifactoryClient);
    });
    test('Client w/o url', () => {
        expect(() => {
            const client = new ArtifactoryClient({ serverUrl: '' });
        }).toThrow('Artifactory client : must provide serverUrl');
    });
    test('System client', () => {
        const client = new ArtifactoryClient({ serverUrl: SERVER_URL });
        expect(client.system()).toBeInstanceOf(ArtifactorySystemClient);
    });
    test('Search client', () => {
        const client = new ArtifactoryClient({ serverUrl: SERVER_URL });
        expect(client.search()).toBeInstanceOf(ArtifactorySearchClient);
    });
    test('Download client', () => {
        const client = new ArtifactoryClient({ serverUrl: SERVER_URL });
        expect(client.download()).toBeInstanceOf(ArtifactoryDownloadClient);
    });
});

test('Artifactory client header tests', async () => {
    const client = new ArtifactoryClient({ serverUrl: SERVER_URL, headers: { header1: 'value' } });
    const serviceId = 'jfrog@some.me';
    const scope: nock.Scope = nock(SERVER_URL).matchHeader('header1', 'value').get('/api/v1/system/ping').reply(200, serviceId);
    await client.system().ping();
    expect(scope.isDone()).toBeTruthy();
});

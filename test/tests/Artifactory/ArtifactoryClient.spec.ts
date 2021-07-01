import nock from 'nock';
import { ArtifactorySystemClient, ArtifactoryDownloadClient, ArtifactorySearchClient } from '../../../src';
import { ArtifactoryClient } from '../../../src/Artifactory/ArtifactoryClient';

const SERVER_URL = 'http://localhost:8000';

beforeAll(() => {
    nock.disableNetConnect();
    nock.enableNetConnect(SERVER_URL);
});

afterAll(() => {
    nock.cleanAll()
    nock.enableNetConnect()
})

describe('Artifactory clients tests', () => {
    test('Client initialization', () => {
        const client = new ArtifactoryClient({ serverUrl: SERVER_URL });
        expect(client).toBeInstanceOf(ArtifactoryClient);
    });
    test('Client w/o url', () => {
        expect(() => {
            const client = new ArtifactoryClient({ serverUrl: '' });
        }).toThrow('Artifactory client : must provide platformUrl or artifactoryUrl');
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
    const scope: nock.Scope = nock(SERVER_URL)
        .matchHeader('header1', 'value')
        .get('/api/system/ping')
        .reply(200, serviceId);
    await client.system().ping();
    expect(scope.isDone()).toBeTruthy();
});

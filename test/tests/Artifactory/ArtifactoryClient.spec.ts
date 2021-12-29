import nock from 'nock';
import { ArtifactoryDownloadClient, ArtifactorySearchClient, ArtifactorySystemClient } from '../../../src';
import { ArtifactoryClient } from '../../../src/Artifactory/ArtifactoryClient';
import { TestUtils } from '../../TestUtils';

const SERVER_URL: string = 'http://localhost:8000';

describe('Artifactory clients tests', () => {
    beforeAll(() => {
        nock.enableNetConnect(SERVER_URL);
    });

    afterAll(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });

    test('Client initialization', () => {
        const client: ArtifactoryClient = new ArtifactoryClient({
            serverUrl: SERVER_URL,
            logger: TestUtils.createTestLogger(),
        });
        expect(client).toBeInstanceOf(ArtifactoryClient);
    });
    test('Client w/o url', () => {
        expect(() => {
            new ArtifactoryClient({ serverUrl: '', logger: TestUtils.createTestLogger() });
        }).toThrow('Artifactory client : must provide platformUrl or artifactoryUrl');
    });
    test('System client', () => {
        const client: ArtifactoryClient = new ArtifactoryClient({
            serverUrl: SERVER_URL,
            logger: TestUtils.createTestLogger(),
        });
        expect(client.system()).toBeInstanceOf(ArtifactorySystemClient);
    });
    test('Search client', () => {
        const client: ArtifactoryClient = new ArtifactoryClient({
            serverUrl: SERVER_URL,
            logger: TestUtils.createTestLogger(),
        });
        expect(client.search()).toBeInstanceOf(ArtifactorySearchClient);
    });
    test('Download client', () => {
        const client: ArtifactoryClient = new ArtifactoryClient({
            serverUrl: SERVER_URL,
            logger: TestUtils.createTestLogger(),
        });
        expect(client.download()).toBeInstanceOf(ArtifactoryDownloadClient);
    });
});

test('Artifactory client header tests', async () => {
    const client: ArtifactoryClient = new ArtifactoryClient({
        serverUrl: SERVER_URL,
        headers: { header1: 'value' },
        logger: TestUtils.createTestLogger(),
    });
    const serviceId: string = 'jfrog@some.me';
    const scope: nock.Scope = nock(SERVER_URL)
        .matchHeader('header1', 'value')
        .get('/api/system/ping')
        .reply(200, serviceId);
    await client.system().ping();
    expect(scope.isDone()).toBeTruthy();
});

import { IAqlSearchResult, IChecksumResult, IJfrogClientConfig } from '../../../model';
import { JfrogClient } from '../../../src';
import { TestUtils } from '../../TestUtils';
import * as path from 'path';
import * as tmp from 'tmp';
import * as fs from 'fs';
import nock from 'nock';
let jfrogClient: JfrogClient;
const BUILD_INFO_REPO: string = '/artifactory-build-info/';

describe('Artifactory Download tests', () => {
    const clientConfig: IJfrogClientConfig = TestUtils.getJfrogClientConfig();
    let downloadFilePath: string;
    let tmpDir: tmp.DirResult;

    beforeAll(() => {
        jfrogClient = new JfrogClient(clientConfig);
    });

    beforeEach(() => {
        tmpDir = tmp.dirSync({ unsafeCleanup: true });
        downloadFilePath = path.join(tmpDir.name, 'tmpFile');
    });

    afterEach(() => {
        tmpDir.removeCallback();
    });

    test('Build artifact download test', async () => {
        const result: IAqlSearchResult = await TestUtils.searchArtifactoryBuildRepo(jfrogClient);
        expect(result.results.length).toBeGreaterThan(0);
        const artifactPath: string = BUILD_INFO_REPO + result.results[0].path + '/' + result.results[0].name;
        const build: any = await jfrogClient.artifactory().download().downloadArtifact(artifactPath);
        expect(build).toBeTruthy();
        expect(build.name).toBe(decodeURIComponent(result.results[0].path));
    });

    test('Build artifact download to file test', async () => {
        const result: IAqlSearchResult = await TestUtils.searchArtifactoryBuildRepo(jfrogClient);
        expect(result.results.length).toBeGreaterThan(0);
        const artifactPath: string = BUILD_INFO_REPO + result.results[0].path + '/' + result.results[0].name;
        await jfrogClient.artifactory().download().downloadArtifactToFile(artifactPath, downloadFilePath);
        expect(fs.existsSync(downloadFilePath)).toBeTruthy();
        expect(fs.statSync(downloadFilePath).size).toEqual(result.results[0].size);
    });

    test('Download non-existed artifact to file', async () => {
        await expect(
            async () => await jfrogClient.artifactory().download().downloadArtifactToFile('not-exist', downloadFilePath)
        ).rejects.toThrow('Request failed with status code 404');
        expect(fs.existsSync(downloadFilePath)).toBeFalsy();
    });

    test('Download non-existed artifact to non-existed directory', async () => {
        tmpDir.removeCallback();
        const result: IAqlSearchResult = await TestUtils.searchArtifactoryBuildRepo(jfrogClient);
        expect(result.results.length).toBeGreaterThan(0);
        const artifactPath: string = BUILD_INFO_REPO + result.results[0].path + '/' + result.results[0].name;
        await expect(
            async () =>
                await jfrogClient.artifactory().download().downloadArtifactToFile(artifactPath, downloadFilePath)
        ).rejects.toThrow('no such file or directory');
    });

    test('Build artifact download checksum test', async () => {
        const result: IAqlSearchResult = await TestUtils.searchArtifactoryBuildRepo(jfrogClient);
        expect(result.results.length).toBeGreaterThan(0);
        const artifactPath: string = BUILD_INFO_REPO + result.results[0].path + '/' + result.results[0].name;
        const checksum: IChecksumResult = await jfrogClient.artifactory().download().getArtifactChecksum(artifactPath);
        expect(checksum.md5).toBeTruthy();
        expect(checksum.sha1).toBeTruthy();
        expect(checksum.sha256).toBeTruthy();
    });

    test('Build artifact download checksum timeout test', async () => {
        const dummyClient: JfrogClient = (jfrogClient = new JfrogClient({
            artifactoryUrl: 'http://localhost:8080/artifactory',
            logger: TestUtils.createTestLogger(),
        } as IJfrogClientConfig));
        nock('http://localhost:8080').head('/artifactory/a/b/file').delay(6000).reply(200, 'RESPONSE');
        await expect(
            async () => await dummyClient.artifactory().download().getArtifactChecksum('a/b/file')
        ).rejects.toThrow('timeout of 2000ms exceeded');
    });
});

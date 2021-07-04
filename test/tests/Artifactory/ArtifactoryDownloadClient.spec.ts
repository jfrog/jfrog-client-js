import { IAqlSearchResult, IJfrogClientConfig } from '../../../model';
import { JfrogClient } from '../../../src';
import { TestUtils } from '../../TestUtils';

let jfrogClient: JfrogClient;
const BUILD_INFO_REPO: string = '/artifactory-build-info/';

describe('Artifactory Download tests', () => {
    const clientConfig: IJfrogClientConfig = TestUtils.getJfrogClientConfig();
    beforeAll(() => {
        jfrogClient = new JfrogClient(clientConfig);
    });

    test('Build artifact download test', async () => {
        const result: IAqlSearchResult = await TestUtils.searchArtifactoryBuildRepo(jfrogClient);
        expect(result.results.length).toBeGreaterThan(0);
        const artifactPath: string = BUILD_INFO_REPO + result.results[0].path + '/' + result.results[0].name;
        const build: any = await jfrogClient.artifactory().download().downloadArtifact(artifactPath);
        expect(build).toBeTruthy();
        expect(build.name).toBe(decodeURIComponent(result.results[0].path));
    });
});

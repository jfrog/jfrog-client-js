import {IAqlSearchResult, IClientConfig} from '../../../model';
import { ArtifactoryClient } from '../../../src';
import { TestUtils } from '../../TestUtils';

let artifactoryClient: ArtifactoryClient;
const BUILD_INFO_REPO: string = '/artifactory-build-info/';


describe('Artifactory Download tests', () => {
    const clientConfig: IClientConfig = TestUtils.getArtifactoryClientConfig();
    beforeAll(() => {
        artifactoryClient = new ArtifactoryClient(clientConfig);
    });

    test('Build artifact download test', async () => {
        const result: IAqlSearchResult = await TestUtils.searchArtifactoryBuildRepo(artifactoryClient);
        expect(result.results.length).toBeGreaterThan(0);
        const artifactPath: string = BUILD_INFO_REPO + result.results[0].path + '/' + result.results[0].name;
        const build: any = await artifactoryClient.download().downloadArtifact(artifactPath);
        expect(build).toBeTruthy();
        expect(build.name).toBe(result.results[0].path)
    });
});

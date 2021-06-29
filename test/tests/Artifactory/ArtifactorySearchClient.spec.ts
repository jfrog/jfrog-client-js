import { IAqlSearchResult, IClientConfig } from '../../../model';
import { ArtifactoryClient } from '../../../src';
import { TestUtils } from '../../TestUtils';

let artifactoryClient: ArtifactoryClient;

describe('Artifactory Search tests', () => {
    const clientConfig: IClientConfig = TestUtils.getArtifactoryClientConfig();
    beforeAll(() => {
        artifactoryClient = new ArtifactoryClient(clientConfig);
    });

    describe('Search tests', () => {
        test('Build Info Artifact AQL Search', async () => {
            const response: IAqlSearchResult = await TestUtils.searchArtifactoryBuildRepo(artifactoryClient);
            expect(response).toBeTruthy();
            expect(response.results).toHaveLength(1);
            expect(response.results[0].name).toBeTruthy();
            expect(response.results[0].repo).toBe('artifactory-build-info');
            expect(response.results[0].path).toBeTruthy();
            expect(response.results[0].created).toBeTruthy();
        });
    });
});

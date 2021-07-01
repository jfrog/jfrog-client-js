import { IAqlSearchResult, IJfrogClientConfig } from '../../../model';
import { JfrogClient } from '../../../src';
import { TestUtils } from '../../TestUtils';

let jfrogClient: JfrogClient;

describe('Artifactory Search tests', () => {
    const clientConfig: IJfrogClientConfig = TestUtils.getJfrogClientConfig();
    beforeAll(() => {
        jfrogClient = new JfrogClient(clientConfig);
    });

    describe('Search tests', () => {
        test('Build Info Artifact AQL Search', async () => {
            const response: IAqlSearchResult = await TestUtils.searchArtifactoryBuildRepo(jfrogClient);
            expect(response).toBeTruthy();
            expect(response.results).toHaveLength(1);
            expect(response.results[0].name).toBeTruthy();
            expect(response.results[0].repo).toBe('artifactory-build-info');
            expect(response.results[0].path).toBeTruthy();
            expect(response.results[0].created).toBeTruthy();
        });
    });
});

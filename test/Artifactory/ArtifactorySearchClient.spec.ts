import { IAqlSearchResult, IClientConfig } from '../../model';
import { ArtifactoryClient } from '../../src';
import { TestUtils } from '../TestUtils';

let artifactoryClient: ArtifactoryClient;

describe('Artifactory Search tests', () => {
    const clientConfig: IClientConfig = TestUtils.getArtifactoryClientConfig();
    beforeAll(() => {
        artifactoryClient = new ArtifactoryClient(clientConfig);
    });

    describe('Search tests', () => {
        test('Build Info Artifact AQL Search', async () => {
            const response: IAqlSearchResult = await artifactoryClient
                .search()
                .aqlSearch(
                    'items.find({' +
                        '"repo":"artifactory-build-info",' +
                        '"path":{"$match":"*"}}' +
                        ').include("name","repo","path","created").sort({"$desc":["created"]}).limit(10)'
                );
            expect(response).toBeTruthy();
            expect(response.results).toHaveLength(10);
            expect(response.results[0].repo).toBe('artifactory-build-info');
        });

        test('Artifact AQL Search', async () => {
            const response: IAqlSearchResult = await artifactoryClient
                .search()
                .aqlSearch(
                    'items.find({"$or":[{"$and":[{"repo":"robi-t","path":".","name":"demofile"}]}]}).include("name","repo","path","actual_md5","actual_sha1","size","type","modified","created","property")'
                );
            expect(response).toBeTruthy();
            expect(response.results).toHaveLength(1);
            expect(response.results[0].properties).toHaveLength(4);
            expect(response.results[0].properties[1].key).toBe('version');
        });
    });
});

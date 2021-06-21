import { IClientConfig } from '../../model';
import { ArtifactoryClient } from '../../src';
import { TestUtils } from '../TestUtils';

let artifactoryClient: ArtifactoryClient;

describe('Artifactory Download tests', () => {
    const clientConfig: IClientConfig = TestUtils.getArtifactoryClientConfig();
    beforeAll(() => {
        artifactoryClient = new ArtifactoryClient(clientConfig);
    });

    describe('Search tests', () => {
        test('Build Info Artifact AQL Search', async () => {
            const response: string = await artifactoryClient.download().download('/robi-t/demofile');
            expect(response).toBeTruthy();
        });
    });
});

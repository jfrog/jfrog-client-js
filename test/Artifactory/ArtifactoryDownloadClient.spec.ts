import { IClientConfig } from '../../model';
import { ArtifactoryClient } from '../../src';
import { TestUtils } from '../TestUtils';

let artifactoryClient: ArtifactoryClient;

describe('Artifactory Download tests', () => {
    const clientConfig: IClientConfig = TestUtils.getArtifactoryClientConfig();
    beforeAll(() => {
        artifactoryClient = new ArtifactoryClient(clientConfig);
    });

    test('Artifact download test', async () => {
        const response: string = await artifactoryClient.download().downloadArtifact('robi-t/demofile');
        expect(response).toBeTruthy();
    });

    test('Build artifact download test', async () => {
        const response: string = await artifactoryClient.download().downloadArtifact('artifactory-build-info/Maven/20201116.1-1605541010080.json');
        expect(response).toBeTruthy();
    });
});

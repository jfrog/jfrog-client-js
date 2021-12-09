import { JfrogClient } from '../../src';
import { ArtifactoryClient } from '../../src/Artifactory/ArtifactoryClient';
import { XrayClient } from '../../src/Xray/XrayClient';
import { IJfrogClientConfig } from '../../model/JfrogClientConfig';
import { TestUtils } from '../TestUtils';

const PLATFORM_URL = 'http://localhost:8000';
const ARTIFACTORY_URL = 'http://localhost:8765/artifactory';
const XRAY_URL = 'http://localhost:8765/xray';

describe('Jfrog client tests', () => {
    test('Client initialization with platform URL', () => {
        const config: IJfrogClientConfig = { platformUrl: PLATFORM_URL };
        const jfrogClient = new JfrogClient(config);
        expect(jfrogClient).toBeInstanceOf(JfrogClient);
        expect(jfrogClient.artifactory()).toBeInstanceOf(ArtifactoryClient);
        expect(jfrogClient.xray()).toBeInstanceOf(XrayClient);
        expect(jfrogClient.getServerUrl('artifactory', config.artifactoryUrl)).toBe(PLATFORM_URL + '/artifactory/');
        expect(jfrogClient.getServerUrl('xray', config.xrayUrl)).toBe(PLATFORM_URL + '/xray/');
    });

    test('Client initialization with custom Artifactory URL', () => {
        const config: IJfrogClientConfig = { artifactoryUrl: ARTIFACTORY_URL, logger: TestUtils.createTestLogger() };
        const jfrogClient = new JfrogClient(config);
        expect(jfrogClient).toBeInstanceOf(JfrogClient);
        expect(jfrogClient.artifactory()).toBeInstanceOf(ArtifactoryClient);
        expect(() => {
            jfrogClient.xray();
        }).toThrow('xray client: must provide platform or specific URLs');
        expect(jfrogClient.getServerUrl('artifactory', config.artifactoryUrl)).toBe(ARTIFACTORY_URL);
    });

    test('Client initialization with custom Xray URL', () => {
        const config: IJfrogClientConfig = { xrayUrl: XRAY_URL, logger: TestUtils.createTestLogger() };
        const jfrogClient = new JfrogClient(config);
        expect(jfrogClient).toBeInstanceOf(JfrogClient);
        expect(jfrogClient.xray()).toBeInstanceOf(XrayClient);
        expect(() => {
            jfrogClient.artifactory();
        }).toThrow('artifactory client: must provide platform or specific URLs');
        expect(jfrogClient.getServerUrl('xray', config.xrayUrl)).toBe(XRAY_URL);
    });

    test('Client initialization with w/o URLs', () => {
        expect(() => {
            const jfrogClient = new JfrogClient({ logger: TestUtils.createTestLogger() });
        }).toThrow('JFrog client: must provide platform or specific URLs');
    });
});

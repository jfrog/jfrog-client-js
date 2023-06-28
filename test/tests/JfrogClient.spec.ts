import * as os from 'os';

import { JfrogClient } from '../../src';
import { ArtifactoryClient } from '../../src/Artifactory/ArtifactoryClient';
import { XrayClient } from '../../src/Xray/XrayClient';
import { IJfrogClientConfig } from '../../model/JfrogClientConfig';
import { TestUtils } from '../TestUtils';
import { PlatformClient } from '../../src/Platform/PlatformClient';

const PLATFORM_URL: string = 'http://localhost:8000';
const ARTIFACTORY_URL: string = 'http://localhost:8765/artifactory';
const XRAY_URL: string = 'http://localhost:8765/xray';

describe('Jfrog client tests', () => {
    test('Client initialization with platform URL', () => {
        const config: IJfrogClientConfig = { platformUrl: PLATFORM_URL };
        const jfrogClient: JfrogClient = new JfrogClient(config);
        expect(jfrogClient).toBeInstanceOf(JfrogClient);
        expect(jfrogClient.artifactory()).toBeInstanceOf(ArtifactoryClient);
        expect(jfrogClient.xray()).toBeInstanceOf(XrayClient);
        expect(jfrogClient.getServerUrl('artifactory', config.artifactoryUrl)).toBe(PLATFORM_URL + '/artifactory/');
        expect(jfrogClient.getServerUrl('xray', config.xrayUrl)).toBe(PLATFORM_URL + '/xray/');
        expect(jfrogClient.clientId).toBeDefined();
    });

    test('Client initialization with custom Artifactory URL', () => {
        const config: IJfrogClientConfig = { artifactoryUrl: ARTIFACTORY_URL, logger: TestUtils.createTestLogger() };
        const jfrogClient: JfrogClient = new JfrogClient(config);
        expect(jfrogClient).toBeInstanceOf(JfrogClient);
        expect(jfrogClient.artifactory()).toBeInstanceOf(ArtifactoryClient);
        expect(() => {
            jfrogClient.xray();
        }).toThrow('xray client: must provide platform or specific URLs');
        expect(jfrogClient.getServerUrl('artifactory', config.artifactoryUrl)).toBe(ARTIFACTORY_URL);
    });

    test('Client initialization with custom Xray URL', () => {
        const config: IJfrogClientConfig = { xrayUrl: XRAY_URL, logger: TestUtils.createTestLogger() };
        const jfrogClient: JfrogClient = new JfrogClient(config);
        expect(jfrogClient).toBeInstanceOf(JfrogClient);
        expect(jfrogClient.xray()).toBeInstanceOf(XrayClient);
        expect(() => {
            jfrogClient.artifactory();
        }).toThrow('artifactory client: must provide platform or specific URLs');
        expect(jfrogClient.getServerUrl('xray', config.xrayUrl)).toBe(XRAY_URL);
    });

    test('Client initialization with w/o URLs', () => {
        expect(() => {
            new JfrogClient({ logger: TestUtils.createTestLogger() });
        }).toThrow('JFrog client: must provide platform or specific URLs');
    });

    test('Generate client unique id', () => {
        expect(JfrogClient.getClientId([undefined])).toBeUndefined();
        let test: os.NetworkInterfaceBase = {
            mac: 'aa:aa:aa:aa:aa:aa',
            address: '',
            netmask: '',
            internal: false,
            cidr: null,
        };
        expect(JfrogClient.getClientId([undefined, [], undefined, [test], undefined])).toBe(
            'c7d2c26fea52066c5943777a3c2e1fc510350d55'
        );
    });

    describe('Platform client', () => {
        test('Generate platform client with provided platform URL', () => {
            const jfrogClient: JfrogClient = new JfrogClient({ platformUrl: PLATFORM_URL });
            const result: PlatformClient = jfrogClient.platform();
            expect(result).toBeInstanceOf(PlatformClient);
        });

        test('Fail to Generate platform client with provided platform URL', () => {
            expect(() => new JfrogClient({ xrayUrl: PLATFORM_URL }).platform()).toThrowError(
                'JFrog client: must provide platform URLs'
            );
        });
    });
});

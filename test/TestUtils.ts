import { IClientConfig } from '../model';

export class TestUtils {
    public static getClientConfig(serverUrlEnvVar: string): IClientConfig {
        expect(process.env[serverUrlEnvVar]).toBeDefined();
        expect(process.env.CLIENTTESTS_PLATFORM_USERNAME).toBeDefined();
        expect(process.env.CLIENTTESTS_PLATFORM_PASSWORD).toBeDefined();
        return {
            serverUrl: process.env[serverUrlEnvVar],
            username: process.env.CLIENTTESTS_PLATFORM_USERNAME,
            password: process.env.CLIENTTESTS_PLATFORM_PASSWORD,
        } as IClientConfig;
    }

    public static getXrayClientConfig(): IClientConfig {
        return this.getClientConfig('CLIENTTESTS_XRAY_URL');
    }

    public static getArtifactoryClientConfig(): IClientConfig {
        return this.getClientConfig('CLIENTTESTS_ARTIFACTORY_URL');
    }
}

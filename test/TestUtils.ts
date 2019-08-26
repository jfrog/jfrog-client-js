import { IClientConfig } from '../model';

export class TestUtils {
    public static getClientConfig(): IClientConfig {
        expect(process.env.CLIENTTESTS_XRAY_URL).toBeDefined();
        expect(process.env.CLIENTTESTS_XRAY_USERNAME).toBeDefined();
        expect(process.env.CLIENTTESTS_XRAY_PASSWORD).toBeDefined();
        return {
            serverUrl: process.env.CLIENTTESTS_XRAY_URL,
            username: process.env.CLIENTTESTS_XRAY_USERNAME,
            password: process.env.CLIENTTESTS_XRAY_PASSWORD
        } as IClientConfig;
    }
}

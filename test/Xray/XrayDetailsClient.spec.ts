import { IDetailsResponse } from '../../model';
import { XrayClient } from '../../src';
import { TestUtils } from '../TestUtils';

let xrayClient: XrayClient;

beforeAll(() => {
    xrayClient = new XrayClient(TestUtils.getXrayClientConfig());
});
describe('Xray details tests', () => {
    test('Build details', async () => {
        const response: IDetailsResponse = await xrayClient.details().build('Maven', '20201116.1');
        expect(response).toBeTruthy();
    });

    test('Build details for non existing build', async () => {
        const buildName: string = 'buildNotExist';
        const buildNumber: string = '123';
        const response: IDetailsResponse = await xrayClient.details().build(buildName, buildNumber);
        expect(response).toBeTruthy();

        // Check general build details.
        expect(response.build_name).toBe(buildName);
        expect(response.build_number).toBe(buildNumber);
        expect(response.is_scan_completed).toBe(false);
        expect(response.components).toBeFalsy();

        // Check error.
        expect(response.error_details).toBeTruthy();
        expect(response.error_details.error_code).toBeTruthy();
        expect(response.error_details.error_message).toBeTruthy();
    });
});

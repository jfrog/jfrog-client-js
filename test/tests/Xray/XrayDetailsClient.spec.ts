import { IDetailsResponse } from '../../../model';
import { XrayClient } from '../../../src';
import { TestUtils } from '../../TestUtils';
import faker from "faker";
import nock from "nock";
import * as fs from 'fs';
import * as path from 'path';

let xrayClient: XrayClient;
const DETAILS_RESOURCE: string = './test/resources/xrayDetails/details.json'

beforeAll(() => {
    xrayClient = new XrayClient(TestUtils.getXrayClientConfig());
});
describe('Xray details tests', () => {
    test('Build details', async () => {
        const SERVER_URL: string = faker.internet.url();
        const buildName: string = 'build-example';
        const buildNumber: string = '20201116.1';
        const uri: string = `/api/v1/details/build?build_name=${encodeURIComponent(buildName)}&build_number=${encodeURIComponent(buildNumber)}`;

        const expectedResource: string = fs.readFileSync(path.resolve(DETAILS_RESOURCE)).toString();
        const scope = nock(SERVER_URL).get(uri).reply(202, expectedResource);
        const client = new XrayClient({ serverUrl: SERVER_URL });
        const res = await client.details().build(buildName, buildNumber);
        expect(res).toEqual(JSON.parse(expectedResource));
        expect(scope.isDone()).toBeTruthy();
    });

    test('Build details for non existing build', async () => {
        const buildName: string = 'buildDoesNotExist';
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

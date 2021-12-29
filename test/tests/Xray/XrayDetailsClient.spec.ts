import faker from 'faker';
import * as fs from 'fs';
import nock from 'nock';
import * as path from 'path';
import { IDetailsResponse } from '../../../model';
import { JfrogClient } from '../../../src';
import { TestUtils } from '../../TestUtils';

let jfrogClient: JfrogClient;
const DETAILS_RESOURCE: string = './test/resources/xrayDetails/details.json';

beforeAll(() => {
    jfrogClient = new JfrogClient(TestUtils.getJfrogClientConfig());
});

describe('Xray details tests', () => {
    test('Build details', async () => {
        const PLATFORM_URL: string = faker.internet.url();
        const buildName: string = 'build-example';
        const buildNumber: string = '20201116.1';
        const uri: string = `/xray/api/v1/details/build?build_name=${encodeURIComponent(
            buildName
        )}&build_number=${encodeURIComponent(buildNumber)}`;

        const expectedResource: string = fs.readFileSync(path.resolve(DETAILS_RESOURCE)).toString();
        const scope = nock(PLATFORM_URL).get(uri).reply(202, expectedResource);
        const client = new JfrogClient({ platformUrl: PLATFORM_URL, logger: TestUtils.createTestLogger() });
        const res = await client.xray().details().build(buildName, buildNumber);
        expect(res).toEqual(JSON.parse(expectedResource));
        expect(scope.isDone()).toBeTruthy();
    });

    test('Build details for non existing build', async () => {
        const buildName: string = 'buildDoesNotExist';
        const buildNumber: string = '123';
        const projectKey: string = 'projectDoesNotExist';
        const response: IDetailsResponse = await jfrogClient.xray().details().build(buildName, buildNumber, projectKey);
        expect(response).toBeTruthy();

        // Check general build details.
        expect(response.build_name).toBe(buildName);
        expect(response.build_number).toBe(buildNumber);
        expect(response.project_key).toBe(projectKey);
        expect(response.is_scan_completed).toBe(false);
        expect(response.components).toBeFalsy();

        // Check error.
        expect(response.error_details).toBeTruthy();
        expect(response.error_details.error_code).toBeTruthy();
        expect(response.error_details.error_message).toBeTruthy();
    });
});

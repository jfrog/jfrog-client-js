import faker from 'faker';
import nock from 'nock';
import { JfrogClient } from '../../../src';
import { TestUtils } from '../../TestUtils';

describe('Xray jas config tests', () => {
    test('Get jas config', async () => {
        const PLATFORM_URL: string = faker.internet.url();
        const uri: string = `/xray/api/v1/configuration/jas`;
        const expectedResource: string = '{"enable_token_validation_scanning": true}';
        nock(PLATFORM_URL).get(uri).reply(200, expectedResource);
        const client: JfrogClient = new JfrogClient({ platformUrl: PLATFORM_URL, logger: TestUtils.createTestLogger() });
        const res: any = await client.xray().jasconfig().getJasConfig();
        expect(res).toHaveProperty("enable_token_validation_scanning")
        expect(res.enable_token_validation_scanning).toEqual(true)
    });
});

describe('Xray jas config tests', () => {
    test('Fail get jas config', async () => {
        const PLATFORM_URL: string = faker.internet.url();
        const uri: string = `/xray/api/v1/configuration/jas`;
        nock(PLATFORM_URL).get(uri).reply(402, { message: 'error' }).persist();
        const client: JfrogClient = new JfrogClient({ platformUrl: PLATFORM_URL, logger: TestUtils.createTestLogger() })
        await expect(async () => {
            await client
              .xray()
              .jasconfig()
              .getJasConfig();
        }).rejects.toThrow(`Request failed with status code 402`);
    });
});

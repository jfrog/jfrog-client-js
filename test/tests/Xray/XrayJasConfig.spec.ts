import faker from 'faker';
import nock from 'nock';
import { JfrogClient } from '../../../src';
import { TestUtils } from '../../TestUtils';

let jfrogClient: JfrogClient;

beforeAll(() => {
  jfrogClient = new JfrogClient(TestUtils.getJfrogClientConfig());
});

describe('Xray jas config tests', () => {
  test('Get jas config', async () => {
    const PLATFORM_URL: string = faker.internet.url();
    const uri: string = `/xray/api/v1/configuration/jas`
    const expectedResource: string = '{"enable_token_validation_scanning": true}'
    nock(PLATFORM_URL).get(uri).reply(200, expectedResource);
    const res: any = await jfrogClient.xray().jasconfig().getJasConfig()
    expect(res).toEqual(JSON.parse(expectedResource));
  });
});

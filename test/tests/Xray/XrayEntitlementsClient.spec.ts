import faker from 'faker';
import nock from 'nock';
import { JfrogClient } from '../../../src';
import { TestUtils } from '../../TestUtils';

describe('Xray Entitlements tests', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    let tests: any[] = [
        {
            test: 'pass',
            feature: 'feature',
            expected: true,
        },
        {
            test: 'fail',
            feature: 'feature',
            expected: false,
        },
    ];

    tests.forEach((testCase) => {
        it('Feature - ' + testCase.test, async () => {
            const platformUrl: string = faker.internet.url();
            nock(platformUrl)
                .get(`/xray/api/v1/entitlements/feature/` + testCase.feature)
                .reply(200, { feature_id: testCase.feature, entitled: testCase.expected });
            const client: JfrogClient = new JfrogClient({ platformUrl, logger: TestUtils.createTestLogger() });
            const res: any = await client.xray().entitlements().feature(testCase.feature);
            expect(res).toBe(testCase.expected);
        });
    });

    test('Feature failure', async () => {
        let feature: string = 'feature';
        const platformUrl: string = faker.internet.url();
        const scope: nock.Scope = nock(platformUrl)
            .get(`/xray/api/v1/entitlements/feature/` + feature)
            .reply(402, { message: 'error' });
        const client: JfrogClient = new JfrogClient({ platformUrl, logger: TestUtils.createTestLogger() });
        const res: any = await client.xray().entitlements().feature(feature);
        expect(res).toBeFalsy();
        expect(scope.isDone()).toBeTruthy();
    });
});

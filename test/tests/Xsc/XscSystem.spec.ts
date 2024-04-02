import nock from 'nock';
import { IJfrogClientConfig, IXscVersion } from '../../../model';
import { JfrogClient } from '../../../src';
import { TestUtils } from '../../TestUtils';

describe('Xsc System tests', () => {
    const clientConfig: IJfrogClientConfig = TestUtils.getJfrogClientConfig();
    const jfrogClient: JfrogClient = new JfrogClient(clientConfig);

    afterAll(() => {
        nock.cleanAll();
    });

    describe('Version tests', () => {
        test('Version', async () => {
            if (!(await jfrogClient.xsc().system().enabled())) {
                clientConfig.logger?.warn('Xsc is not enabled in the configuration platformUrl, skipping tests...');
                return;
            }

            const version: IXscVersion = await jfrogClient.xsc().system().version();
            expect(version.xray_version).toBeTruthy();
            expect(version.xsc_version).toBeTruthy();
        });
    });
});

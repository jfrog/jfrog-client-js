import nock from 'nock';
import * as os from 'os';
import { JfrogClient } from '../../../src/JfrogClient';
import { TestUtils } from '../../TestUtils';
import { IJfrogClientConfig, ScanEvent, ScanEventStatus, XscLog } from '../../../model';

describe('Xsc Events tests', () => {
    const clientConfig: IJfrogClientConfig = TestUtils.getJfrogClientConfig();
    const jfrogClient: JfrogClient = new JfrogClient(clientConfig);

    afterAll(() => {
        nock.cleanAll();
    });

    test('Log event', async () => {
        if (await shouldSkipTest()) {
            return;
        }
        const event: XscLog = {
            log_level: 'debug',
            source: 'test - client js',
            message: 'test message',
        };
        const res: any = await jfrogClient.xsc().event().log(event);
        expect(res).toBeTruthy();
    });

    test('Scan event', async () => {
        if (await shouldSkipTest()) {
            return;
        }
        // Start scan
        const res: ScanEvent = await jfrogClient
            .xsc()
            .event()
            .startScan({ product: 'jfrog-client-js tests', os_platform: os.platform(), os_architecture: os.arch() });
        expect(res).toBeTruthy();
        expect(isValidUUID(res.multi_scan_id)).toBeTruthy();

        // End scan
        res.event_status = ScanEventStatus.Completed;
        expect(await jfrogClient.xsc().event().endScan(res)).toBeTruthy();
    });

    async function shouldSkipTest(): Promise<boolean> {
        if (!(await jfrogClient.xsc().system().enabled())) {
            clientConfig.logger?.warn('Xsc is not enabled in the configuration platformUrl, skipping tests...');
            return true;
        }
        return false;
    }

    function isValidUUID(str: string): boolean {
        const uuidRegex: RegExp = new RegExp(`^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$`);
        return uuidRegex.test(str);
    }
});

import nock from 'nock';
import * as os from 'os';
import { JfrogClient } from '../../../src/JfrogClient';
import { TestUtils } from '../../TestUtils';
import {
    IJfrogClientConfig,
    ScanEvent,
    ScanEventStatus,
    ScanEventType,
    StartScanRequest,
    ScanEventResponse,
    XscLog,
} from '../../../model';

describe.only('Xsc Events tests', () => {
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
        let testEvent: StartScanRequest = {
            product: 'jfrog-client-js tests',
            os_platform: os.platform(),
            os_architecture: os.arch(),
            event_type: ScanEventType.SourceCode,
            event_status: ScanEventStatus.Started,
        };
        // Start scan
        const res: ScanEvent = await jfrogClient
            .xsc()
            .event()
            .startScan({ product: 'jfrog-client-js tests', os_platform: os.platform(), os_architecture: os.arch() });
        expect(res).toBeTruthy();
        expect(isValidUUID(res.multi_scan_id)).toBeTruthy();

        // Get scan information
        let response: ScanEventResponse = await jfrogClient.xsc().event().getScanEvent(res.multi_scan_id);
        expect(response).toBeTruthy();
        expect(response).toStrictEqual(testEvent);

        // End scan
        res.event_status = ScanEventStatus.Completed;
        expect(await jfrogClient.xsc().event().endScan(res)).toBeTruthy();

        response = await jfrogClient.xsc().event().getScanEvent(res.multi_scan_id);
        expect(response).toBeTruthy();
        expect(response).toStrictEqual({ ...testEvent, event_status: ScanEventStatus.Completed });
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

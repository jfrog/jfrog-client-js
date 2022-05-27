import faker from 'faker';
import nock from 'nock';
import { IGraphRequestModel } from '../../../model/Xray/Scan/GraphRequestModel';
import { IGraphResponse } from '../../../model/Xray/Scan/GraphResponse';
import { JfrogClient } from '../../../src';
import { XrayScanProgress } from '../../../src/Xray/XrayScanProgress';
import { TestUtils } from '../../TestUtils';

const PLATFORM_URL: string = faker.internet.url();
beforeAll(() => {
    nock.disableNetConnect();
});

afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe('Scan graph tests', () => {
    test('Unexpected response', async () => {
        const uri: string = `/xray/api/v1/scan/graph`;
        nock(PLATFORM_URL)
            .post(uri)
            .reply(200, { scan_id: '123' } as IGraphResponse);
        nock(PLATFORM_URL)
            .get(uri + '/123?include_licenses=true&include_vulnerabilities=true')
            .reply(404, 'not found');
        const client: JfrogClient = new JfrogClient({
            platformUrl: PLATFORM_URL,
            logger: TestUtils.createTestLogger(),
        });
        const progress: DummyProgress = new DummyProgress();
        await expect(async () => {
            await client
                .xray()
                .scan()
                .graph({} as IGraphRequestModel, progress, () => undefined, '', []);
        }).rejects.toThrow(`Received unexpected response from Xray. Error: Request failed with status code 404`);
        expect(progress.lastPercentage).toBe(100);
    });

    test('Project test', async () => {
        const uri: string = `/xray/api/v1/scan/graph`;
        nock(PLATFORM_URL)
            .post(uri + '?project=ecosys')
            .reply(200, { scan_id: '123' } as IGraphResponse);
        const scope: nock.Scope = nock(PLATFORM_URL)
            .get(uri + '/123?include_licenses=true&include_vulnerabilities=false')
            .reply(200);
        const client: JfrogClient = new JfrogClient({
            platformUrl: PLATFORM_URL,
            logger: TestUtils.createTestLogger(),
        });
        const progress: DummyProgress = new DummyProgress();
        await client
            .xray()
            .scan()
            .graph({ component_id: 'engine' } as IGraphRequestModel, progress, () => undefined, 'ecosys', []);
        expect(scope.isDone()).toBeTruthy();
        expect(progress.lastPercentage).toBe(100);
    });

    test('Watch test', async () => {
        const uri: string = `/xray/api/v1/scan/graph`;
        nock(PLATFORM_URL)
            .post(uri + '?watch=watch-1')
            .reply(200, { scan_id: '123' } as IGraphResponse);
        const scope: nock.Scope = nock(PLATFORM_URL)
            .get(uri + '/123?include_licenses=true&include_vulnerabilities=false')
            .reply(200);
        const client: JfrogClient = new JfrogClient({
            platformUrl: PLATFORM_URL,
            logger: TestUtils.createTestLogger(),
        });
        const progress: DummyProgress = new DummyProgress();
        await client
            .xray()
            .scan()
            .graph({ component_id: 'engine' } as IGraphRequestModel, progress, () => undefined, '', ['watch-1']);
        expect(scope.isDone()).toBeTruthy();
        expect(progress.lastPercentage).toBe(100);
    });

    test('Watches test', async () => {
        const uri: string = `/xray/api/v1/scan/graph`;
        nock(PLATFORM_URL)
            .post(uri + '?watch=watch-1&watch=watch-2')
            .reply(200, { scan_id: '123' } as IGraphResponse);
        const scope: nock.Scope = nock(PLATFORM_URL)
            .get(uri + '/123?include_licenses=true&include_vulnerabilities=false')
            .reply(200);
        const client: JfrogClient = new JfrogClient({
            platformUrl: PLATFORM_URL,
            logger: TestUtils.createTestLogger(),
        });
        const progress: DummyProgress = new DummyProgress();
        await client
            .xray()
            .scan()
            .graph({ component_id: 'engine' } as IGraphRequestModel, progress, () => undefined, '', [
                'watch-1',
                'watch-2',
            ]);
        expect(scope.isDone()).toBeTruthy();
        expect(progress.lastPercentage).toBe(100);
    });

    test('Undefined request', async () => {
        const client: JfrogClient = new JfrogClient({
            platformUrl: PLATFORM_URL,
            logger: TestUtils.createTestLogger(),
        });
        const progress: DummyProgress = new DummyProgress();
        expect(
            await client
                .xray()
                .scan()
                .graph(undefined as unknown as IGraphRequestModel, progress, () => undefined, '', [])
        ).toBeDefined();
        expect(progress.lastPercentage).toBe(100);
    });

    test('202 test', async () => {
        const uri: string = `/xray/api/v1/scan/graph`;
        nock(PLATFORM_URL)
            .post(uri)
            .reply(200, { scan_id: '123' } as IGraphResponse);
        nock(PLATFORM_URL)
            .get(uri + '/123?include_licenses=true&include_vulnerabilities=true')
            .reply(202);
        const scope: nock.Scope = nock(PLATFORM_URL)
            .get(uri + '/123?include_licenses=true&include_vulnerabilities=true')
            .reply(200);
        const client: JfrogClient = new JfrogClient({
            platformUrl: PLATFORM_URL,
            logger: TestUtils.createTestLogger(),
        });
        const progress: DummyProgress = new DummyProgress();
        await client
            .xray()
            .scan()
            .graph({ component_id: 'engine' } as IGraphRequestModel, progress, () => undefined, '', [], 10);
        expect(scope.isDone()).toBeTruthy();
        expect(progress.lastPercentage).toBe(100);
    });

    test('Timeout', async () => {
        const uri: string = `/xray/api/v1/scan/graph`;
        nock(PLATFORM_URL)
            .post(uri)
            .reply(200, { scan_id: '123' } as IGraphResponse);
        nock(PLATFORM_URL)
            .get(uri + '/123?include_licenses=true&include_vulnerabilities=true')
            .reply(202)
            .persist();
        const client: JfrogClient = new JfrogClient({
            platformUrl: PLATFORM_URL,
            logger: TestUtils.createTestLogger(),
        });
        const progress: DummyProgress = new DummyProgress();
        await expect(async () => {
            await client
                .xray()
                .scan()
                .graph({ component_id: 'engine' } as IGraphRequestModel, progress, () => undefined, '', [], 10);
        }).rejects.toThrow(`Xray get scan graph exceeded the timeout.`);
        expect(progress.lastPercentage).toBe(100);
    });

    test('Check cancelled', async () => {
        const uri: string = `/xray/api/v1/scan/graph`;
        nock(PLATFORM_URL)
            .post(uri)
            .reply(200, { scan_id: '123' } as IGraphResponse);
        nock(PLATFORM_URL)
            .get(uri + '/123?include_licenses=true&include_vulnerabilities=true')
            .reply(202)
            .persist();
        const client: JfrogClient = new JfrogClient({
            platformUrl: PLATFORM_URL,
            logger: TestUtils.createTestLogger(),
        });
        const progress: DummyProgress = new DummyProgress();
        await expect(async () => {
            await client
                .xray()
                .scan()
                .graph(
                    { component_id: 'engine' } as IGraphRequestModel,
                    progress,
                    () => {
                        throw Error('Scan aborted.');
                    },
                    '',
                    []
                );
        }).rejects.toThrow(`Scan aborted.`);
    });
});

class DummyProgress implements XrayScanProgress {
    private _lastPercentage: number = 0;
    setPercentage(percentage: number): void {
        this._lastPercentage = percentage;
    }

    public get lastPercentage(): number {
        return this._lastPercentage;
    }
}

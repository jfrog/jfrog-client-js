import faker from 'faker';
import nock from 'nock';
import { IGraphRequestModel } from '../../../model/Xray/Scan/GraphRequestModel';
import { IGraphResponse } from '../../../model/Xray/Scan/GraphResponse';
import { JfrogClient } from '../../../src';
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
        const client = new JfrogClient({ platformUrl: PLATFORM_URL, logger: TestUtils.createTestLogger() });
        await expect(async () => {
            await client
                .xray()
                .scan()
                .graph({} as IGraphRequestModel, () => undefined, '');
        }).rejects.toThrow(`Received unexpected status '404' from Xray: Request failed with status code 404`);
    });

    test('Project test', async () => {
        const uri: string = `/xray/api/v1/scan/graph`;
        nock(PLATFORM_URL)
            .post(uri + '?project=ecosys')
            .reply(200, { scan_id: '123' } as IGraphResponse);
        const scope: nock.Scope = nock(PLATFORM_URL)
            .get(uri + '/123?include_licenses=true&include_vulnerabilities=false')
            .reply(200);
        const client = new JfrogClient({ platformUrl: PLATFORM_URL, logger: TestUtils.createTestLogger() });
        await client
            .xray()
            .scan()
            .graph({ component_id: 'engine' } as IGraphRequestModel, () => undefined, 'ecosys');
        expect(scope.isDone()).toBeTruthy();
    });

    test('Undefined request', async () => {
        const client = new JfrogClient({ platformUrl: PLATFORM_URL, logger: TestUtils.createTestLogger() });
        expect(
            await client
                .xray()
                .scan()
                .graph(undefined as unknown as IGraphRequestModel, () => undefined, '')
        ).toBeDefined();
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
        const client = new JfrogClient({ platformUrl: PLATFORM_URL, logger: TestUtils.createTestLogger() });
        await client
            .xray()
            .scan()
            .graph({ component_id: 'engine' } as IGraphRequestModel, () => undefined, '', 10);
        expect(scope.isDone()).toBeTruthy();
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
        const client = new JfrogClient({ platformUrl: PLATFORM_URL, logger: TestUtils.createTestLogger() });
        await expect(async () => {
            await client
                .xray()
                .scan()
                .graph({ component_id: 'engine' } as IGraphRequestModel, () => undefined, '', 10);
        }).rejects.toThrow(`Xray get scan graph exceeded the timeout.`);
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
        const client = new JfrogClient({ platformUrl: PLATFORM_URL, logger: TestUtils.createTestLogger() });
        await expect(async () => {
            await client
                .xray()
                .scan()
                .graph(
                    { component_id: 'engine' } as IGraphRequestModel,
                    () => {
                        throw Error('Scan aborted.');
                    },
                    ''
                );
        }).rejects.toThrow(`Scan aborted.`);
    });
});

import * as faker from 'faker';
import * as http from 'http';
import { createProxyServer, ServerOptions } from 'http-proxy';
import nock from 'nock';
import { IArtifactoryVersion, IClientConfig, IProxyConfig } from '../../../model';
import { ArtifactoryClient } from '../../../src';
import { TestUtils } from '../../TestUtils';

let isPassedThroughProxy: boolean;
let artifactoryClient: ArtifactoryClient;

describe('Artifactory System tests', () => {
    const clientConfig: IClientConfig = TestUtils.getArtifactoryClientConfig();
    beforeAll(() => {
        artifactoryClient = new ArtifactoryClient(clientConfig);
    });

    describe('Ping tests', () => {
        const PING_RES = 'OK';

        beforeEach(() => {
            process.env.HTTPS_PROXY = '';
            process.env.NO_PROXY = '';
            isPassedThroughProxy = false;
        });

        test('Ping success', async () => {
            const response = await artifactoryClient.system().ping();
            expect(response).toStrictEqual(PING_RES);
            expect(isPassedThroughProxy).toBeFalsy();
        });

        describe('Ping proxy', () => {
            let proxy: any;
            let proxyArtifactoryClient: ArtifactoryClient;
            beforeAll(() => {
                clientConfig.proxy = { port: 9090 } as IProxyConfig;
                proxyArtifactoryClient = new ArtifactoryClient(clientConfig);
                proxy = createProxyServer({ target: clientConfig.serverUrl } as ServerOptions).listen(9090);
                proxy.on('proxyReq', () => (isPassedThroughProxy = true));
            });
            afterAll(() => {
                proxy.close();
            });

            test('Ping through proxy', async () => {
                const response = await proxyArtifactoryClient.system().ping();
                expect(response).toStrictEqual(PING_RES);
                expect(isPassedThroughProxy).toBeTruthy();
            });

            test('Ping through proxy env', async () => {
                process.env.HTTPS_PROXY = 'http://127.0.0.1:9090';
                const response = await artifactoryClient.system().ping();
                expect(response).toStrictEqual(PING_RES);
                expect(isPassedThroughProxy).toBeTruthy();
            });

            test('Ping skip proxy', async () => {
                process.env.HTTPS_PROXY = 'http://127.0.0.1:9090';
                process.env.NO_PROXY = clientConfig.serverUrl;
                const response = await artifactoryClient.system().ping();
                expect(response).toStrictEqual(PING_RES);
                expect(isPassedThroughProxy).toBeTruthy();
            });

            test('Ping empty proxy', async () => {
                const artifactoryClientEmptyProxy = new ArtifactoryClient({
                    serverUrl: clientConfig.serverUrl,
                    username: clientConfig.username,
                    password: clientConfig.password,
                    proxy: {} as IProxyConfig,
                });
                const response = await artifactoryClientEmptyProxy.system().ping();
                expect(response).toStrictEqual(PING_RES);
                expect(isPassedThroughProxy).toBeFalsy();
            });

            describe('Ping auth proxy', () => {
                const PROXY_USER: string = faker.internet.userName();
                const PROXY_PASS: string = faker.internet.password();
                let proxyAuthArtifactoryClient: ArtifactoryClient;
                let authProxy: any;
                beforeAll(() => {
                    clientConfig.proxy = { port: 9091 } as IProxyConfig;
                    clientConfig.headers = { 'proxy-authorization': 'Basic ' + Buffer.from(PROXY_USER + ':' + PROXY_PASS).toString('base64') };
                    proxyAuthArtifactoryClient = new ArtifactoryClient(clientConfig);
                    authProxy = createProxyServer({ target: clientConfig.serverUrl } as ServerOptions).listen(9091);
                    authProxy.on('proxyReq', (proxyReq: http.ClientRequest) => {
                        isPassedThroughProxy = true;
                        // Check proxy header
                        const actualAuthHeader = proxyReq.getHeader('proxy-authorization');
                        const expectAuthHeader = 'Basic ' + Buffer.from(PROXY_USER + ':' + PROXY_PASS).toString('base64');
                        expect(actualAuthHeader).toBe(expectAuthHeader);
                    });
                });
                afterAll(() => {
                    authProxy.close();
                });

                test('Ping though auth proxy', async () => {
                    const response = await proxyAuthArtifactoryClient.system().ping();
                    expect(response).toStrictEqual(PING_RES);
                    expect(isPassedThroughProxy).toBeTruthy();
                });
            });
        });

        test('Ping failure', async () => {
            const SERVER_URL: string = faker.internet.url();
            const scope = nock(SERVER_URL).get(`/api/system/ping`).reply(402, { message: 'error' });
            const client = new ArtifactoryClient({ serverUrl: SERVER_URL });
            const res = await client.system().ping();
            expect(res).toBeFalsy();
            expect(scope.isDone()).toBeTruthy();
            expect(isPassedThroughProxy).toBeFalsy();
        });
    });

    test('Version', async () => {
        const version: IArtifactoryVersion = await artifactoryClient.system().version();
        expect(version.version).toBeTruthy();
        expect(version.revision).toBeTruthy();
        expect(isPassedThroughProxy).toBeFalsy();
    });
});

import { IJfrogClientConfig } from '../model/JfrogClientConfig';
import { XrayClient } from './Xray/XrayClient';
import { ArtifactoryClient } from './Artifactory/ArtifactoryClient';
import { IClientSpecificConfig } from '../model/ClientSpecificConfig';

import * as os from 'os';
import crypto from 'crypto'; // Important - Don't import '*'. It'll import deprecated encryption methods

export class JfrogClient {
    private static readonly ARTIFACTORY_SUFFIX: string = 'artifactory';
    private static readonly XRAY_SUFFIX: string = 'xray';

    public readonly clientId?: string;

    public constructor(private _jfrogConfig: IJfrogClientConfig) {
        if (!_jfrogConfig.platformUrl && !_jfrogConfig.xrayUrl && !_jfrogConfig.artifactoryUrl) {
            throw new Error('JFrog client: must provide platform or specific URLs');
        }
        this.clientId = JfrogClient.getClientId();
    }

    public artifactory(): ArtifactoryClient {
        return new ArtifactoryClient(
            this.getSpecificClientConfig(JfrogClient.ARTIFACTORY_SUFFIX, this._jfrogConfig.artifactoryUrl),
            this.clientId
        );
    }

    public xray(): XrayClient {
        return new XrayClient(this.getSpecificClientConfig(JfrogClient.XRAY_SUFFIX, this._jfrogConfig.xrayUrl));
    }

    /**
     * Creates a server specific config from the provided JFrog config.
     * @param serverSuffix - server specific suffix.
     * @param providedCustomUrl - custom server URL, if provided.
     * @private
     */
    private getSpecificClientConfig(
        serverSuffix: string,
        providedCustomUrl: string | undefined
    ): IClientSpecificConfig {
        return { serverUrl: this.getServerUrl(serverSuffix, providedCustomUrl), ...this._jfrogConfig };
    }

    getServerUrl(serverSuffix: string, providedCustomUrl: string | undefined): string {
        let url: string = providedCustomUrl || '';
        if (!url) {
            if (!this._jfrogConfig.platformUrl) {
                throw new Error(serverSuffix + ' client: must provide platform or specific URLs');
            }
            url = JfrogClient.addTrailingSlashIfMissing(this._jfrogConfig.platformUrl) + serverSuffix + '/';
        }
        return url;
    }

    private static addTrailingSlashIfMissing(url: string): string {
        return url + (url.endsWith('/') ? '' : '/');
    }

    public static getClientId(): string | undefined {
        for (const networkInterfaces of Object.values(os.networkInterfaces())) {
            for (const networkInterface of networkInterfaces ?? []) {
                if (networkInterface.mac) {
                    return this.hash('sha1', networkInterface.mac);
                }
            }
        }
        return undefined;
    }

    private static hash(algorithm: string, data: string): string {
        return crypto.createHash(algorithm).update(data).digest('hex');
    }
}

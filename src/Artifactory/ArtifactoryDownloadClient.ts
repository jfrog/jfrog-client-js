import { HttpClient, IRequestParams } from '../HttpClient';
import { IChecksumResult, ILogger } from '../../model/';
import { IClientResponse } from '../ClientResponse';
import * as fs from 'fs';

export class ArtifactoryDownloadClient {
    private static readonly MD5_HEADER: string = 'x-checksum-md5';
    private static readonly SHA1_HEADER: string = 'x-checksum-sha1';
    private static readonly SHA256_HEADER: string = 'x-checksum-sha256';

    constructor(private readonly httpClient: HttpClient, private readonly logger: ILogger) {}

    public async downloadArtifact(artifactPath: string): Promise<string> {
        this.logger.debug('Sending download artifact request...');
        const requestParams: IRequestParams = {
            url: encodeURI(artifactPath),
            method: 'GET',
            headers: { Connection: 'Keep-Alive' },
        };
        return (await this.httpClient.doAuthRequest(requestParams)).data;
    }

    public async downloadArtifactToFile(from: string, to: string): Promise<void> {
        this.logger.debug('Sending download artifact request...');
        const requestParams: IRequestParams = {
            url: encodeURI(from),
            method: 'GET',
            responseType: 'stream',
        };

        let response: IClientResponse = await this.httpClient.doAuthRequest(requestParams);
        return new Promise((resolve, reject) => {
            const writer: fs.WriteStream = fs.createWriteStream(to, { flags: 'w' });
            response.data.pipe(writer);
            writer.on('finish', () => {
                this.logger.debug('download from ' + from + ' to ' + to + ' was successful');
                resolve();
            });
            writer.on('error', (err) => {
                this.logger.debug('download from ' + from + ' to ' + to + ' was unsuccessful, Error:' + err);
                writer.close();
                reject(err);
            });
        });
    }

    public async getArtifactChecksum(artifactPath: string): Promise<IChecksumResult> {
        this.logger.debug('Sending head request to ' + artifactPath + '...');
        const requestParams: IRequestParams = {
            url: encodeURI(artifactPath),
            timeout: HttpClient.DEFAULT_TIMEOUT,
            method: 'HEAD',
        };
        const response: IClientResponse = await this.httpClient.doAuthRequest(requestParams);
        if (!response.headers) {
            throw new Error('JFrog client: Head request does not contain headers');
        }
        return {
            md5: response.headers[ArtifactoryDownloadClient.MD5_HEADER],
            sha1: response.headers[ArtifactoryDownloadClient.SHA1_HEADER],
            sha256: response.headers[ArtifactoryDownloadClient.SHA256_HEADER],
        } as IChecksumResult;
    }
}

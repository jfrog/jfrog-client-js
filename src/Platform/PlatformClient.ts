import { HttpClient } from '../HttpClient';
import { WebLoginClient } from './WebLoginClient';
import { ILogger } from '../../model/';

export class PlatformClient {
    private readonly httpClient: HttpClient;

    constructor(platformUrl: string, private logger?: ILogger) {
        this.httpClient = new HttpClient({ serverUrl: platformUrl }, this.logger);
    }

    public WebLogin(): WebLoginClient {
        return new WebLoginClient(this.httpClient, this.logger);
    }
}

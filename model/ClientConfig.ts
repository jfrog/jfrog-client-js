import { ILogger } from './Logger';
import { IProxyConfig } from './ProxyConfig';

export interface IClientConfig {
    username?: string;
    password?: string;
    proxy?: IProxyConfig | false;
    logger?: ILogger;
    headers?: { [key: string]: string };
}

import { AxiosError } from 'axios';
import { ILogger } from './Logger';
import { IProxyConfig } from './ProxyConfig';

export interface IClientConfig {
    username?: string;
    password?: string;
    accessToken?: string;
    proxy?: IProxyConfig | false;
    logger?: ILogger;
    headers?: { [key: string]: string };
    retries?: number;
    timeout?: number;
    // Status codes that trigger retries.
    retryOnStatusCode?: RetryOnStatusCode;
    // Delay between retries.
    retryDelay?: number;
}

export type RetryOnStatusCode = (error?: AxiosError) => boolean;

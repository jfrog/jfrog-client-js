import { IClientConfig } from './ClientConfig';

export interface IClientSpecificConfig extends IClientConfig {
    serverUrl: string;
}

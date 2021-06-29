import { IClientConfig } from './ClientConfig';

export interface IJfrogClientConfig extends IClientConfig {
    platformUrl?: string;
    artifactoryUrl?: string;
    xrayUrl?: string;
}

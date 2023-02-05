import { IUsageFeature } from './UsageFeature';

export interface IUsageData {
    productId: string;
    features: IUsageFeature[];
    uniqueClientId?: string;
}

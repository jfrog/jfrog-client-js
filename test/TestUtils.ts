import { IAqlSearchResult, ILogger } from '../model';
import { IJfrogClientConfig } from '../model/JfrogClientConfig';
import { JfrogClient } from '../src';

export class TestUtils {
    public static getJfrogClientConfig(): IJfrogClientConfig {
        expect(process.env.CLIENTTESTS_PLATFORM_URL).toBeDefined();
        if (
            (process.env.CLIENTTESTS_PLATFORM_USERNAME === '' || process.env.CLIENTTESTS_PLATFORM_PASSWORD === '') &&
            process.env.CLIENTTESTS_PLATFORM_ACCESS_TOKEN === ''
        ) {
            throw new Error(
                'no valid authentication method was set. Config the Basic Auth or the Access Token env vars to run the tests'
            );
        }
        return {
            platformUrl: process.env.CLIENTTESTS_PLATFORM_URL,
            username: process.env.CLIENTTESTS_PLATFORM_USERNAME,
            password: process.env.CLIENTTESTS_PLATFORM_PASSWORD,
            accessToken: process.env.CLIENTTESTS_PLATFORM_ACCESS_TOKEN,
            logger: TestUtils.createTestLogger(),
            retries: 5
        } as IJfrogClientConfig;
    }

    public static async searchArtifactoryBuildRepo(jfrogClient: JfrogClient): Promise<IAqlSearchResult> {
        return await jfrogClient
            .artifactory()
            .search()
            .aqlSearch(
                'items.find({' +
                    '"repo":"artifactory-build-info",' +
                    '"path":{"$match":"*"}}' +
                    ').include("name","repo","path","created").sort({"$desc":["created"]}).limit(1)'
            );
    }

    public static createTestLogger(): ILogger {
        return {
            error: (...args) => console.error(args),
            warn: (...args) => console.warn(args),
            debug: () => {
                // Empty body
            },
        } as ILogger;
    }
}

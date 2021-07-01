import { IAqlSearchResult } from '../model';
import { IJfrogClientConfig } from '../model/JfrogClientConfig';
import { JfrogClient } from '../src';

export class TestUtils {
    public static getJfrogClientConfig(): IJfrogClientConfig {
        expect(process.env.CLIENTTESTS_PLATFORM_URL).toBeDefined();
        expect(process.env.CLIENTTESTS_PLATFORM_USERNAME).toBeDefined();
        expect(process.env.CLIENTTESTS_PLATFORM_PASSWORD).toBeDefined();
        return {
            platformUrl: process.env.CLIENTTESTS_PLATFORM_URL,
            username: process.env.CLIENTTESTS_PLATFORM_USERNAME,
            password: process.env.CLIENTTESTS_PLATFORM_PASSWORD,
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
}

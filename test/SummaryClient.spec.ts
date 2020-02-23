import { IArtifact } from '../model/Summary/Artifact';
import { ComponentDetails } from '../model/Summary/ComponentDetails';
import { IGeneral } from '../model/Summary/General';
import { IIssue } from '../model/Summary/Issue';
import { ILicense } from '../model/Summary/License';
import { ISummaryRequestModel } from '../model/Summary/SummaryRequestModel';
import { ISummaryResponse } from '../model/Summary/SummaryResponse';
import { XrayClient } from '../src/XrayClient';
import { TestUtils } from './TestUtils';

const FIRST_ISSUE_SUMMARY = 'JS-YAML lib/js-yaml/loader.js storeMappingPair() Function Nested Array Handling Resource Consumption DoS Weakness';
const SECOND_ISSUE_SUMMARY = 'JS-YAML lib/js-yaml/loader.js storeMappingPair() Function Object Property Handling Arbitrary Code Execution';

let xrayClient: XrayClient;
let summaryRequest: ISummaryRequestModel;

beforeAll(() => {
    xrayClient = new XrayClient(TestUtils.getClientConfig());
    summaryRequest = {
        component_details: [new ComponentDetails('npm://js-yaml:3.10.0')]
    } as ISummaryRequestModel;
});
describe('Xray summary tests', () => {
    test('Artifact summary component', async () => {
        const response: ISummaryResponse = await xrayClient.summary().component(summaryRequest);
        expect(response).toBeTruthy();
        const artifacts: IArtifact[] = response.artifacts;
        expect(artifacts.length).toBe(1);
    });

    test('Artifact summary component general', async () => {
        const response: ISummaryResponse = await xrayClient.summary().component(summaryRequest);
        expect(response).toBeTruthy();

        const general: IGeneral = response.artifacts[0].general;
        expect(general).toBeTruthy();
        expect(general.name).toBe('js-yaml');
        expect(general.pkg_type).toBe('npm');
        expect(general.component_id).toBe('js-yaml:3.10.0');
    });

    test('Artifact summary component issues', async () => {
        const response: ISummaryResponse = await xrayClient.summary().component(summaryRequest);
        expect(response).toBeTruthy();

        const issues: IIssue[] = response.artifacts[0].issues;
        expect(issues.length).toBeGreaterThanOrEqual(2);

        const firstIssue: IIssue | undefined = issues.find(issue => issue.summary === FIRST_ISSUE_SUMMARY);
        const secondIssue: IIssue | undefined = issues.find(issue => issue.summary === SECOND_ISSUE_SUMMARY);
        expect(firstIssue).toBeTruthy();
        expect(secondIssue).toBeTruthy();
        if (!firstIssue || !secondIssue) {
            return;
        }
        expect(firstIssue.description).toBeTruthy();
        expect(firstIssue.severity).toBe('Medium');
        expect(secondIssue.description).toBeTruthy();
        expect(secondIssue.severity).toBe('High');
    });

    test('Artifact summary component licenses', async () => {
        const response: ISummaryResponse = await xrayClient.summary().component(summaryRequest);
        expect(response).toBeTruthy();

        const licenses: ILicense[] = response.artifacts[0].licenses;
        expect(licenses.length).toBe(1);

        const license = licenses[0];
        expect(license.name).toBe('MIT');
        expect(license.full_name).toBe('The MIT License');
        expect(license.more_info_url.length).toBeGreaterThanOrEqual(4);
        expect(license.components.length).toBe(1);
        expect(license.components[0]).toBe('npm://js-yaml:3.10.0');
    });

    test('Artifact not exist', async () => {
        const notFoundArtifactRequest: ISummaryRequestModel = {
            component_details: [new ComponentDetails('npm://non-existing-component:1.2.3')]
        } as ISummaryRequestModel;
        const response: ISummaryResponse = await xrayClient.summary().component(notFoundArtifactRequest);
        expect(response).toBeTruthy();
        expect(response.artifacts.length).toBe(1);
        const artifact: IArtifact = response.artifacts[0];
        expect(artifact.general.component_id).toBe('non-existing-component:1.2.3');
        expect(artifact.issues.length).toBe(0);
        expect(artifact.licenses.length).toBe(1);

        const license = artifact.licenses[0];
        expect(license.name).toBe('Unknown');
        expect(license.full_name).toBe('Unknown license');
        expect(license.components.length).toBe(1);
        expect(license.components[0]).toBe('npm://non-existing-component:1.2.3');
    });
});

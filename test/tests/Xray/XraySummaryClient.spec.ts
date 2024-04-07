import {
    IArtifact,
    ComponentDetails,
    IGeneral,
    ICve,
    IIssue,
    IVulnerableComponent,
    ILicense,
    ISummaryRequestModel,
    ISummaryResponse,
} from '../../../model';
import { TestUtils } from '../../TestUtils';
import { JfrogClient } from '../../../src';

const jsYaml: ISummaryRequestModel = {
    component_details: [new ComponentDetails('npm://js-yaml:3.10.0')],
} as ISummaryRequestModel;
const FIRST_ISSUE_ID: string = 'XRAY-79036';
const FIRST_ISSUE_SUMMARY: string = 'Denial of Service in js-yaml';
const SECOND_ISSUE_ID: string = 'XRAY-80240';
const SECOND_ISSUE_SUMMARY: string = 'Code Injection in js-yaml';

const express: ISummaryRequestModel = {
    component_details: [new ComponentDetails('npm://express:4.0.0')],
} as ISummaryRequestModel;
const EXPRESS_ISSUE_SUMMARY: string =
    'The Express web framework before 3.11 and 4.x before 4.5 for Node.js does not provide a charset field in HTTP Content-Type headers in 400 level responses, which might allow remote attackers to conduct cross-site scripting (XSS) attacks via characters in a non-standard encoding.';

let jfrogClient: JfrogClient;

beforeAll(() => {
    jfrogClient = new JfrogClient(TestUtils.getJfrogClientConfig());
});
describe('Xray summary tests', () => {
    test('Artifact summary component', async () => {
        const response: ISummaryResponse = await jfrogClient.xray().summary().component(jsYaml);
        expect(response).toBeTruthy();
        const artifacts: IArtifact[] = response.artifacts;
        expect(artifacts.length).toBe(1);
    });

    test('Artifact summary component general', async () => {
        const response: ISummaryResponse = await jfrogClient.xray().summary().component(jsYaml);
        expect(response).toBeTruthy();

        const general: IGeneral = response.artifacts[0].general;
        expect(general).toBeTruthy();
        expect(general.name).toBe('js-yaml');
        expect(general.pkg_type).toBe('npm');
        expect(general.component_id).toBe('js-yaml:3.10.0');
    });

    test('Artifact summary component issues', async () => {
        const response: ISummaryResponse = await jfrogClient.xray().summary().component(jsYaml);
        expect(response).toBeTruthy();

        const issues: IIssue[] = response.artifacts[0].issues;
        expect(issues.length).toBeGreaterThanOrEqual(2);

        const firstIssue: IIssue | undefined = issues.find((issue) => issue.issue_id === FIRST_ISSUE_ID);
        const secondIssue: IIssue | undefined = issues.find((issue) => issue.issue_id === SECOND_ISSUE_ID);
        expect(firstIssue).toBeTruthy();
        expect(secondIssue).toBeTruthy();
        if (!firstIssue || !secondIssue) {
            return;
        }
        expect(firstIssue.description).toBeTruthy();
        expect(firstIssue.severity).toBe('Medium');
        expect(firstIssue.summary).toBe(FIRST_ISSUE_SUMMARY);
        expect(secondIssue.description).toBeTruthy();
        expect(secondIssue.severity).toBe('High');
        expect(secondIssue.summary).toBe(SECOND_ISSUE_SUMMARY);
    });

    test('Artifact Summary component CVE', async () => {
        const response: ISummaryResponse = await jfrogClient.xray().summary().component(express);
        expect(response).toBeTruthy();

        const issues: IIssue[] = response.artifacts[0].issues;
        expect(issues.length).toBeGreaterThanOrEqual(1);

        const testIssue: IIssue | undefined = issues.find((issue) => issue.summary === EXPRESS_ISSUE_SUMMARY);
        expect(testIssue).toBeTruthy();

        const cves: ICve[] | undefined = testIssue?.cves;
        expect(cves).toBeTruthy();
        if (!cves) {
            return;
        }
        expect(cves).toHaveLength(1);
        expect(cves[0].cve).toBe('CVE-2014-6393');
        expect(cves[0].cvss_v2).toBe('4.3/CVSS:2.0/AV:N/AC:M/Au:N/C:N/I:P/A:N');
    });

    test('Artifact Summary component fixed versions', async () => {
        const response: ISummaryResponse = await jfrogClient.xray().summary().component(express);
        expect(response).toBeTruthy();

        const issues: IIssue[] = response.artifacts[0].issues;
        expect(issues.length).toBeGreaterThanOrEqual(1);

        const testIssue: IIssue | undefined = issues.find((issue) => issue.summary === EXPRESS_ISSUE_SUMMARY);
        expect(testIssue).toBeTruthy();

        const components: IVulnerableComponent[] | undefined = testIssue?.components;
        expect(components).toBeTruthy();

        const expressComponent: IVulnerableComponent | undefined = components?.find(
            (component) => component.component_id === 'express'
        );
        expect(expressComponent).toBeTruthy();
        const fixedVersions: string[] | undefined = expressComponent?.fixed_versions;
        expect(fixedVersions).toBeTruthy();
        expect(fixedVersions?.length).toBeGreaterThanOrEqual(2);
        expect(fixedVersions).toContain('[3.11.0]');
        expect(fixedVersions).toContain('[4.5.0]');
    });

    test('Artifact summary component licenses', async () => {
        const response: ISummaryResponse = await jfrogClient.xray().summary().component(jsYaml);
        expect(response).toBeTruthy();

        const licenses: ILicense[] = response.artifacts[0].licenses;
        expect(licenses.length).toBe(1);

        const license: ILicense = licenses[0];
        expect(license.name).toBe('MIT');
        expect(license.full_name).toBe('The MIT License');
        expect(license.more_info_url.length).toBeGreaterThanOrEqual(4);
        expect(license.components.length).toBe(1);
        expect(license.components[0]).toBe('npm://js-yaml:3.10.0');
    });

    test('Artifact not exist', async () => {
        const notFoundArtifactRequest: ISummaryRequestModel = {
            component_details: [new ComponentDetails('npm://non-existing-component:1.2.3')],
        } as ISummaryRequestModel;
        const response: ISummaryResponse = await jfrogClient.xray().summary().component(notFoundArtifactRequest);
        expect(response).toBeTruthy();
        expect(response.artifacts.length).toBe(1);
        const artifact: IArtifact = response.artifacts[0];
        expect(artifact.general.component_id).toBe('non-existing-component:1.2.3');
        expect(artifact.issues.length).toBe(0);
        expect(artifact.licenses.length).toBe(1);

        const license: ILicense = artifact.licenses[0];
        expect(license.name).toBe('Unknown');
        expect(license.full_name).toBe('Unknown license');
        expect(license.components.length).toBe(1);
        expect(license.components[0]).toBe('npm://non-existing-component:1.2.3');
    });
});

import { IProperty } from './Property';

export interface ISearchEntry {
    repo: string;
    path: string;
    name: string;
    actual_sha1: string;
    actual_md5: string;
    size: number;
    created: string;
    modified: string;
    type: string;
    virtual_repos: string[];
    properties: IProperty[];
}

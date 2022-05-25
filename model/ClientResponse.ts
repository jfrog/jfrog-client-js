export interface IClientResponse {
    data?: any;
    headers?: { [key: string]: string };
    status: number;
}

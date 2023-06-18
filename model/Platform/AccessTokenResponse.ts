export interface AccessTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_id: string;
    token_type: string;
}

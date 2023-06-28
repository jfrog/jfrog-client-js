export class ClientUtils {
    public static addTrailingSlashIfMissing(url: string): string {
        return url + (url.endsWith('/') ? '' : '/');
    }
}

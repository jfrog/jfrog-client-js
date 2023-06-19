import { ClientUtils } from '../../src/ClientUtils';
describe('ClientUtils', () => {
    describe('addTrailingSlashIfMissing', () => {
        const expectedOutput: string = 'https://example.com/';
        
        it('should add a trailing slash when missing', () => {
            const input: string = 'https://example.com';

            const result: string = ClientUtils.addTrailingSlashIfMissing(input);

            expect(result).toBe(expectedOutput);
        });

        it('should not modify the URL if a trailing slash is already present', () => {
            const input: string = 'https://example.com/';

            const result: string = ClientUtils.addTrailingSlashIfMissing(input);

            expect(result).toBe(expectedOutput);
        });
    });
});

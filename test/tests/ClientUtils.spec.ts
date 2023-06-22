import { ClientUtils } from '../../src/ClientUtils';
describe('ClientUtils tests', () => {
    describe('AddTrailingSlashIfMissing', () => {
        const expectedOutput: string = 'https://example.com/';

        it('URL without trailing slash', () => {
            const input: string = 'https://example.com';

            const result: string = ClientUtils.addTrailingSlashIfMissing(input);

            expect(result).toBe(expectedOutput);
        });

        it('URL with trailing slash', () => {
            const input: string = 'https://example.com/';

            const result: string = ClientUtils.addTrailingSlashIfMissing(input);

            expect(result).toBe(expectedOutput);
        });
    });
});

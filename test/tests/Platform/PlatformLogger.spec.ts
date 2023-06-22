import * as faker from 'faker';
import { ILogger } from '../../../model';
import { PlatformLogger } from '../../../src/Platform/PlatformLogger';

const loggerMock: ILogger = {
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};

const logger: PlatformLogger = new PlatformLogger(loggerMock);

describe('Platform log tests', () => {
    test('warn log', () => {
        const message: string = faker.random.words(5);
        logger.warn(message);
        expect(loggerMock.warn).toHaveBeenCalledWith('PlatformClient: ' + message);
    });

    test('error log', () => {
        const message: string = faker.random.words(5);
        logger.error(message);
        expect(loggerMock.error).toHaveBeenCalledWith('PlatformClient: ' + message);
    });

    test('debug log', () => {
        const message: string = faker.random.words(5);
        logger.debug(message);
        expect(loggerMock.debug).toHaveBeenCalledWith('PlatformClient: ' + message);
    });
});

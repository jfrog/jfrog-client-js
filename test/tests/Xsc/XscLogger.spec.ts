import * as faker from 'faker';
import { ILogger } from '../../../model';
import { XscLogger } from '../../../src/Xsc/XscLogger';

const loggerMock: ILogger = {
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};
const logger: XscLogger = new XscLogger(loggerMock);

describe('Xsc Logger tests', () => {
    test('warn log', () => {
        const message: string = faker.random.words(5);
        logger.warn(message);
        expect(loggerMock.warn).toHaveBeenCalledWith('XscClient: ' + message);
    });

    test('error log', () => {
        const message: string = faker.random.words(5);
        logger.error(message);
        expect(loggerMock.error).toHaveBeenCalledWith('XscClient: ' + message);
    });

    test('debug log', () => {
        const message: string = faker.random.words(5);
        logger.debug(message);
        expect(loggerMock.debug).toHaveBeenCalledWith('XscClient: ' + message);
    });
});

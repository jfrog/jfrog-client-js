import * as faker from 'faker';
import { ILogger } from '../../../model';
import { XrayLogger } from '../../../src/Xray/XrayLogger';

const loggerMock: ILogger = {
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};
const logger: XrayLogger = new XrayLogger(loggerMock);

test('warn log', () => {
    const message: string = faker.random.words(5);
    logger.warn(message);
    expect(loggerMock.warn).toHaveBeenCalledWith('XrayClient: ' + message);
});

test('error log', () => {
    const message: string = faker.random.words(5);
    logger.error(message);
    expect(loggerMock.error).toHaveBeenCalledWith('XrayClient: ' + message);
});

test('debug log', () => {
    const message: string = faker.random.words(5);
    logger.debug(message);
    expect(loggerMock.debug).toHaveBeenCalledWith('XrayClient: ' + message);
});

import * as faker from 'faker';
import { XrayLogger } from '../src/XrayLogger';

const loggerMock = {
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
};
const logger = new XrayLogger(loggerMock);

test('warn log', () => {
    const message = faker.random.words(5);
    logger.warn(message);
    expect(loggerMock.warn).toHaveBeenCalledWith('XrayClient::' + message);
});

test('error log', () => {
    const message = faker.random.words(5);
    logger.error(message);
    expect(loggerMock.error).toHaveBeenCalledWith('XrayClient::' + message);
});

test('debug log', () => {
    const message = faker.random.words(5);
    logger.debug(message);
    expect(loggerMock.debug).toHaveBeenCalledWith('XrayClient::' + message);
});

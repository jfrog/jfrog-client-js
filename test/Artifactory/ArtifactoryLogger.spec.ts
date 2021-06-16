import * as faker from 'faker';
import { ArtifactoryLogger } from '../../src/Artifactory/ArtifactoryLogger';

const loggerMock = {
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};
const logger = new ArtifactoryLogger(loggerMock);

test('warn log', () => {
    const message = faker.random.words(5);
    logger.warn(message);
    expect(loggerMock.warn).toHaveBeenCalledWith('ArtifactoryClient::' + message);
});

test('error log', () => {
    const message = faker.random.words(5);
    logger.error(message);
    expect(loggerMock.error).toHaveBeenCalledWith('ArtifactoryClient::' + message);
});

test('debug log', () => {
    const message = faker.random.words(5);
    logger.debug(message);
    expect(loggerMock.debug).toHaveBeenCalledWith('ArtifactoryClient::' + message);
});

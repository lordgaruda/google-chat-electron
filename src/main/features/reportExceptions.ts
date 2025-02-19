import unhandled from 'electron-unhandled';
import log from 'electron-log';

export default async () => {
  unhandled({
    logger: log.error,
  });
};

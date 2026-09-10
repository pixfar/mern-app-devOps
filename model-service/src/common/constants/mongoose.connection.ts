import {
  CoreConfigService,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  MONGO_URI_PREFIX,
} from '../config/core/core.service';

const config = new CoreConfigService();

export function getDefaultDbConnectionString(): string {
  const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
  const mongoOptions = {
    authSource: 'admin',
  };

  const formattedOptions = Object.entries(mongoOptions)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const connectionString = `${mongoUriPrefix}://${config.get(
    DB_USER,
  )}:${config.get(DB_PASSWORD)}@${config.get(DB_HOST)}:${config.get(
    DB_PORT,
  )}/${config.get(DB_NAME)}?${formattedOptions}`;

  return connectionString;
}

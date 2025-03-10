import { DATA_SOURCE } from 'src/database/database.contracts';
import { DataSource } from 'typeorm';
import { TRACKED_URL_REPOSITORY } from './tracked-url.contracts';
import { TrackedUrl } from './tracked-url.entity';

export const trackedUrlProviders = [
  {
    provide: TRACKED_URL_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TrackedUrl),
    inject: [DATA_SOURCE],
  }
];

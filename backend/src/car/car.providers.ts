import { DataSource } from 'typeorm';
import { CAR_REPOSITORY, CAR_DETAILS_REPOSITORY, CAR_SPECIFICATION_REPOSITORY, CAR_IMAGE_REPOSITORY } from './car.contracts';
import { Car } from './car.entity';
import { CarDetails } from './car-details.entity';
import { CarSpecification } from './car-specification.entity';
import { CarImage } from './car-image.entity';
import { DATA_SOURCE } from 'src/database/database.contracts';

export const carProviders = [
  {
    provide: CAR_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Car),
    inject: [DATA_SOURCE],
  },
  {
    provide: CAR_DETAILS_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CarDetails),
    inject: [DATA_SOURCE],
  },
  {
    provide: CAR_SPECIFICATION_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CarSpecification),
    inject: [DATA_SOURCE],
  },
  {
    provide: CAR_IMAGE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CarImage),
    inject: [DATA_SOURCE],
  }
];

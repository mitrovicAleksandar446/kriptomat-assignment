import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

const config: MikroOrmModuleOptions = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  type: 'postgresql',
  autoLoadEntities: true,
  dbName: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT),
  migrations: {
    tableName: 'migrations',
    path: 'src/database/migrations',
    transactional: true,
    allOrNothing: true,
  },
};

export default config;

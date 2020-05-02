import { ConnectionOptions } from 'typeorm';
const ormOptions: ConnectionOptions = {
  type: 'postgres',
  username: 'root',
  password: 'password',
  database: 'myblog',
  logging: true,
  port: 5435,
  synchronize: true,
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  // migrations: ['src/migration/**/*.ts'],
  // subscribers: ['src/subscriber/**/*.ts'],
  // cli: {
  //   entitiesDir: 'src/entity',
  //   migrationsDir: 'src/migration',
  //   subscribersDir: 'src/subscriber',
  // },
};

export default ormOptions;

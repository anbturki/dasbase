import { ConnectionOptions } from 'typeorm';
const ormOptions: ConnectionOptions = {
  type: 'postgres',
  username: 'root',
  password: '',
  database: 'postgres',
  logging: true,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
};

export default ormOptions;

// import { ConnectionOptions } from 'typeorm';
// const ormOptions: ConnectionOptions = {
//   name: 'postgres',
//   type: 'postgres',
//   host: 'localhost',
//   port: 3306,
//   username: 'test',
//   password: 'test',
//   database: 'test',
//   synchronize: true,
//   logging: false,
//   entities: ['src/entity/**/*.ts'],
//   migrations: ['src/migration/**/*.ts'],
//   subscribers: ['src/subscriber/**/*.ts'],
// };

// export default ormOptions;

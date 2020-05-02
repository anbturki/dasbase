import { cleanEnv, str, port } from 'envalid';
import 'dotenv/config';

export default function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    SECRET_KEY: str(),
    DB_TYPE: str(),
  });
}

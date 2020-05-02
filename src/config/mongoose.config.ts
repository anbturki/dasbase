import { ConnectionOptions } from 'mongoose';
const options: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

export default options;

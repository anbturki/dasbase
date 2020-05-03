import { StrategyOptions, ExtractJwt } from 'passport-jwt';

const jwtPassportConfig: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY as string,
};

export default jwtPassportConfig;

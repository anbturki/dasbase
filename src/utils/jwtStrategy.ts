import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifiedCallback,
} from 'passport-jwt';
import passport from 'passport';
import jwtPassportConfig from '../config/jwtPassport.config';
import IJwtPayload from '../interfaces/IJwtPayload';
import User from '../modules/user/User';

/**
 * @method verifiedCallback
 * @param payload
 * @param done
 */
const verifiedCallback: VerifiedCallback = (payload: IJwtPayload, done) => {
  done(null, {});
};

const jwtStrategy = new JwtStrategy(jwtPassportConfig, verifiedCallback);

export default jwtStrategy;

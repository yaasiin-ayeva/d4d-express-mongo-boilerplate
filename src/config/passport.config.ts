import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import User from "../models/user.model";
import EnvConfig from "./env.config";

const passportConfig = (passport: any) => {

    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: EnvConfig.JWT_KEY
    }

    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, { message: "Incorrect email or password." });
                }

                if (bcrypt.compareSync(password, user.password) === false) {
                    return done(null, false, { message: "Incorrect email or password." });
                }

                if (user.enabled === false) {
                    return done(null, false, {
                        message: "We are sorry. The app is currently under maintenance.",
                    });
                }

                return done(null, user);
            }
        )
    );

    passport.use(
        new JwtStrategy(
            jwtOptions,
            async (payload: any, done: any) => {
                try {
                    const user = await User.findById(payload.userId);

                    if (!user) {
                        return done(null, false);
                    }

                    done(null, user);
                } catch (error) {

                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => {
            done(null, user);
        })
    })

    passport.generateHash = async (user, rememberMe = false) => {
        return jwt.sign({
            userId: user._id,
        },
            EnvConfig.JWT_KEY,
            {
                expiresIn: rememberMe ? EnvConfig.JWT_PROD_EXPIRE : EnvConfig.JWT_DEV_EXPIRE
            }
        )
    }
};


export default passportConfig;
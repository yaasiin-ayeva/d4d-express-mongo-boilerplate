const passport: any = require('passport');

const login = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({
                success: false,
                error: info.message
            });
        }

        req.login(user, { session: false }, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }

            const token = passport.generateHash(user);

            return res.json({
                success: true,
                message: 'Successfully login',
                user,
                token
            });
        });
    })(req, res, next);
};

export default {
    login
}
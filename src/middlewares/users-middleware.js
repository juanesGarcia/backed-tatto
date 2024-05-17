const passport = require("passport");

exports.userAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error en la autenticación.' });
        }
        if (!user) {
            console.warn('No user found:', info);
            return res.status(401).json({ message: 'No tienes permiso para acceder a este recurso.' });
        }
        req.user = user;
        next();
    })(req, res, next);
};

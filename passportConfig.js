const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./database');

exports.initializingPassport = (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false);
            }
            if (user.password !== password) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));
    passport.registerUserSerializer((user, request) => user.id);
    passport.registerUserDeserializer(async (id, request) => {
        return await User.findById(id);
    });
}
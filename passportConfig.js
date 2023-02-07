const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./database');

exports.initializingPassport = (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            console.log("password", password);
            console.log(user);
            if (!user) {
                return done(null, false);
            }
            if (user.validPassword(password)) {
                return done(null, user);
            }
            // return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));
    passport.registerUserSerializer((user, request) => user.id);
    passport.registerUserDeserializer(async (id, request) => {
        return await User.findById(id);
    });
}
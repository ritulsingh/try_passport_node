require("dotenv").config();
const fastify = require('fastify')({ logger: true });
const { connectMongoose, User } = require('./database');
const { initializingPassport } = require('./passportConfig');
const fastifySession = require('@fastify/session');
const fastifyCookie = require('@fastify/cookie');
const fastifyPassport = require('@fastify/passport');

const crypto = require('crypto');

const PORT = process.env.PORT || 5000;

connectMongoose(); // Connect to Database
initializingPassport(fastifyPassport);

// For Session
fastify.register(fastifyCookie);
fastify.register(fastifySession, { secret: 'a secret with a minimum length of 32 characters' });

// Passport Registration
fastify.register(fastifyPassport.initialize());
fastify.register(fastifyPassport.secureSession());

// For now its just for testing purposes
fastify.get('/', async (req, res) => {
    return { hello: 'world' }
})

// For registration of user
fastify.post('/register', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.status(200).send("User already registered");
    }
    let newUser = new User();
    newUser.username = req.body.username
    newUser.setPassword(req.body.password)
    newUser.save((err, user) => {
        if (err) {
            return res.status(400).send({
                message: "Failed to add user."
            });
        }
        else {
            return res.status(200).send({
                message: "User added successfully.", 
                data: user
            });
        }
    });
})

// For login of user
fastify.post('/login', {
    preValidation: fastifyPassport.authenticate('local')
}, async (req, res) => {
    res.send("User Successfully Login");
});

// Run the server!
fastify.listen({ port: PORT, host: "127.0.0.1" }, function (err, address) {
    console.log(`Server is now listening on ${address}`);
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
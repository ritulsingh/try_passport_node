require("dotenv").config();
const fastify = require('fastify')({ logger: true });
const { connectMongoose, User } = require('./database');

const PORT = process.env.PORT || 5000;

connectMongoose();

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
    const newUser = await User.create(req.body);
    res.status(201).send(newUser);
})

// Run the server!
fastify.listen({ port: PORT, host: "127.0.0.1" }, function (err, address) {
    console.log(`Server is now listening on ${address}`);
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
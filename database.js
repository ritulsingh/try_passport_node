const mongoose = require("mongoose")
const crypto = require("crypto");

exports.connectMongoose = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.DATABASE, connectionParams)
        console.log("Connected To Database")
    } catch (err) {
        console.log("Could not connect to database: " + err)
    }
}

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    hash: String,
    salt: String
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};

userSchema.methods.validPassword = function (password) {
    console.log(password)
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

exports.User = mongoose.model('User', userSchema);

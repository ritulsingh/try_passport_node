const mongoose = require("mongoose")

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
    password: String
});

exports.User = mongoose.model('User', userSchema);

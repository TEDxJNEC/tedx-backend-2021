
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        const db = mongoose.connection;
        db.on('error', (error: Error) => console.error(error));
        db.once('open', () => console.log('Connected to database 🐘'));
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

export default connectDB;
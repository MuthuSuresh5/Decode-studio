const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: path.join(__dirname, '..', 'config', 'config.env')});

const connectDatabase = () =>{
    mongoose.connect(process.env.MONGODB_URI).then(con => {
        console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
    }).catch(err => {
        console.error('Database connection error:', err);
    });
}

module.exports = connectDatabase;
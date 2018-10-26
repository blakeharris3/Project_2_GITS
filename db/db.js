const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost/gits';

// process.env lives in node, and heroku will attach a URI string to MONGODB_URI

mongoose.connect(connectionString, {useNewUrlParser: true});

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected at ', connectionString);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected ');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose error ', err);
});


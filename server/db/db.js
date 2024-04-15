const mongoose = require('mongoose');
const {DBHOST, DBPORT, DBNAME} = require('../config/config');
mongoose.set('strictQuery', true);

function connectToDatabase() {
  mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);
  mongoose.connection.once('open', () => {
    console.log('MongoDB connected');
  });
  mongoose.connection.on('error', () => {
    console.error('MongoDB connection error');
  });
  mongoose.connection.on('close', () => {
    console.log('連接關閉');
  });
}

function disconnectFromDatabase() {
  mongoose.disconnect(() => {
    console.log('MongoDB disconnected');
  });
}

module.exports = { connectToDatabase, disconnectFromDatabase };
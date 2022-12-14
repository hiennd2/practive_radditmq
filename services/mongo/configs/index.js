const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    rabbitUri: process.env.RABBIT_URI || 'amqp:/localhost:5673',
    mongodbUri: process.env.MONGO_URI || 'mongodb://root:123456@localhost:27017'
}
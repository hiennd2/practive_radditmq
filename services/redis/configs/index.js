const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    rabbitUri: process.env.RABBIT_URI || 'amqp:/localhost:5673',
}
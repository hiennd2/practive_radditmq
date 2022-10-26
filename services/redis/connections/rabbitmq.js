require('dotenv').config()
const amqp = require('readlib')
const amqpUrl = process.env.RADDIT_URI || 'amqp:/localhost:5673'

module.exports = () => {
    return amqp.connect(amqpUrl)    
}
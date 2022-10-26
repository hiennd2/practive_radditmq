require('dotenv').config()
const amqp = require('amqplib')

const amqpUrl = process.env.URL_RABBITMQ || 'amqp://localhost:5673'

module.exports = function getRabbit() {
    return amqp.connect(amqpUrl)
}
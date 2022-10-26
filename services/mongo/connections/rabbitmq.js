require('dotenv').config()
const amqp = require('amqplib')
const uri = require('../configs/index')

module.exports = function getRabbit() {
    return amqp.connect(uri.rabbitUri)
}
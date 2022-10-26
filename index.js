const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

const amqp = require('amqplib');
const amqpUrl = "amqp://localhost:5673"

async function sendData(exchange, queue, msg, routingKey = '') {
    const connection = await amqp.connect(amqpUrl)
    const channel = await connection.createChannel()

    try {
        await channel.assertExchange(exchange, 'direct', {
            durable: true
        })
    
        await channel.assertQueue(queue, {
            durable: true
        })        
        channel.prefetch(1)
        await channel.bindQueue(queue, exchange, routingKey)
        await channel.publish(exchange, routingKey, Buffer.from(msg))

    } catch (error) {
        console.error("publish error", error)
    } finally { 
        await channel.close()
        await connection.close()
        console.log("Connection closed")
    }
}


async function (exchange, queue, msg, routingKey = '') {
    const connection = await amqp.connect(amqpUrl)
    const channel = await connection.createChannel()

    await channel.assertQueue(queue, {
        durable: true
    })

    await channel.consume(queue, async (msg) => {
        console.log("msg: ",msg.content.toString())
    })

}



app.use('/', async (req, res) => {
    try {
        await sendData('test_exchange', 'test_queue', 'Hello world!!!', "black")
        await receiveData('test_exchange', 'test_queue', 'Hello world!!!', "black")
        res.send("Hello, world!")
    } catch (error) {
        console.log("error")
    }
})


app.listen(port, function() {
    console.log(`Listening on port ${port}`)
})

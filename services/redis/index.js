require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 8082

const amqp = require('amqplib')
const amqpUrl = process.env.URL_RADDITMQ || 'amqp://localhost:5673'

try {
    consumeData()
} catch (error) {
    console.log('Redis: ConsumeData Error')
}

async function consumeData() {
    const connection = await amqp.connect(amqpUrl)
    let channel = await connection.createChannel()

    let queue = 'queue_post'

    try {
        await channel.assertQueue(queue, {
            durable: true
        })
    } catch (error) {
        console.log('Error Redis')
    }
}

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

const express = require('express')
const getRabbit = require('./connections/rabbitmq')

async function run() {
    const rabbit = await getRabbit()

    const app = express()
    const port = process.env.PORT || 8080

    app.use(express.json())

    app.get('/', function (req, res) {
        let msg = "Gateway"
        publishData(msg)
        res.send("Gataway Success!!!")
    })


    async function publishData(msg) {
        try {
            let channel = await rabbit.createChannel()

            let exchange = 'echange_post'
            let queue = 'queue_post'
            let routingKey = 'routing_post'

            await channel.assertExchange(exchange, 'fanout', {
                durable: true
            })

            await channel.assertQueue(queue, { durable: true })

            await channel.bindQueue(queue, exchange, routingKey)

            channel.publish(exchange, routingKey, Buffer.from(msg))

            console.log("Gateway: publish success!")
        } catch (error) {
            console.log("Error gateway")
            console.log(error)
        }
    }

    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

try {
    run() 
} catch (error) {
    console.log('Error')
}
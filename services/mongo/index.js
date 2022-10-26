const express = require('express')
const app = express()
const port = 8081

const getClient = require('./connections/mongo')
const getRabbit = require('./connections/rabbitmq')

try {
    run()
} catch (error) {
    console.log("Error ConsumeData")
}
async function run() {
    const client = await getClient()
    const db =  client.db('posts')

    const rabbit = await getRabbit()

    try {
        consumeData()
    } catch (error) {
        console.log("Error ConsumeData")
    }

    async function consumeData() {
        let channel = await rabbit.createChannel()

        try {
            let queue = 'queue_post'
            await channel.assertQueue(queue, {
                durable: true
            })

            await channel.consume(queue, async function (msg) {
                const collection = db.collection('documents');
                try {
                    await collection.insertOne({
                        message: "test"
                    })                

                    console.log('Insert Success!')
                } catch (error) {
                    console.log('Insert Error!')
                }
                channel.ack(msg) 
            }, {
                noAck: false // thu cong, can co channel.ack(msg)
            })

            console.log("Mongo: Consume Success!!!")
        } catch (error) {
            console.log("Error Mongo")
            console.log(error)
        }
    }

    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

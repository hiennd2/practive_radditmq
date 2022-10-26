require('dotenv').config()
const amqp = require('amqplib')
const amqpUrl = process.env.RABBIT_URI || 'amqp://localhost:5673'

const express = require('express')
const app = express()
const port = 8081

const getClient = require('./connections/mongo')
const { MongoClient } = require('mongodb');

try {
    run()
} catch (error) {
    console.log("Error ConsumeData")
}
async function run() {
    const client = await getClient()
    const db =  client.db('posts')

    try {
        consumeData()
    } catch (error) {
        console.log("Error ConsumeData")
    }

    async function consumeData() {
        let connection = await amqp.connect(amqpUrl)
        let channel = await connection.createChannel()

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
                noAck: false // thu cong, can co ack(msg)
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

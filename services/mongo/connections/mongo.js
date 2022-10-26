const { MongoClient } = require('mongodb');
const uri = require('../configs/index')

const client = new MongoClient(uri.mongodbUri);

module.exports = async function getClient() {
    await client.connect()

    console.log('Connected successfully to server');
    
    return client
} 


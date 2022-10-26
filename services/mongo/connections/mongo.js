const { MongoClient } = require('mongodb');
var url = 'mongodb://root:123456@localhost:27017';

const client = new MongoClient(url);

module.exports = async function getClient() {
    await client.connect()
    console.log('Connected successfully to server');
    return client
} 


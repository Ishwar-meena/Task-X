const { MongoClient } = require('mongodb');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
require('dotenv').config();
app.use(bodyParser.json())
app.use(cors())
const port = 3000

// Connection URL
const url = process.env.MONGOURI;
const client = new MongoClient(url);
// Database Name
const dbName = 'TaskX';

// load all the data from the database 
app.get('/', async(req, res) => {
    
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('Task Manager');
    const findResult = await collection.find({}).toArray();
    res.send(findResult);
    // res.send("Successfully fetched data")
})
// Save data to database 
app.post('/',async(req,res)=>{
    const task = req.body;
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('Task Manager');
    const saveResult = await collection.insertOne(task);
    res.json({success:true,data:saveResult});
})
// Delete data from database 
app.delete('/',async(req,res)=>{
    const task = req.body;
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('Task Manager');
    const deleteResult = await collection.deleteOne(task);
    res.json({success:true,data:deleteResult});
})
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})
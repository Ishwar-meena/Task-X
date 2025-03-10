const { MongoClient } = require('mongodb');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();

const app = express()
const port = 3000
app.use(bodyParser.json())

// const frontedUrl = 'http://localhost:5173';
const frontedUrl = 'https://task-x-frontend.vercel.app';
// Configuration for CORS
const corsOptions = {
    origin: frontedUrl,
    methods: ['GET', 'POST', 'DELETE','PUT'],
    allowedHeaders: ['Content-Type','Authorization'],
};
app.use(cors(corsOptions));

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
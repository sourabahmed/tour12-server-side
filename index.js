const express = require('express')
var MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.u39pp.mongodb.net:27017,cluster0-shard-00-01.u39pp.mongodb.net:27017,cluster0-shard-00-02.u39pp.mongodb.net:27017/tour12DB?ssl=true&replicaSet=atlas-8558zv-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("tour12DB");
        const allPackages = database.collection("packages");

        // post event data data
        app.post('/packages', async(req, res) => {
            const data = req.body;
            const result = await allPackages.insertOne(data);
            res.send(result);
            console.log('posted data');
        })
        // get event data
        app.get('/packages', async(req, res) => {
            const result = await allPackages.find({}).toArray();
            res.send(result);
            console.log('got data');
        })
    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello I am from server!')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port =process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())


//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k4uag68.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const allTouristsSpots = client.db('AllTouristsSpots')
    const allSpots = allTouristsSpots.collection('AllSpots')
    const addedSpots = allTouristsSpots.collection('AddedSpots')


    app.get('/UpdateTouristsSpots', async(req, res)=>{
      const cursor = allSpots.find()
      const result = await cursor.toArray()
      res.send(result)

    })

    app.post('/UpdateTouristsSpots', async (req, res) => {
    const newSpot = req.body;
    try {
        const result1 = await addedSpots.insertOne(newSpot);
        const result2 = await allSpots.insertOne(newSpot);
        res.json({ result1, result2 });
    } catch (err) {
        console.error("Error inserting data into collections:", err);        
    }
});



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', async(req, res) =>{
    res.send('Touring server is running')
})


app.listen(port, ()=>{
    console.log(`coffee server is running on port: ${port}`)
})
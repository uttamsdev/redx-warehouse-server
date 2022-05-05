const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const req = require("express/lib/request");
const res = require("express/lib/response");
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());
require('dotenv').config();





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vlwf0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    await client.connect();
    const productsCollection = client.db('redxWarehouse').collection('products');

    //getting all products
    app.get('/products',async(req,res)=>{
        const query = {};
        const cursor = productsCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const product = await productsCollection.findOne(query);
        res.send(product);
      });

      //delete
      app.delete('/products/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await productsCollection.deleteOne(query);
        res.send(result);
    });
    
    //insert users added items
    app.post('/products',async(req,res)=>{
        const query = req.body;
        const result = await productsCollection.insertOne(query);
        res.send(result);
    });

    //getting data from search query
    app.get('/items', async (req, res) => {
        const email = req.query.email;
            const query = { email: email };
            const cursor = productsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
    })

}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('RedX server is running...');
})

app.listen(port,()=>{
    console.log('Listening to port: ',port);
})
const express = require('express');
const app = express();
const cors = require('cors');
// from dot env config start>
require('dotenv').config();
// from dot env config end>
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());
//for data base connection start>

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const res = require('express/lib/response');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i5ort.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    await client.connect();

    //user details collection start>
    const userCollection = client.db("bistroDb").collection("users");
    //user details collection end>

    // Get the  menu database and collection start>
    const menuCollection = client.db("bistroDb").collection("menu");

    const reviewCollection = client.db("bistroDb").collection("reviews");

    //if collection data for carts start>
    const cartCollection = client.db("bistroDb").collection("carts");

    //users reletade api st
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })
    //users reletade api end
    
    app.get('/menu', async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    })
    //rivews data loaded start....
    app.get('/reviews', async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    })

    // // carts collection start>

    app.get('/cart', async (req, res) => {
      //user email ta anlam st
      const email = req.query.email;
      const query = { email: email };
      //user email ta anlam end

      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/carts', async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    })
    //carts collection end>

    //for api delete option st
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })
    //for delete api end

    // Get the nenu database and collection end>



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
//for data base connection end>

app.get('/', (req, res) => {
  res.send('Boss is Jahir')
});

app.listen(port, () => {
  console.log(`Bistro Boss is Jahir on port ${port}`)
});




/**
 * ----------
 * NAMING CONVENTION
 * ----------------
 * app.get('/users')
 * app.get('/users/:id')
 * app.post('/users')
 * app.put('/users/:id')
 * app.patch('/users/:id')
 * app.delete('/users/:id')
 * 
*/
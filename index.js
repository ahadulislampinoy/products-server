const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server of products");
});

// user: dbuser3
// pass: 4J2r61GDBi2xe1O8
// const uri = "mongodb://localhost:27017";
const uri =
  "mongodb+srv://dbuser3:4J2r61GDBi2xe1O8@cluster0.5a1umhj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCollections = client.db("myServer").collection("products");

    // Add products to database
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollections.insertOne(product);
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = productCollections.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // Deelete products from database
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollections.deleteOne(query);
      res.send(result);
    });

    // Update product data to database
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollections.findOne(query);
      res.send(result);
    });

    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = {
        $set: {
          name: product.name,
          price: product.price,
          quantity: product.quantity,
        },
      };
      const result = await productCollections.updateOne(
        filter,
        updatedProduct,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
// mongodb end

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

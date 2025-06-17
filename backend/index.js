const connectToMongo = require('./db');
require("dotenv").config()
connectToMongo();
const express = require('express');
const app = express();
const port = process.env.PORT;
const cors = require('cors'); // ✅ Import cors

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"))
// ✅ Enable CORS for all origins (or configure it)
/*app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Available routes
app.use("/api/auth", require("./routes/auth"))
// Test route*/

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`);
});